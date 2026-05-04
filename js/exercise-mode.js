/**
 * MendelSim — shared teacher/student exercise helpers.
 */
(function () {
  function escapeHTML(text) {
    return String(text || '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[ch]));
  }

  function formatGenotypeHTML(text) {
    return escapeHTML(text).replace(/([A-Za-z])\^([A-Za-z0-9]+)/g, '$1<sup>$2</sup>');
  }

  function safeFilename(text, fallback = 'ejercicio-mendelsim') {
    return (text || fallback)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || fallback;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function encodeData(data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeData(encoded) {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - encoded.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function switchTab(name, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));
    const tab = document.getElementById('tab-' + name);
    if (tab) tab.classList.add('active');
    const activeButton = btn || document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (activeButton) activeButton.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showStudentTab(studentOnly = false) {
    const btn = document.getElementById('studentTabBtn');
    if (btn) btn.style.display = '';
    const tabs = document.querySelector('.tabs');
    if (tabs) {
      tabs.classList.remove('student-only-tabs');
      tabs.style.display = '';
    }
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.style.display = '';
    });
    switchTab('alumno', btn);
  }

  function showStudentEmpty(title = t('exercise.defaultTitle', 'Actividad MendelSim')) {
    const titleEl = document.getElementById('studentExerciseTitle');
    if (titleEl) titleEl.textContent = title;
    const promptBox = document.getElementById('studentExercisePrompt');
    const promptText = document.getElementById('studentExercisePromptText');
    if (promptBox) promptBox.style.display = '';
    if (promptText) {
      promptText.textContent = t('exercise.loadFromProfessor', 'Abre el enlace que te ha dado tu profesor/a o carga el archivo JSON de actividad.');
    }
    const meta = document.getElementById('studentExerciseMeta');
    if (meta) meta.innerHTML = '';
    const sections = document.getElementById('studentAnswerSections');
    if (sections) {
      sections.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">📂</span><div>${t('exercise.noActivityLoaded', 'No hay actividad cargada. Usa el botón para cargar un archivo JSON de actividad.')}</div></div>`;
    }
    const checkBtn = document.getElementById('studentCheckBtn');
    if (checkBtn) checkBtn.disabled = true;
    const note = document.getElementById('studentAutoCheckNote');
    if (note) note.textContent = t('exercise.noActivityLoadedNote', 'Todavía no hay una actividad cargada.');
  }

  function setStatus(id, message, type = '') {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = type ? `exercise-status ${type}` : 'exercise-status';
    el.textContent = message || '';
    if (message) {
      clearTimeout(setStatus._timer);
      setStatus._timer = setTimeout(() => { el.textContent = ''; }, 5000);
    }
  }

  async function copyText(text, fallbackPrompt, onSuccess) {
    try {
      await navigator.clipboard.writeText(text);
      if (onSuccess) onSuccess();
    } catch (err) {
      prompt(fallbackPrompt || 'Copia este texto:', text);
      if (onSuccess) onSuccess();
    }
  }

  function readJSONFile(event, callback) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        callback(JSON.parse(reader.result), file.name);
      } catch (err) {
        alert(err.message || 'No se pudo leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  function countToPercent(count, total) {
    if (!total) return 0;
    return Math.round((Number(count) / Number(total)) * 100);
  }

  function buildRatioString(rows) {
    const counts = rows.map(row => row.count).filter(count => count > 0);
    if (!counts.length) return '0';
    const gcd = counts.reduce((a, b) => {
      while (b) [a, b] = [b, a % b];
      return a;
    });
    return rows
      .filter(row => row.count > 0)
      .map(row => `${row.count / gcd} ${row.label}`)
      .join(' : ');
  }

  function renderStudentActivity(data, solution, options = {}) {
    const title = data.metadata?.title || options.defaultTitle || t('exercise.defaultTitle', 'Actividad MendelSim');
    const prompt = data.metadata?.prompt || '';
    const meta = data.metadata || {};

    document.getElementById('studentExerciseTitle').textContent = title;
    const promptBox = document.getElementById('studentExercisePrompt');
    const promptText = document.getElementById('studentExercisePromptText');
    if (prompt) {
      promptBox.style.display = '';
      promptText.innerHTML = formatGenotypeHTML(prompt).replace(/\n/g, '<br>');
    } else {
      promptBox.style.display = 'none';
      promptText.innerHTML = '';
    }

    const metaItems = [];
    if (meta.trait) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.trait', 'Rasgo')}</strong><br>${escapeHTML(meta.trait)}</div>`);
    if (meta.crossLabel) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.cross', 'Cruce')}</strong><br>${formatGenotypeHTML(meta.crossLabel)}</div>`);
    if (meta.inheritance) metaItems.push(`<div class="student-meta-item"><strong>${t('exercise.model', 'Modelo')}</strong><br>${escapeHTML(meta.inheritance)}</div>`);
    document.getElementById('studentExerciseMeta').innerHTML = metaItems.join('');

    const form = document.getElementById('studentAnswerSections');
    form.innerHTML = '';
    solution.sections.forEach(section => {
      const tableRows = section.rows.map(row => `
        <tr>
          <td>${formatGenotypeHTML(row.label)}</td>
          <td><input type="number" min="0" max="${section.total}" step="1" data-section="${section.id}" data-key="${escapeHTML(row.key)}" class="student-count-input" placeholder="0"></td>
          <td class="exercise-total">/ ${section.total}</td>
        </tr>
      `).join('');
      form.innerHTML += `
        <div class="exercise-answer-section">
          <div class="section-title">${escapeHTML(section.title)}</div>
          <table class="exercise-answer-table">
            <thead><tr><th>${t('exercise.result', 'Resultado')}</th><th>${t('exercise.cases', 'Casos')}</th><th>${t('exercise.total', 'Total')}</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      `;
    });

    document.getElementById('studentName').value = '';
    document.getElementById('studentJustification').value = '';
    const feedback = document.getElementById('studentFeedback');
    feedback.className = 'alert student-feedback';
    feedback.innerHTML = '';
    const autoCheck = !!data.assignment?.allowAutoCheck && !!data.solution;
    const checkBtn = document.getElementById('studentCheckBtn');
    if (checkBtn) checkBtn.disabled = !autoCheck;
    document.getElementById('studentAutoCheckNote').textContent = autoCheck
      ? t('exercise.autoCheckEnabled', 'El profesor ha activado la autocorrección para esta actividad.')
      : t('exercise.autoCheckDisabled', 'El profesor no ha activado la autocorrección. Completa la respuesta y envíala.');
  }

  function collectStudentAnswers(solution) {
    const counts = {};
    document.querySelectorAll('.student-count-input').forEach(input => {
      const section = input.dataset.section;
      const key = input.dataset.key;
      if (!counts[section]) counts[section] = {};
      counts[section][key] = input.value === '' ? null : Number(input.value);
    });
    return {
      type: 'mendelsim-cross-answer',
      version: 1,
      studentName: document.getElementById('studentName')?.value.trim() || '',
      justification: document.getElementById('studentJustification')?.value.trim() || '',
      counts,
      summary: solution.sections.map(section => ({
        title: section.title,
        rows: section.rows.map(row => ({
          label: row.label,
          count: counts[section.id]?.[row.key],
          total: section.total,
        })),
      })),
      sentAt: new Date().toISOString(),
    };
  }

  function checkStudentAnswers(solution) {
    const answer = collectStudentAnswers(solution);
    let correct = 0;
    let total = 0;
    const lines = [];
    solution.sections.forEach(section => {
      lines.push(`<p><strong>${escapeHTML(section.title)}</strong></p>`);
      section.rows.forEach(row => {
        total++;
        const value = answer.counts[section.id]?.[row.key];
        const ok = Number(value) === Number(row.count);
        if (ok) correct++;
        lines.push(`<p><span class="${ok ? 'check-ok' : 'check-error'}">${ok ? '✓' : '✗'}</span> ${formatGenotypeHTML(row.label)}: ${value ?? t('exercise.notAnswered', '(sin responder)')} / ${section.total}${ok ? '' : `; ${t('exercise.reference', 'referencia')}: ${row.count} / ${section.total} (${countToPercent(row.count, section.total)}%)`}</p>`);
      });
    });

    const feedback = document.getElementById('studentFeedback');
    feedback.className = `alert student-feedback visible ${correct === total ? 'alert-success' : 'alert-warning'}`;
    feedback.innerHTML = `<p><strong>${t('exercise.checkResult', 'Resultado:')}</strong> ${correct}/${total} ${t('exercise.correctAnswers', 'respuestas correctas.')}</p>${lines.join('')}`;
  }

  function formatAnswersText(data, solution) {
    const answer = collectStudentAnswers(solution);
    const lines = [
      `${t('exercise.activity', 'Activitat')}: ${data.metadata?.title || t('exercise.defaultTitle', 'Actividad MendelSim')}`,
      `${t('exercise.student', 'Alumno/a')}: ${answer.studentName || t('exercise.noName', '(sin nombre)')}`,
      '',
      `${t('exercise.answers', 'Respuestas')}:`,
    ];
    answer.summary.forEach(section => {
      lines.push(`\n${section.title}`);
      section.rows.forEach(row => {
        lines.push(`- ${row.label}: ${row.count ?? t('exercise.notAnswered', '(sin responder)')} / ${row.total}`);
      });
    });
    lines.push('', `${t('exercise.justification', 'Justificación')}:`, answer.justification || t('exercise.notAnswered', '(sin responder)'));
    return lines.join('\n');
  }

  function loadFromHash(callback) {
    const match = location.hash.match(/^#actividad=(.+)$/);
    if (!match) return false;
    try {
      callback(decodeData(match[1]), 'URL compartida');
      return true;
    } catch (err) {
      console.error(err);
      alert(t('exercise.urlError', 'No se pudo leer la actividad desde la URL.'));
      return false;
    }
  }

  window.MendelSimExercises = {
    escapeHTML,
    formatGenotypeHTML,
    safeFilename,
    downloadBlob,
    encodeData,
    decodeData,
    switchTab,
    showStudentTab,
    showStudentEmpty,
    setStatus,
    copyText,
    readJSONFile,
    countToPercent,
    buildRatioString,
    renderStudentActivity,
    collectStudentAnswers,
    checkStudentAnswers,
    formatAnswersText,
    loadFromHash,
  };
})();
