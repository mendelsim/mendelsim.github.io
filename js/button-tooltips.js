/**
 * MendelSim — contextual button tooltips.
 */
(function () {
  const TEXTS = {
    es: {
      darkToggle: 'Cambia entre modo claro y modo oscuro.',
      openHomeFile: 'Abre un archivo guardado de MendelSim y lo lleva automáticamente a su módulo.',
      tabSimular: 'Modo de simulación: practica libremente con cruces y resultados.',
      tabCrear: 'Modo profesor: crea una actividad para compartir con el alumnado.',
      tabAlumno: 'Modo alumno: carga, resuelve y entrega una actividad.',
      tabAnalizar: 'Analiza casos de pedigrí ya preparados con pistas y solución.',
      tabPracticar: 'Practica identificando patrones de herencia en pedigríes.',
      tabConstructor: 'Modo profesor: construye o edita un caso de pedigrí.',
      tabRespuesta: 'Modo alumno o revisión: resuelve una actividad o revisa una respuesta cargada.',
      preset: 'Carga este ejemplo en el simulador.',
      randomExample: 'Genera un ejemplo nuevo con datos al azar.',
      customExample: 'Activa el modo personalizado para elegir libremente los datos.',
      runCross: 'Calcula el cruce con los datos seleccionados y muestra el cuadro de Punnett.',
      clearCross: 'Limpia los resultados para empezar de nuevo.',
      teacherPreview: 'Modo profesor: muestra cómo verá la actividad el alumnado.',
      teacherShare: 'Modo profesor: copia un enlace para enviar la actividad al alumnado.',
      teacherSaveEditable: 'Modo profesor: guarda un archivo editable para modificarlo más adelante.',
      teacherSaveStudent: 'Modo profesor: guarda un archivo listo para que lo resuelva el alumnado.',
      teacherLoadActivity: 'Modo profesor: carga una actividad guardada para revisarla o modificarla.',
      studentCheck: 'Modo alumno: comprueba tus respuestas si el profesor ha activado la autocorrección.',
      studentLoadActivity: 'Modo alumno: carga la actividad que te ha dado el profesor.',
      studentDownload: 'Modo alumno: descarga tus respuestas para entregarlas.',
      studentCopy: 'Modo alumno: copia tus respuestas para pegarlas en otra plataforma.',
      studentPrint: 'Modo alumno: imprime o guarda tus respuestas como PDF.',
      studentShareUrl: 'Modo alumno: copia un enlace con tus respuestas para enviarlo al profesor.',
      analysisGenerate: 'Genera otro caso de pedigrí para analizar.',
      analysisEditCopy: 'Modo profesor: copia este caso al constructor para editarlo.',
      clue: 'Muestra una pista del caso actual.',
      solution: 'Muestra u oculta la solución del caso actual.',
      resetExercise: 'Reinicia el caso actual y oculta pistas y solución.',
      resetScore: 'Borra la puntuación acumulada de práctica.',
      practiceCheck: 'Comprueba el patrón de herencia elegido y la justificación.',
      toolSelect: 'Constructor: mueve individuos del pedigrí.',
      toolAddMale: 'Constructor: añade un individuo masculino al pedigrí.',
      toolAddFemale: 'Constructor: añade un individuo femenino al pedigrí.',
      toolCouple: 'Constructor: une dos individuos como pareja.',
      toolChild: 'Constructor: añade descendientes a una pareja.',
      toolAffected: 'Constructor: marca o desmarca individuos afectados.',
      toolCarrier: 'Constructor: marca o desmarca individuos portadores.',
      toolDelete: 'Constructor: elimina individuos o relaciones.',
      toolClear: 'Constructor: borra el pedigrí actual.',
      childRandom: 'Constructor: el sexo del nuevo descendiente se elegirá al azar.',
      childMale: 'Constructor: el nuevo descendiente será masculino.',
      childFemale: 'Constructor: el nuevo descendiente será femenino.',
      zoomOut: 'Aleja el árbol para ver más espacio.',
      zoomIn: 'Acerca el árbol para ver más detalle.',
      zoomReset: 'Restaura el zoom del árbol al tamaño inicial.',
      fullscreen: 'Muestra u oculta el constructor a pantalla completa.',
      printTree: 'Imprime el árbol o guárdalo como PDF.',
      analyzeBuilder: 'Constructor: analiza el patrón de herencia compatible con el árbol.',
      loadBuilderExample: 'Constructor: carga un pedigrí de ejemplo para editarlo.',
      loadBuilderCase: 'Constructor: carga un caso guardado de pedigrí.',
      reviewStudentAnswer: 'Modo profesor: carga una respuesta de alumno para revisarla.',
      shareBuilder: 'Modo profesor: copia un enlace para que el alumnado resuelva el pedigrí.',
      pngBuilder: 'Constructor: descarga una imagen PNG del árbol.',
      saveBuilderEditable: 'Modo profesor: guarda el caso editable de pedigrí.',
      saveBuilderStudent: 'Modo profesor: guarda el pedigrí como actividad para el alumnado.',
    },
    ca: {
      darkToggle: 'Canvia entre mode clar i mode fosc.',
      openHomeFile: 'Obre un fitxer desat de MendelSim i el porta automàticament al seu mòdul.',
      tabSimular: 'Mode de simulació: practica lliurement amb encreuaments i resultats.',
      tabCrear: 'Mode professor: crea una activitat per compartir amb l’alumnat.',
      tabAlumno: 'Mode alumne: carrega, resol i lliura una activitat.',
      tabAnalizar: 'Analitza casos de pedigrí preparats amb pistes i solució.',
      tabPracticar: 'Practica identificant patrons d’herència en pedigrís.',
      tabConstructor: 'Mode professor: construeix o edita un cas de pedigrí.',
      tabRespuesta: 'Mode alumne o revisió: resol una activitat o revisa una resposta carregada.',
      preset: 'Carrega aquest exemple al simulador.',
      randomExample: 'Genera un exemple nou amb dades a l’atzar.',
      customExample: 'Activa el mode personalitzat per triar lliurement les dades.',
      runCross: 'Calcula l’encreuament amb les dades seleccionades i mostra el quadre de Punnett.',
      clearCross: 'Neteja els resultats per tornar a començar.',
      teacherPreview: 'Mode professor: mostra com veurà l’activitat l’alumnat.',
      teacherShare: 'Mode professor: copia un enllaç per enviar l’activitat a l’alumnat.',
      teacherSaveEditable: 'Mode professor: desa un fitxer editable per modificar-lo més endavant.',
      teacherSaveStudent: 'Mode professor: desa un fitxer preparat perquè el resolgui l’alumnat.',
      teacherLoadActivity: 'Mode professor: carrega una activitat desada per revisar-la o modificar-la.',
      studentCheck: 'Mode alumne: comprova les respostes si el professor ha activat l’autocorrecció.',
      studentLoadActivity: 'Mode alumne: carrega l’activitat que t’ha donat el professor.',
      studentDownload: 'Mode alumne: descarrega les respostes per lliurar-les.',
      studentCopy: 'Mode alumne: copia les respostes per enganxar-les en una altra plataforma.',
      studentPrint: 'Mode alumne: imprimeix o desa les respostes com a PDF.',
      studentShareUrl: 'Mode alumne: copia un enllaç amb les respostes per enviar-lo al professor.',
      analysisGenerate: 'Genera un altre cas de pedigrí per analitzar.',
      analysisEditCopy: 'Mode professor: copia aquest cas al constructor per editar-lo.',
      clue: 'Mostra una pista del cas actual.',
      solution: 'Mostra o amaga la solució del cas actual.',
      resetExercise: 'Reinicia el cas actual i amaga pistes i solució.',
      resetScore: 'Esborra la puntuació acumulada de pràctica.',
      practiceCheck: 'Comprova el patró d’herència triat i la justificació.',
      toolSelect: 'Constructor: mou individus del pedigrí.',
      toolAddMale: 'Constructor: afegeix un individu masculí al pedigrí.',
      toolAddFemale: 'Constructor: afegeix un individu femení al pedigrí.',
      toolCouple: 'Constructor: uneix dos individus com a parella.',
      toolChild: 'Constructor: afegeix descendents a una parella.',
      toolAffected: 'Constructor: marca o desmarca individus afectats.',
      toolCarrier: 'Constructor: marca o desmarca individus portadors.',
      toolDelete: 'Constructor: elimina individus o relacions.',
      toolClear: 'Constructor: esborra el pedigrí actual.',
      childRandom: 'Constructor: el sexe del nou descendent es triarà a l’atzar.',
      childMale: 'Constructor: el nou descendent serà masculí.',
      childFemale: 'Constructor: el nou descendent serà femení.',
      zoomOut: 'Allunya l’arbre per veure més espai.',
      zoomIn: 'Apropa l’arbre per veure més detall.',
      zoomReset: 'Restaura el zoom de l’arbre a la mida inicial.',
      fullscreen: 'Mostra o amaga el constructor a pantalla completa.',
      printTree: 'Imprimeix l’arbre o desa’l com a PDF.',
      analyzeBuilder: 'Constructor: analitza el patró d’herència compatible amb l’arbre.',
      loadBuilderExample: 'Constructor: carrega un pedigrí d’exemple per editar-lo.',
      loadBuilderCase: 'Constructor: carrega un cas desat de pedigrí.',
      reviewStudentAnswer: 'Mode professor: carrega una resposta d’alumne per revisar-la.',
      shareBuilder: 'Mode professor: copia un enllaç perquè l’alumnat resolgui el pedigrí.',
      pngBuilder: 'Constructor: descarrega una imatge PNG de l’arbre.',
      saveBuilderEditable: 'Mode professor: desa el cas editable de pedigrí.',
      saveBuilderStudent: 'Mode professor: desa el pedigrí com a activitat per a l’alumnat.',
    },
    en: {
      darkToggle: 'Switch between light mode and dark mode.',
      openHomeFile: 'Open a saved MendelSim file and send it automatically to the right module.',
      tabSimular: 'Simulation mode: practise freely with crosses and results.',
      tabCrear: 'Teacher mode: create an activity to share with students.',
      tabAlumno: 'Student mode: load, solve and submit an activity.',
      tabAnalizar: 'Analyse prepared pedigree cases with hints and solution.',
      tabPracticar: 'Practise identifying inheritance patterns in pedigrees.',
      tabConstructor: 'Teacher mode: build or edit a pedigree case.',
      tabRespuesta: 'Student or review mode: solve an activity or review a loaded answer.',
      preset: 'Load this example in the simulator.',
      randomExample: 'Generate a new example with random data.',
      customExample: 'Enable custom mode to choose the data freely.',
      runCross: 'Calculate the cross with the selected data and show the Punnett square.',
      clearCross: 'Clear the results and start again.',
      teacherPreview: 'Teacher mode: show how students will see the activity.',
      teacherShare: 'Teacher mode: copy a link to send the activity to students.',
      teacherSaveEditable: 'Teacher mode: save an editable file to modify later.',
      teacherSaveStudent: 'Teacher mode: save a file ready for students to solve.',
      teacherLoadActivity: 'Teacher mode: load a saved activity to review or edit it.',
      studentCheck: 'Student mode: check your answers if the teacher enabled autocorrection.',
      studentLoadActivity: 'Student mode: load the activity provided by your teacher.',
      studentDownload: 'Student mode: download your answers to submit them.',
      studentCopy: 'Student mode: copy your answers to paste them elsewhere.',
      studentPrint: 'Student mode: print or save your answers as PDF.',
      studentShareUrl: 'Student mode: copy a link with your answers to send to the teacher.',
      analysisGenerate: 'Generate another pedigree case to analyse.',
      analysisEditCopy: 'Teacher mode: copy this case to the builder for editing.',
      clue: 'Show a hint for the current case.',
      solution: 'Show or hide the solution for the current case.',
      resetExercise: 'Restart the current case and hide hints and solution.',
      resetScore: 'Clear the accumulated practice score.',
      practiceCheck: 'Check the selected inheritance pattern and justification.',
      toolSelect: 'Builder: move individuals in the pedigree.',
      toolAddMale: 'Builder: add a male individual to the pedigree.',
      toolAddFemale: 'Builder: add a female individual to the pedigree.',
      toolCouple: 'Builder: join two individuals as a couple.',
      toolChild: 'Builder: add offspring to a couple.',
      toolAffected: 'Builder: mark or unmark affected individuals.',
      toolCarrier: 'Builder: mark or unmark carrier individuals.',
      toolDelete: 'Builder: delete individuals or relationships.',
      toolClear: 'Builder: clear the current pedigree.',
      childRandom: 'Builder: choose the new offspring sex at random.',
      childMale: 'Builder: the new offspring will be male.',
      childFemale: 'Builder: the new offspring will be female.',
      zoomOut: 'Zoom out to see more of the tree.',
      zoomIn: 'Zoom in to see more detail.',
      zoomReset: 'Restore the tree zoom to the initial size.',
      fullscreen: 'Show or hide the builder in full screen.',
      printTree: 'Print the tree or save it as PDF.',
      analyzeBuilder: 'Builder: analyse the inheritance pattern compatible with the tree.',
      loadBuilderExample: 'Builder: load an example pedigree to edit.',
      loadBuilderCase: 'Builder: load a saved pedigree case.',
      reviewStudentAnswer: 'Teacher mode: load a student answer for review.',
      shareBuilder: 'Teacher mode: copy a link so students can solve the pedigree.',
      pngBuilder: 'Builder: download a PNG image of the tree.',
      saveBuilderEditable: 'Teacher mode: save the editable pedigree case.',
      saveBuilderStudent: 'Teacher mode: save the pedigree as a student activity.',
    },
  };

  function locale() {
    const current = window.MendelSimI18n?.getLocale?.() || document.documentElement.lang || 'es';
    return Object.prototype.hasOwnProperty.call(TEXTS, current) ? current : 'es';
  }

  function stripIcon(text) {
    return String(text || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
  }

  function fallbackTip(button, L) {
    const label = stripIcon(button.textContent) || button.getAttribute('aria-label') || 'boton';
    if (L === TEXTS.ca) return `Obre o executa: ${label}.`;
    if (L === TEXTS.en) return `Open or run: ${label}.`;
    return `Abre o ejecuta: ${label}.`;
  }

  function setTip(button, tip) {
    if (!button || !tip) return;
    button.dataset.tooltip = tip;
    button.removeAttribute('title');
    button.setAttribute('aria-label', tip);
  }

  function ensureTooltipStyles() {
    if (document.getElementById('mendelsim-tooltip-styles')) return;
    const style = document.createElement('style');
    style.id = 'mendelsim-tooltip-styles';
    style.textContent = `
      .mendelsim-tooltip {
        position: fixed;
        z-index: 10000;
        max-width: min(320px, calc(100vw - 24px));
        padding: 0.5rem 0.65rem;
        border-radius: 6px;
        background: rgba(17, 24, 39, 0.96);
        color: #fff;
        font-size: 0.82rem;
        line-height: 1.35;
        box-shadow: 0 8px 20px rgba(0,0,0,0.18);
        pointer-events: none;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.12s ease, transform 0.12s ease;
      }
      .mendelsim-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      [data-theme="dark"] .mendelsim-tooltip {
        background: rgba(236, 253, 245, 0.96);
        color: #102015;
      }
    `;
    document.head.appendChild(style);
  }

  function getTooltipElement() {
    let tooltip = document.getElementById('mendelsimTooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'mendelsimTooltip';
      tooltip.className = 'mendelsim-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function positionTooltip(tooltip, button) {
    const rect = button.getBoundingClientRect();
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.classList.add('visible');
    const tipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tipRect.width - 12));
    let top = rect.bottom + gap;
    if (top + tipRect.height > window.innerHeight - 12) {
      top = rect.top - tipRect.height - gap;
    }
    top = Math.max(12, top);
    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
  }

  function showTooltip(button) {
    const text = button?.dataset?.tooltip;
    if (!text) return;
    button.removeAttribute('title');
    const tooltip = getTooltipElement();
    tooltip.textContent = text;
    window.clearTimeout(showTooltip._timer);
    showTooltip._timer = window.setTimeout(() => {
      positionTooltip(tooltip, button);
    }, 120);
  }

  function hideTooltip() {
    window.clearTimeout(showTooltip._timer);
    const tooltip = document.getElementById('mendelsimTooltip');
    if (tooltip) tooltip.classList.remove('visible');
  }

  function bindTooltipEvents() {
    if (bindTooltipEvents.bound) return;
    bindTooltipEvents.bound = true;
    document.addEventListener('mouseover', event => {
      const button = event.target.closest?.('button[data-tooltip]');
      if (button) showTooltip(button);
    });
    document.addEventListener('mouseout', event => {
      if (event.target.closest?.('button[data-tooltip]')) hideTooltip();
    });
    document.addEventListener('focusin', event => {
      const button = event.target.closest?.('button[data-tooltip]');
      if (button) showTooltip(button);
    });
    document.addEventListener('focusout', event => {
      if (event.target.closest?.('button[data-tooltip]')) hideTooltip();
    });
    document.addEventListener('click', hideTooltip);
    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);
  }

  function tipForButton(button, L) {
    const id = button.id || '';
    const tab = button.dataset?.tab || '';
    const onclick = button.getAttribute('onclick') || '';

    if (id === 'darkToggle') return L.darkToggle;
    if (id === 'homeJsonFileButton' || onclick.includes('homeJsonFile')) return L.openHomeFile;

    if (tab === 'simular') return L.tabSimular;
    if (tab === 'crear') return L.tabCrear;
    if (tab === 'alumno') return L.tabAlumno;
    if (tab === 'analizar') return L.tabAnalizar;
    if (tab === 'practicar') return L.tabPracticar;
    if (tab === 'constructor') return L.tabConstructor;

    if (button.classList.contains('preset-btn')) {
      if (onclick.includes('loadRandomExample')) return L.randomExample;
      if (onclick.includes('enableCustomMode')) return L.customExample;
      return L.preset;
    }

    if (onclick.includes('realizarCruce')) return L.runCross;
    if (onclick.includes('limpiar')) return L.clearCross;
    if (onclick.includes('previewMonoExercise') || onclick.includes('previewDihybridExercise') || onclick.includes('previewXLinkedExercise')) return L.teacherPreview;
    if (onclick.includes('copyMonoStudentURL') || onclick.includes('copyDihybridStudentURL') || onclick.includes('copyXLinkedStudentURL')) return L.teacherShare;
    if (onclick.includes("saveMonoExercise('teacher") || onclick.includes("saveDihybridExercise('teacher") || onclick.includes("saveXLinkedExercise('teacher")) return L.teacherSaveEditable;
    if (onclick.includes("saveMonoExercise('student") || onclick.includes("saveDihybridExercise('student") || onclick.includes("saveXLinkedExercise('student")) return L.teacherSaveStudent;
    if (onclick.includes('ExerciseFile') && !button.closest('#tab-alumno')) return L.teacherLoadActivity;
    if (id === 'studentCheckBtn' || onclick.includes('checkMonoStudentAnswers') || onclick.includes('checkDihybridStudentAnswers') || onclick.includes('checkXLinkedStudentAnswers')) return L.studentCheck;
    if (button.closest('#tab-alumno') && onclick.includes('ExerciseFile')) return L.studentLoadActivity;
    if (onclick.includes('downloadMonoStudentAnswers') || onclick.includes('downloadDihybridStudentAnswers') || onclick.includes('downloadXLinkedStudentAnswers') || onclick.includes('downloadStudentAnswers')) return L.studentDownload;
    if (onclick.includes('copyMonoStudentAnswers') || onclick.includes('copyDihybridStudentAnswers') || onclick.includes('copyXLinkedStudentAnswers') || onclick.includes('copyStudentAnswers')) return L.studentCopy;
    if (id === 'studentPrintBtn' || (button.closest('#tab-alumno') && onclick.includes('print'))) return L.studentPrint;
    if (id === 'studentShareUrlBtn' || onclick.includes('shareMonoStudentAnswerURL') || onclick.includes('shareDihybridStudentAnswerURL') || onclick.includes('shareXLinkedStudentAnswerURL') || onclick.includes('shareStudentAnswerAsURL')) return L.studentShareUrl;

    if (onclick.includes('loadRandomAnalysisExercise') || onclick.includes('loadRandomPracticeExercise')) return L.analysisGenerate;
    if (onclick.includes('copyAnalysisToBuilder') || onclick.includes('copyPracticeToBuilder')) return L.analysisEditCopy;
    if (id === 'clueBtn' || onclick.includes('revealNextClue')) return L.clue;
    if (id === 'solutionBtn' || onclick.includes('toggleSolution')) return L.solution;
    if (onclick.includes('resetExercise')) return L.resetExercise;
    if (onclick.includes('resetScore')) return L.resetScore;
    if (onclick.includes('checkAnswer')) return L.practiceCheck;

    if (id === 'tool-select') return L.toolSelect;
    if (id === 'tool-addMale') return L.toolAddMale;
    if (id === 'tool-addFemale') return L.toolAddFemale;
    if (id === 'tool-couple') return L.toolCouple;
    if (id === 'tool-child') return L.toolChild;
    if (id === 'tool-toggleAffected') return L.toolAffected;
    if (id === 'tool-toggleCarrier') return L.toolCarrier;
    if (id === 'tool-delete') return L.toolDelete;
    if (button.closest('#builderToolbar') && onclick.includes('clearBuilderTree')) return L.toolClear;
    if (id === 'child-sex-random') return L.childRandom;
    if (id === 'child-sex-male') return L.childMale;
    if (id === 'child-sex-female') return L.childFemale;

    if (onclick.includes('adjustTreeZoom') && onclick.includes('-0.1')) return L.zoomOut;
    if (onclick.includes('adjustTreeZoom') && onclick.includes('0.1')) return L.zoomIn;
    if (onclick.includes('resetTreeZoom')) return L.zoomReset;
    if (id === 'builderFullscreenBtn' || onclick.includes('toggleBuilderFullscreen')) return L.fullscreen;
    if (onclick.includes('printTree')) return button.closest('#tab-alumno') ? L.studentPrint : L.printTree;

    if (onclick.includes('analyzeBuilderTree')) return L.analyzeBuilder;
    if (onclick.includes('loadBuilderExample')) return L.loadBuilderExample;
    if (onclick.includes("saveBuilderCaseToDisk('teacher")) return L.saveBuilderEditable;
    if (onclick.includes("saveBuilderCaseToDisk('student")) return L.saveBuilderStudent;
    if (onclick.includes('builderCaseFile')) return L.loadBuilderCase;
    if (onclick.includes('studentAnswerFile')) return L.reviewStudentAnswer;
    if (onclick.includes('copyBuilderShareURL')) return L.shareBuilder;
    if (onclick.includes('downloadBuilderPNG')) return L.pngBuilder;

    return fallbackTip(button, L);
  }

  function applyButtonTooltips(root = document) {
    ensureTooltipStyles();
    bindTooltipEvents();
    const L = TEXTS[locale()] || TEXTS.es;
    root.querySelectorAll('button').forEach(button => setTip(button, tipForButton(button, L)));
    window.setTimeout(() => {
      root.querySelectorAll('button[data-tooltip]').forEach(button => button.removeAttribute('title'));
    }, 0);
  }

  window.MendelSimButtonTooltips = { apply: applyButtonTooltips };
})();
