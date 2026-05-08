/**
 * MendelSim — open a saved JSON file from the home page and route it to
 * the module that can load it.
 */
(function () {
  const STORAGE_PREFIX = 'mendelsim:pending-json:';
  const HASH_RE = /^#archivo=([a-zA-Z0-9._:-]+)$/;
  const MODULE_PATHS = {
    monohibrido: 'monohibrido.html',
    dihibrido: 'dihibrido.html',
    'ligado-sexo': 'ligado-sexo.html',
    pedigri: 'pedigri.html',
  };

  function detectModule(data) {
    if (!data || typeof data !== 'object') return '';
    if (data.type === 'mendelsim-cross-exercise') return data.module || '';
    if (data.type === 'mendelsim-cross-answer') return data.activity?.module || '';
    if (data.type === 'mendelsim-pedigree-case' || data.type === 'mendelsim-pedigree-answer') return 'pedigri';
    if (Array.isArray(data.individuals) && Array.isArray(data.couples)) return 'pedigri';
    return '';
  }

  function getModulePath(module) {
    return MODULE_PATHS[module] || '';
  }

  function makeStorageKey() {
    if (window.crypto?.randomUUID) return `${STORAGE_PREFIX}${crypto.randomUUID()}`;
    return `${STORAGE_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function storePendingFile(data, fileName) {
    const key = makeStorageKey();
    sessionStorage.setItem(key, JSON.stringify({
      data,
      fileName: fileName || 'archivo JSON',
      storedAt: Date.now(),
    }));
    return key.slice(STORAGE_PREFIX.length);
  }

  function readPendingFromHash() {
    const match = location.hash.match(HASH_RE);
    if (!match) return null;
    const key = `${STORAGE_PREFIX}${match[1]}`;
    const raw = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    if (!raw) {
      throw new Error('No se ha encontrado el archivo JSON temporal. Vuelve a abrirlo desde la página inicial.');
    }
    return JSON.parse(raw);
  }

  function routeDataFromHome(data, fileName) {
    const module = detectModule(data);
    const modulePath = getModulePath(module);
    if (!modulePath) {
      throw new Error('Este JSON no corresponde a una actividad o respuesta de MendelSim reconocida.');
    }
    const key = storePendingFile(data, fileName);
    const url = new URL(`modulos/${modulePath}`, location.href);
    const lang = window.MendelSimI18n?.getLocale?.();
    if (lang && lang !== 'es') url.searchParams.set('lang', lang);
    url.hash = `archivo=${key}`;
    location.href = `modulos/${modulePath}${url.search}${url.hash}`;
  }

  function openFileFromHome(event) {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        routeDataFromHome(JSON.parse(reader.result), file.name);
      } catch (err) {
        alert(err.message || 'No se pudo abrir el archivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  function loadPendingCrossFile(activityLoader) {
    let pending;
    try {
      pending = readPendingFromHash();
    } catch (err) {
      alert(err.message || 'No se pudo recuperar el archivo JSON.');
      return false;
    }
    if (!pending) return false;

    const data = pending.data;
    const sourceLabel = pending.fileName || 'archivo JSON';
    try {
      if (data?.type === 'mendelsim-cross-answer' && data.activity) {
        activityLoader(data.activity, sourceLabel);
        if (window.MendelSimExercises?.restoreStudentAnswers) {
          window.MendelSimExercises.restoreStudentAnswers(data);
        }
        return true;
      }
      activityLoader(data, sourceLabel);
      return true;
    } catch (err) {
      alert(err.message || 'No se pudo cargar el archivo JSON.');
      return false;
    }
  }

  function loadPendingPedigreeFile(loadCase, loadStudentAnswer, loadStudentAssignment) {
    let pending;
    try {
      pending = readPendingFromHash();
    } catch (err) {
      alert(err.message || 'No se pudo recuperar el archivo JSON.');
      return false;
    }
    if (!pending) return false;

    const data = pending.data;
    const sourceLabel = pending.fileName || 'archivo JSON';
    try {
      if (data?.type === 'mendelsim-pedigree-answer') {
        loadStudentAnswer(data, sourceLabel);
      } else if (data?.launchMode === 'student') {
        loadStudentAssignment(data, sourceLabel);
      } else {
        loadCase(data, sourceLabel);
      }
      return true;
    } catch (err) {
      alert(err.message || 'No se pudo cargar el archivo JSON.');
      return false;
    }
  }

  window.MendelSimJsonLauncher = {
    detectModule,
    getModulePath,
    openFileFromHome,
    loadPendingCrossFile,
    loadPendingPedigreeFile,
  };
})();
