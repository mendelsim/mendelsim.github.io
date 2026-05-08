// ══════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  const targetBtn = btn || document.querySelector(`.tab-btn[data-tab="${name}"]`);
  if (targetBtn) targetBtn.classList.add('active');
  if (name === 'constructor') {
    updateLegendSexLabels(getBuilderSexLabels());
  } else if (name === 'alumno') {
    updateLegendSexLabels(labelsForOrganism(currentStudentAssignment?.metadata?.organismType || 'human'));
  } else {
    updateLegendSexLabels(SEX_LABELS.human);
  }
}

// ══════════════════════════════════════════════════════
// ENGINES
// ══════════════════════════════════════════════════════
let analysisEngine, practiceEngine, builderEngine, studentEngine;
let currentAnalysisExercise = null;
let currentClueIndex = 0;
let solutionVisible = false;
let currentPracticeExercise = null;
let currentStudentAssignment = null;
let score = 0, scoreTot = 0;
let builderPrintTitle = t('pedigree.title.builtPedigree', 'Pedigrí construido');
const TREE_ZOOM = { analysisSvg: 1, practiceSvg: 1, builderSvg: 1, studentSvg: 1 };
const SEX_LABELS = {
  human: {
    male: t('pedigree.sex.human.male', 'Hombre'),
    female: t('pedigree.sex.human.female', 'Mujer'),
    maleLower: t('pedigree.sex.human.maleLower', 'hombre'),
    femaleLower: t('pedigree.sex.human.femaleLower', 'mujer'),
    malePlural: t('pedigree.sex.human.malePlural', 'hombres'),
    femalePlural: t('pedigree.sex.human.femalePlural', 'mujeres'),
    femaleCarrier: t('pedigree.sex.human.femaleCarrier', 'Mujer portadora (heterocigota)'),
    maleCarrier: t('pedigree.sex.human.maleCarrier', 'Hombre portador (heterocigoto)'),
  },
  other: {
    male: t('pedigree.sex.other.male', 'Macho'),
    female: t('pedigree.sex.other.female', 'Hembra'),
    maleLower: t('pedigree.sex.other.maleLower', 'macho'),
    femaleLower: t('pedigree.sex.other.femaleLower', 'hembra'),
    malePlural: t('pedigree.sex.other.malePlural', 'machos'),
    femalePlural: t('pedigree.sex.other.femalePlural', 'hembras'),
    femaleCarrier: t('pedigree.sex.other.femaleCarrier', 'Hembra portadora (heterocigota)'),
    maleCarrier: t('pedigree.sex.other.maleCarrier', 'Macho portador (heterocigoto)'),
  },
};

const PEDIGREE_LOCALE = {
  ca: {
    lang: `ca`,
    pageTitle: `Pedigrís interactius — MendelSim`,
    backBtn: `← Inici`,
    heading: `Pedigrís interactius`,
    subtitle: `Analitza arbres genealògics i identifica patrons hereditaris`,
    darkToggle: `Mode fosc`,
    lawTitle: `📜 Principis de l’anàlisi de pedigrís`,
    lawText: `Un pedigrí permet identificar el patró d’herència observant qui està afectat i en quines generacions. Les quatre claus diagnòstiques són: <strong>autosòmica recessiva</strong> (apareix en germans, pares sans, tots dos sexes per igual); <strong>autosòmica dominant</strong> (almenys un progenitor afectat en cada generació, tots dos sexes); <strong>recessiva lligada a l’X</strong> (més freqüent en homes, transmesa per dones portadores sanes); <strong>dominant lligada a l’X</strong> (pare afectat transmet a totes les filles, mai als fills).`,
    legendLabel: `Llegenda:`,
    tabAnalyze: `🔍 Analitzar exercicis`,
    tabPractice: `📝 Practicar`,
    tabBuilder: `🔨 Constructor`,
    tabStudent: `📥 Resposta`,
    analyzeCardTitle: `📋 Seleccionar exercici`,
    analyzeExerciseLabel: `Exercici:`,
    analyzeGenerate: `🎲 Generar cas`,
    analyzeEditCopy: `✏️ Editar còpia`,
    analyzeTreeTitle: `🌳 Arbre genealògic `,
    analyzeTreeControls: `Controles de l’arbre d’anàlisi`,
    analyzeZoomIn: `Apropar`,
    analyzeZoomOut: `Allunyar`,
    analyzeRestore: `Restaurar zoom`,
    analyzePrint: `Imprimir o desar com a PDF`,
    clueBtn: `💡 Veure pista (0/0)`,
    solutionBtn: `✅ Veure solució`,
    resetBtn: `↺ Reiniciar`,
    genotypeSectionTitle: `🧬 Genotips dels individus:`,
    genotypeTableHead: `<th>Individu</th><th>Genotip</th><th>Estat</th>`,
    scoreDisplay: `🏆 Puntuació: <span id="scoreNum">0</span> / <span id="scoreTot">0</span>`,
    resetScore: `Reiniciar puntuació`,
    practiceExerciseLabel: `Selecciona un exercici per practicar:`,
    practiceGenerate: `🎲 Generar cas`,
    practiceEditCopy: `✏️ Editar còpia`,
    practiceTreeTitle: `🌳 Arbre genealògic (sense solució)`,
    practiceAnswerTitle: `📝 Identifica el patró d’herència`,
    patternChoices: [`AR — Autosòmica recessiva`, `AD — Autosòmica dominant`, `XR — Recessiva lligada a l’X`, `XD — Dominant lligada a l’X`],
    justificationLabel: `Justificació (opcional):`,
    justificationPlaceholder: `Explica per què has triat aquest patró...`,
    checkAnswerBtn: `Comprovar resposta`,
    builderTitle: `🔨 Constructor de pedigrís`,
    builderCaseTitleLabel: `Títol del cas`,
    builderCaseTitlePlaceholder: `Ex.: Albinisme en tres generacions`,
    builderTraitLabel: `Tret o malaltia`,
    builderTraitPlaceholder: `Ex.: albinisme`,
    builderOrganismLabel: `Organisme`,
    builderOrganismHuman: `Persones`,
    builderOrganismOther: `Altres organismes`,
    builderPatternLabel: `Patró esperat`,
    builderPatternNone: `Sense fixar`,
    builderPatternAR: `Autosòmica recessiva`,
    builderPatternAD: `Autosòmica dominant`,
    builderPatternXR: `Recessiva lligada a l’X`,
    builderPatternXD: `Dominant lligada a l’X`,
    builderAlleleDomLabel: `Símbol dominant`,
    builderAlleleDomNameLabel: `Significat de l’al·lel dominant`,
    builderAlleleDomNamePlaceholder: `Ex.: pigmentació normal`,
    builderAlleleRecLabel: `Símbol recessiu`,
    builderAlleleRecNameLabel: `Significat de l’al·lel recessiu`,
    builderAlleleRecNamePlaceholder: `Ex.: albinisme`,
    builderPromptLabel: `Enunciat per a l’alumnat`,
    builderPromptPlaceholder: `Descriu el cas, què han d’observar o què han de deduir...`,
    builderAutoCheckLabel: `Permetre l’autocorrecció a l’alumnat`,
    toolSelect: `✥ Moure`,
    toolCouple: `💑 Crear parella`,
    toolChild: `👶 Descendent`,
    toolAddMale: `♂ Afegir home`,
    toolAddFemale: `♀ Afegir dona`,
    toolAffected: `● Afectat`,
    toolCarrier: `◉ Portador`,
    toolDelete: `🗑 Eliminar`,
    toolClear: `↺ Netejar`,
    languageLabel: `Idioma`,
    builderTreeTitle: `🌳 Arbre del constructor `,
    builderFullscreen: `Pantalla completa`,
    builderSnapGrid: `Quadrícula de 20px`,
    builderChildSexLabel: `Sexe del descendent`,
    builderChildSexRandom: `Sexe aleatori`,
    builderChildSexMale: `Descendent home`,
    builderChildSexFemale: `Descendent dona`,
    analyzeBuilderBtn: `🔍 Analitzar arbre`,
    builderOutlineActions: [`📋 Carregar exemple`, `💾 Desar editable`, `🎓 Desar alumne`, `📂 Carregar cas`, `📥 Revisar resposta`, `🔗 Compartir amb l’alumnat`, `🖼 Descarregar PNG`, `🖨 Imprimir`],
    builderAnalysisSectionTitle: `🧬 Genotips compatibles`,
    builderAnalysisTableHead: `<th>Individu</th><th>Genotip</th><th>Estat</th>`,
    studentCaseTitle: `Activitat de pedigrí`,
    studentTreeTitle: `🌳 Arbre genealògic `,
    studentAnswerTitle: `✍️ Resposta de l’alumne`,
    studentNameLabel: `Nom`,
    studentNamePlaceholder: `Nom i cognoms`,
    studentPatternLabel: `Patró d’herència proposat`,
    studentPatternNone: `Selecciona un patró`,
    studentPatternAR: `Autosòmica recessiva`,
    studentPatternAD: `Autosòmica dominant`,
    studentPatternXR: `Recessiva lligada a l’X`,
    studentPatternXD: `Dominant lligada a l’X`,
    studentPatternUnknown: `No es pot determinar`,
    studentJustificationLabel: `Justificació`,
    studentJustificationPlaceholder: `Explica quines dades de l’arbre justifiquen la teva resposta...`,
    studentGenotypeSectionTitle: `🧬 Genotips proposats`,
    studentTableHead: `<th>Individu</th><th>Sexe</th><th>Estat observat</th><th>Genotip</th><th>Notes</th>`,
    studentBtns: [`✅ Comprovar`, `💾 Descarregar respostes`, `📋 Copiar respostes`, `🖨 Imprimir PDF`, `📤 Compartir com a URL`],
  },
  en: {
    lang: `en`,
    pageTitle: `Interactive Pedigrees — MendelSim`,
    backBtn: `← Home`,
    heading: `Interactive Pedigrees`,
    subtitle: `Analyse family trees and identify inheritance patterns`,
    darkToggle: `Dark mode`,
    lawTitle: `📜 Principles of pedigree analysis`,
    lawText: `A pedigree allows identification of the inheritance pattern by observing who is affected and in which generations. The four diagnostic keys are: <strong>autosomal recessive</strong> (appears in siblings, unaffected parents, both sexes equally); <strong>autosomal dominant</strong> (at least one affected parent per generation, both sexes); <strong>X-linked recessive</strong> (more frequent in men, transmitted by healthy carrier women); <strong>X-linked dominant</strong> (affected father transmits to all daughters, never to sons).`,
    legendLabel: `Legend:`,
    tabAnalyze: `🔍 Analyse exercises`,
    tabPractice: `📝 Practice`,
    tabBuilder: `🔨 Builder`,
    tabStudent: `📥 Response`,
    analyzeCardTitle: `📋 Select exercise`,
    analyzeExerciseLabel: `Exercise:`,
    analyzeGenerate: `🎲 Generate case`,
    analyzeEditCopy: `✏️ Edit copy`,
    analyzeTreeTitle: `🌳 Family tree `,
    analyzeTreeControls: `Analysis tree controls`,
    analyzeZoomIn: `Zoom in`,
    analyzeZoomOut: `Zoom out`,
    analyzeRestore: `Restore zoom`,
    analyzePrint: `Print or save as PDF`,
    clueBtn: `💡 Show hint (0/0)`,
    solutionBtn: `✅ Show solution`,
    resetBtn: `↺ Reset`,
    genotypeSectionTitle: `🧬 Individual genotypes:`,
    genotypeTableHead: `<th>Individual</th><th>Genotype</th><th>Status</th>`,
    scoreDisplay: `🏆 Score: <span id="scoreNum">0</span> / <span id="scoreTot">0</span>`,
    resetScore: `Reset score`,
    practiceExerciseLabel: `Select an exercise to practise:`,
    practiceGenerate: `🎲 Generate case`,
    practiceEditCopy: `✏️ Edit copy`,
    practiceTreeTitle: `🌳 Family tree (no solution)`,
    practiceAnswerTitle: `📝 Identify the inheritance pattern`,
    patternChoices: [`AR — Autosomal recessive`, `AD — Autosomal dominant`, `XR — X-linked recessive`, `XD — X-linked dominant`],
    justificationLabel: `Justification (optional):`,
    justificationPlaceholder: `Explain why you chose this pattern...`,
    checkAnswerBtn: `Check answer`,
    builderTitle: `🔨 Pedigree builder`,
    builderCaseTitleLabel: `Case title`,
    builderCaseTitlePlaceholder: `E.g.: Albinism over three generations`,
    builderTraitLabel: `Trait or disease`,
    builderTraitPlaceholder: `E.g.: albinism`,
    builderOrganismLabel: `Organism`,
    builderOrganismHuman: `People`,
    builderOrganismOther: `Other organisms`,
    builderPatternLabel: `Expected pattern`,
    builderPatternNone: `Not set`,
    builderPatternAR: `Autosomal recessive`,
    builderPatternAD: `Autosomal dominant`,
    builderPatternXR: `X-linked recessive`,
    builderPatternXD: `X-linked dominant`,
    builderAlleleDomLabel: `Dominant symbol`,
    builderAlleleDomNameLabel: `Meaning of dominant allele`,
    builderAlleleDomNamePlaceholder: `E.g.: normal pigmentation`,
    builderAlleleRecLabel: `Recessive symbol`,
    builderAlleleRecNameLabel: `Meaning of recessive allele`,
    builderAlleleRecNamePlaceholder: `E.g.: albinism`,
    builderPromptLabel: `Prompt for students`,
    builderPromptPlaceholder: `Describe the case, what students should observe or deduce...`,
    builderAutoCheckLabel: `Allow autocorrection for students`,
    toolSelect: `✥ Move`,
    toolCouple: `💑 Create couple`,
    toolChild: `👶 Offspring`,
    toolAddMale: `♂ Add male`,
    toolAddFemale: `♀ Add female`,
    toolAffected: `● Affected`,
    toolCarrier: `◉ Carrier`,
    toolDelete: `🗑 Delete`,
    toolClear: `↺ Clear`,
    languageLabel: `Language`,
    builderTreeTitle: `🌳 Builder tree `,
    builderFullscreen: `Full screen`,
    builderSnapGrid: `20px grid`,
    builderChildSexLabel: `Offspring sex`,
    builderChildSexRandom: `Random sex`,
    builderChildSexMale: `Male offspring`,
    builderChildSexFemale: `Female offspring`,
    analyzeBuilderBtn: `🔍 Analyse tree`,
    builderOutlineActions: [`📋 Load example`, `💾 Save editable`, `🎓 Save student`, `📂 Load case`, `📥 Review response`, `🔗 Share with students`, `🖼 Download PNG`, `🖨 Print`],
    builderAnalysisSectionTitle: `🧬 Compatible genotypes`,
    builderAnalysisTableHead: `<th>Individual</th><th>Genotype</th><th>Status</th>`,
    studentCaseTitle: `Pedigree activity`,
    studentTreeTitle: `🌳 Family tree `,
    studentAnswerTitle: `✍️ Student response`,
    studentNameLabel: `Name`,
    studentNamePlaceholder: `Full name`,
    studentPatternLabel: `Proposed inheritance pattern`,
    studentPatternNone: `Select a pattern`,
    studentPatternAR: `Autosomal recessive`,
    studentPatternAD: `Autosomal dominant`,
    studentPatternXR: `X-linked recessive`,
    studentPatternXD: `X-linked dominant`,
    studentPatternUnknown: `Cannot be determined`,
    studentJustificationLabel: `Justification`,
    studentJustificationPlaceholder: `Explain which data from the tree justify your answer...`,
    studentGenotypeSectionTitle: `🧬 Proposed genotypes`,
    studentTableHead: `<th>Individual</th><th>Sex</th><th>Observed status</th><th>Genotype</th><th>Notes</th>`,
    studentBtns: [`✅ Check`, `💾 Download answers`, `📋 Copy answers`, `🖨 Print PDF`, `📤 Share as URL`],
  },
};

function applyLocaleToStaticPage() {
  const locale = MendelSimI18n.getLocale();
  const S = PEDIGREE_LOCALE[locale];
  if (!S) return;

  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  const setLeadingText = (selector, text) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (el.firstChild?.nodeType === Node.TEXT_NODE) {
      el.firstChild.nodeValue = text;
    } else {
      el.prepend(document.createTextNode(text));
    }
  };
  const setHTML = (selector, html) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  };
  const setAttr = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  document.documentElement.lang = S.lang;
  document.title = S.pageTitle;
  setText(`.back-btn`, S.backBtn);
  setText(`.header h1`, S.heading);
  setText(`.header p`, S.subtitle);
  setAttr(`#darkToggle`, `title`, S.darkToggle);
  setText(`#languageLabel`, S.languageLabel || `Language`);
  setAttr(`#languageSelect`, `aria-label`, S.languageLabel || `Language`);
  setText(`.law-title`, S.lawTitle);
  setHTML(`.law-box p`, S.lawText);
  setText(`.legend-pedigree strong`, S.legendLabel);
  setText(`[data-tab="analizar"]`, S.tabAnalyze);
  setText(`[data-tab="practicar"]`, S.tabPractice);
  setText(`[data-tab="constructor"]`, S.tabBuilder);
  setText(`[data-tab="alumno"]`, S.tabStudent);

  setText(`#tab-analizar .card-title`, S.analyzeCardTitle);
  setText(`label[for="exerciseSelect"]`, S.analyzeExerciseLabel);
  setText(`#tab-analizar .exercise-selector .btn-secondary`, S.analyzeGenerate);
  setText(`#tab-analizar .exercise-selector .btn-outline`, S.analyzeEditCopy);
  setLeadingText(`#tab-analizar .tree-title`, S.analyzeTreeTitle);
  setAttr(`#tab-analizar .tree-controls`, `aria-label`, S.analyzeTreeControls);
  document.querySelectorAll(`.tree-control-btn[onclick*="-0.1"]`).forEach(b => b.title = S.analyzeZoomOut);
  document.querySelectorAll(`.tree-control-btn[onclick*="0.1"]`).forEach(b => b.title = S.analyzeZoomIn);
  document.querySelectorAll(`.tree-control-btn[onclick*="resetTreeZoom"]`).forEach(b => b.title = S.analyzeRestore);
  document.querySelectorAll(`.tree-control-btn[onclick*="printTree"]`).forEach(b => b.title = S.analyzePrint);
  setText(`#clueBtn`, S.clueBtn);
  setText(`#solutionBtn`, S.solutionBtn);
  setText(`#solutionBtn + .btn-outline`, S.resetBtn);
  setText(`#solutionBox .section-title`, S.genotypeSectionTitle);
  setHTML(`#genotypeTable thead tr`, S.genotypeTableHead);

  setHTML(`#scoreDisplay`, S.scoreDisplay);
  setText(`#tab-practicar .btn-sm`, S.resetScore);
  setText(`#tab-practicar label`, S.practiceExerciseLabel);
  setText(`#tab-practicar .exercise-selector .btn-secondary`, S.practiceGenerate);
  setText(`#tab-practicar .exercise-selector .btn-outline`, S.practiceEditCopy);
  setText(`#tab-practicar .tree-title`, S.practiceTreeTitle);
  setAttr(`#tab-practicar .tree-controls`, `aria-label`, S.analyzeTreeControls); // Re-use
  setText(`#practiceAnswerCard .card-title`, S.practiceAnswerTitle);
  document.querySelectorAll(`#patternChoices label`).forEach((label, index) => {
    const input = label.querySelector(`input`);
    label.textContent = ` ` + S.patternChoices[index];
    if (input) label.prepend(input);
  });
  setText(`label[for="justification"]`, S.justificationLabel);
  setAttr(`#justification`, `placeholder`, S.justificationPlaceholder);
  setText(`#practiceAnswerCard .btn-primary`, S.checkAnswerBtn);

  setText(`#builderWorkspace > .card-title`, S.builderTitle);
  setText(`label[for="builderCaseTitle"]`, S.builderCaseTitleLabel);
  setAttr(`#builderCaseTitle`, `placeholder`, S.builderCaseTitlePlaceholder);
  setText(`label[for="builderTraitName"]`, S.builderTraitLabel);
  setAttr(`#builderTraitName`, `placeholder`, S.builderTraitPlaceholder);
  setText(`label[for="builderOrganismType"]`, S.builderOrganismLabel);
  setText(`#builderOrganismType option[value="human"]`, S.builderOrganismHuman);
  setText(`#builderOrganismType option[value="other"]`, S.builderOrganismOther);
  setText(`label[for="builderExpectedPattern"]`, S.builderPatternLabel);
  setText(`#builderExpectedPattern option[value=""]`, S.builderPatternNone);
  setText(`#builderExpectedPattern option[value="AR"]`, S.builderPatternAR);
  setText(`#builderExpectedPattern option[value="AD"]`, S.builderPatternAD);
  setText(`#builderExpectedPattern option[value="XR"]`, S.builderPatternXR);
  setText(`#builderExpectedPattern option[value="XD"]`, S.builderPatternXD);
  setText(`label[for="builderAlleleDom"]`, S.builderAlleleDomLabel);
  setText(`label[for="builderAlleleDomName"]`, S.builderAlleleDomNameLabel);
  setAttr(`#builderAlleleDomName`, `placeholder`, S.builderAlleleDomNamePlaceholder);
  setText(`label[for="builderAlleleRec"]`, S.builderAlleleRecLabel);
  setText(`label[for="builderAlleleRecName"]`, S.builderAlleleRecNameLabel);
  setAttr(`#builderAlleleRecName`, `placeholder`, S.builderAlleleRecNamePlaceholder);
  setText(`label[for="builderCasePrompt"]`, S.builderPromptLabel);
  setAttr(`#builderCasePrompt`, `placeholder`, S.builderPromptPlaceholder);
  setText(`#builderAllowAutoCheck + span`, S.builderAutoCheckLabel);
  setText(`#tool-select`, S.toolSelect);
  setText(`#tool-addMale`, S.toolAddMale);
  setText(`#tool-addFemale`, S.toolAddFemale);
  setText(`#tool-couple`, S.toolCouple);
  setText(`#tool-child`, S.toolChild);
  setAttr(`.builder-sex-toggle`, `aria-label`, S.builderChildSexLabel);
  setAttr(`#child-sex-random`, `title`, S.builderChildSexRandom);
  setAttr(`#child-sex-male`, `title`, S.builderChildSexMale);
  setAttr(`#child-sex-female`, `title`, S.builderChildSexFemale);
  setText(`#tool-toggleAffected`, S.toolAffected);
  setText(`#tool-toggleCarrier`, S.toolCarrier);
  setText(`#tool-delete`, S.toolDelete);
  setText(`#builderToolbar .tool-btn:last-of-type`, S.toolClear);
  setLeadingText(`#builderWorkspace .builder-section .tree-title`, S.builderTreeTitle);
  setAttr(`#builderWorkspace .tree-controls`, `aria-label`, S.analyzeTreeControls); // Re-use
  setAttr(`#builderFullscreenBtn`, `title`, S.builderFullscreen);
  setText(`.snap-grid-hint`, S.builderSnapGrid);
  setText(`#builderActions .btn-primary`, S.analyzeBuilderBtn);
  S.builderOutlineActions.forEach((text, index) => {
    const btn = document.querySelectorAll(`#builderActions .btn-outline`)[index];
    if (btn) btn.textContent = text;
  });
  setText(`#builderAnalysisResult .section-title`, S.builderAnalysisSectionTitle);
  setHTML(`#builderAnalysisResult thead tr`, S.builderAnalysisTableHead);

  setText(`#studentCaseTitle`, S.studentCaseTitle);
  setLeadingText(`#tab-alumno .tree-title`, S.studentTreeTitle);
  setAttr(`#tab-alumno .tree-controls`, `aria-label`, S.analyzeTreeControls); // Re-use
  setText(`#tab-alumno .card-title:last-of-type`, S.studentAnswerTitle);
  setText(`label[for="studentName"]`, S.studentNameLabel);
  setAttr(`#studentName`, `placeholder`, S.studentNamePlaceholder);
  setText(`label[for="studentPattern"]`, S.studentPatternLabel);
  setText(`#studentPattern option[value=""]`, S.studentPatternNone);
  setText(`#studentPattern option[value="AR"]`, S.studentPatternAR);
  setText(`#studentPattern option[value="AD"]`, S.studentPatternAD);
  setText(`#studentPattern option[value="XR"]`, S.studentPatternXR);
  setText(`#studentPattern option[value="XD"]`, S.studentPatternXD);
  setText(`#studentPattern option[value="unknown"]`, S.studentPatternUnknown);
  setText(`label[for="studentJustification"]`, S.studentJustificationLabel);
  setAttr(`#studentJustification`, `placeholder`, S.studentJustificationPlaceholder);
  setText(`#tab-alumno .section-title`, S.studentGenotypeSectionTitle);
  setHTML(`#tab-alumno .genotype-table thead tr`, S.studentTableHead);
  S.studentBtns.forEach((text, index) => {
    const btn = document.querySelectorAll(`#tab-alumno .btn-group .btn`)[index];
    if (btn) btn.textContent = text;
  });

  const footerLinks = document.querySelectorAll(`footer a[target="_blank"]`);
  if (footerLinks.length >= 3) {
    if (S.footerIssues) footerLinks[2].textContent = S.footerIssues;
  }
  const footerDiv = document.querySelector(`footer div:last-child`);
  if (footerDiv) {
    footerDiv.innerHTML = footerDiv.innerHTML
      .replace(`Código:`, S.footerCode + `:`)
      .replace(`Contenidos:`, S.footerContent + `:`);
  }
}

function initLanguageSelector() {
  const select = document.getElementById(`languageSelect`);
  if (!select) return;
  const locale = MendelSimI18n.getLocale();
  select.value = [`ca`, `en`].includes(locale) ? locale : `es`;
  select.addEventListener(`change`, () => {
    const nextLocale = select.value;
    MendelSimI18n.setLocale(nextLocale);
    const url = new URL(window.location.href);
    if (nextLocale !== `es`) {
      url.searchParams.set(`lang`, nextLocale);
    } else {
      url.searchParams.delete(`lang`);
    }
    window.location.href = `${url.pathname}${url.search}${url.hash}`;
  });
}

function initEngines() {
  initLanguageSelector();
  applyLocaleToStaticPage();
  analysisEngine = new PedigreeEngine('analysisSvg', null);
  analysisEngine.readOnly = true;
  practiceEngine = new PedigreeEngine('practiceSvg', null);
  practiceEngine.readOnly = true;
  builderEngine  = new PedigreeEngine('builderSvg', 'builderInfo');
  builderEngine.autoLabel = true;
  studentEngine  = new PedigreeEngine('studentSvg', null);
  studentEngine.readOnly = true;

  // Populate exercise selects
  const selA = document.getElementById('exerciseSelect');
  const selP = document.getElementById('practiceExerciseSelect');
  for (const ex of EXERCISES) {
    const label = ex.title;
    selA.innerHTML += `<option value="${ex.id}">${label}</option>`;
    selP.innerHTML += `<option value="${ex.id}">${label}</option>`;
  }

  loadAnalysisExercise();
  loadPracticeExercise();
  resetBuilderMetadata();
  builderEngine._updateInfo();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const workspace = document.getElementById('builderWorkspace');
      if (workspace?.classList.contains('is-fullscreen')) {
        workspace.classList.remove('is-fullscreen');
        updateBuilderFullscreenButton();
      }
    }
  });
  loadBuilderCaseFromURL();
}

function getTreeBaseWidth(svg) {
  return parseFloat(svg.getAttribute('width')) || svg.viewBox.baseVal.width || 700;
}

function setTreeZoom(svgId, zoom) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const clamped = Math.max(0.5, Math.min(2.5, zoom));
  TREE_ZOOM[svgId] = Math.round(clamped * 10) / 10;
  const width = getTreeBaseWidth(svg) * TREE_ZOOM[svgId];
  svg.style.width = `${width}px`;
  svg.style.maxWidth = TREE_ZOOM[svgId] === 1 ? '100%' : 'none';
  svg.style.height = 'auto';
  const readout = document.getElementById(`${svgId}Zoom`);
  if (readout) readout.textContent = `${Math.round(TREE_ZOOM[svgId] * 100)}%`;
}

function adjustTreeZoom(svgId, delta) {
  setTreeZoom(svgId, (TREE_ZOOM[svgId] || 1) + delta);
}

function resetTreeZoom(svgId) {
  setTreeZoom(svgId, 1);
}

function escapeHTML(text) {
  return String(text || '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[ch]));
}

function formatGenotypeHTML(text) {
  return escapeHTML(text).replace(/([A-Za-z])\^([A-Za-z0-9]+)/g, '$1<sup>$2</sup>');
}

function labelsForOrganism(type) {
  return SEX_LABELS[type === 'other' ? 'other' : 'human'];
}

function getBuilderSexLabels() {
  return labelsForOrganism(document.getElementById('builderOrganismType')?.value || 'human');
}

function sexLabel(sex, labels = SEX_LABELS.human) {
  return sex === 'M' ? labels.male : labels.female;
}

function updateLegendSexLabels(labels = SEX_LABELS.human) {
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('legendMaleUnaffected', t('pedigree.legend.maleUnaffected', '{male} no afectado', labels));
  set('legendFemaleUnaffected', t('pedigree.legend.femaleUnaffected', '{female} no afectada', labels));
  set('legendMaleAffected', t('pedigree.legend.maleAffected', '{male} afectado', labels));
  set('legendFemaleAffected', t('pedigree.legend.femaleAffected', '{female} afectada', labels));
  set('legendFemaleCarrier', labels.femaleCarrier);
  set('legendMaleCarrier', labels.maleCarrier);
}

function getAnalysisPrintTitle() {
  return currentAnalysisExercise ? currentAnalysisExercise.title : t('pedigree.title.familyTree', 'Árbol genealógico');
}

function getPracticePrintTitle() {
  return currentPracticeExercise ? currentPracticeExercise.title : t('pedigree.title.familyTree', 'Árbol genealógico');
}

function getBuilderPrintTitle() {
  return builderPrintTitle || t('pedigree.title.builtPedigree', 'Pedigrí construido');
}

function getStudentPrintTitle() {
  return currentStudentAssignment?.metadata?.title || t('pedigree.title.studentActivity', 'Actividad de pedigrí');
}

function getBuilderCasePrintHTML() {
  const meta = getBuilderMetadata();
  const rows = [];
  rows.push(`<p><strong>${t('pedigree.print.organism', 'Organismo')}:</strong> ${meta.organismType === 'other' ? t('pedigree.print.otherOrganisms', 'otros organismos (macho/hembra)') : t('pedigree.print.people', 'personas (hombre/mujer)')}</p>`);
  if (meta.trait) rows.push(`<p><strong>${t('pedigree.print.trait', 'Rasgo')}:</strong> ${escapeHTML(meta.trait)}</p>`);
  const alleles = [];
  if (meta.alleleDomName) alleles.push(`${formatGenotypeHTML(meta.alleleDom)} = ${escapeHTML(meta.alleleDomName)}`);
  if (meta.alleleRecName) alleles.push(`${formatGenotypeHTML(meta.alleleRec)} = ${escapeHTML(meta.alleleRecName)}`);
  if (alleles.length) rows.push(`<p><strong>${t('pedigree.print.alleles', 'Alelos')}:</strong> ${alleles.join('; ')}</p>`);
  if (meta.expectedPattern) rows.push(`<p><strong>${t('pedigree.label.expectedPattern', 'Patrón esperado')}:</strong> ${RANDOM_PATTERN_NAMES[meta.expectedPattern] || meta.expectedPattern}</p>`);
  if (meta.prompt) rows.push(`<p><strong>${t('pedigree.print.prompt', 'Enunciado')}:</strong> ${formatGenotypeHTML(meta.prompt).replace(/\n/g, '<br>')}</p>`);
  return rows.length ? `<div class="case-meta">${rows.join('')}</div>` : '';
}

function caseMetaRowsHTML(meta) {
  const rows = [];
  rows.push(`<p><strong>${t('pedigree.print.organism', 'Organismo')}:</strong> ${meta.organismType === 'other' ? t('pedigree.print.otherOrganisms', 'otros organismos (macho/hembra)') : t('pedigree.print.people', 'personas (hombre/mujer)')}</p>`);
  if (meta.trait) rows.push(`<p><strong>${t('pedigree.print.trait', 'Rasgo')}:</strong> ${escapeHTML(meta.trait)}</p>`);
  const alleles = [];
  if (meta.alleleDomName) alleles.push(`${formatGenotypeHTML(meta.alleleDom || 'A')} = ${escapeHTML(meta.alleleDomName)}`);
  if (meta.alleleRecName) alleles.push(`${formatGenotypeHTML(meta.alleleRec || 'a')} = ${escapeHTML(meta.alleleRecName)}`);
  if (alleles.length) rows.push(`<p><strong>${t('pedigree.print.alleles', 'Alelos')}:</strong> ${alleles.join('; ')}</p>`);
  if (meta.prompt) rows.push(`<p><strong>${t('pedigree.print.prompt', 'Enunciado')}:</strong> ${formatGenotypeHTML(meta.prompt).replace(/\n/g, '<br>')}</p>`);
  return rows;
}

function getStudentCasePrintHTML() {
  const meta = currentStudentAssignment?.metadata || {};
  const rows = caseMetaRowsHTML(meta);
  return rows.length ? `<div class="case-meta">${rows.join('')}</div>` : '';
}

function getStudentAnswerPrintHTML() {
  if (!currentStudentAssignment) return '';
  const answer = collectStudentAnswers();
  const labels = labelsForOrganism(currentStudentAssignment.metadata.organismType);
  const individuals = [...currentStudentAssignment.exercise.individuals].sort((a, b) => a.id - b.id);
  const rows = individuals.map(ind => {
    const genotype = answer.genotypes[ind.id] || '';
    const note = answer.notes[ind.id] || '';
    return `<tr>
      <td><strong>${escapeHTML(ind.label)}</strong></td>
      <td>${sexLabel(ind.sex, labels)}</td>
      <td>${studentObservedStatus(ind)}</td>
      <td><code>${genotype ? formatGenotypeHTML(genotype) : t('pedigree.label.unspecifiedAnswer', '(sin responder)')}</code></td>
      <td>${note ? escapeHTML(note) : ''}</td>
    </tr>`;
  }).join('');

  return `
    <div class="student-print-answer">
      <div class="section-title">${t('pedigree.label.studentAnswer', 'Respuesta del alumno')}</div>
      <p><strong>${t('pedigree.label.name', 'Nombre')}:</strong> ${escapeHTML(answer.studentName || t('pedigree.label.unknownName', '(sin nombre)'))}</p>
      <p><strong>${t('pedigree.label.proposedPattern', 'Patrón propuesto')}:</strong> ${escapeHTML(answer.patternLabel || t('pedigree.label.unspecifiedAnswer', '(sin responder)'))}</p>
      <p><strong>${t('pedigree.label.justification', 'Justificación')}:</strong><br>${escapeHTML(answer.justification || t('pedigree.label.unspecifiedAnswer', '(sin responder)')).replace(/\n/g, '<br>')}</p>
      <table class="genotype-table">
        <thead><tr><th>${t('pedigree.label.individual', 'Individuo')}</th><th>${t('pedigree.label.sex', 'Sexo')}</th><th>${t('pedigree.label.observedStatus', 'Estado observado')}</th><th>${t('pedigree.label.proposedGenotype', 'Genotipo propuesto')}</th><th>${t('pedigree.label.notes', 'Notas')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function getPrintExtra(svgId) {
  if (svgId === 'analysisSvg' && document.getElementById('solutionBox').classList.contains('visible')) {
    return document.getElementById('solutionBox').outerHTML;
  }
  if (svgId === 'builderSvg') {
    const analysis = document.getElementById('builderAnalysisResult').classList.contains('visible')
      ? document.getElementById('builderAnalysisResult').outerHTML
      : '';
    return getBuilderCasePrintHTML() + analysis;
  }
  if (svgId === 'studentSvg' && currentStudentAssignment) {
    return getStudentCasePrintHTML() + getStudentAnswerPrintHTML();
  }
  if (svgId === 'practiceSvg' && currentPracticeExercise) {
    return `<p><strong>Pregunta:</strong> ${formatGenotypeHTML(currentPracticeExercise.question)}</p>`;
  }
  return '';
}

function printTree(svgId, title) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const clone = svg.cloneNode(true);
  clone.removeAttribute('style');
  clone.setAttribute('width', '100%');
  clone.setAttribute('height', 'auto');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert(t(`pedigree.error.printWindow`, `No se pudo abrir la ventana de impresión. Revisa si el navegador ha bloqueado las ventanas emergentes.`));
    return;
  }

  const isStudentPrint = svgId === 'studentSvg' && !!currentStudentAssignment;
  if (isStudentPrint) {
    const studentName = document.getElementById('studentName')?.value.trim() || '';
    if (!studentName) {
      alert(t('pedigree.error.printNoName', 'Escribe tu nombre antes de imprimir.'));
      document.getElementById('studentName')?.focus();
      printWindow.close();
      return;
    }
  }

  const legend = document.querySelector('.legend-pedigree')?.outerHTML || '';
  const extra = getPrintExtra(svgId);
  const locale = window.MendelSimI18n?.getLocale() || 'es';
  const localeMap = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };
  const lc = localeMap[locale] || locale;
  const now = new Date();
  const dateStr = now.toLocaleDateString(lc, { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + now.toLocaleTimeString(lc, { hour: '2-digit', minute: '2-digit' });
  const studentName = isStudentPrint ? (document.getElementById('studentName')?.value.trim() || '') : '';
  const studentBox = isStudentPrint ? `
  <div style="background:#e8f5e9;border:1px solid #cde0cd;border-radius:6px;padding:8px 12px;margin-bottom:12px;display:flex;gap:24px;flex-wrap:wrap;align-items:center;">
    <div><span style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#4b5563;display:block;">${t('pedigree.print.studentLabel', 'Alumno/a')}</span><span style="font-size:14px;font-weight:700;color:#1a7431;">${escapeHTML(studentName)}</span></div>
    <div><span style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#4b5563;display:block;">${t('pedigree.print.dateLabel', 'Fecha y hora')}</span><span style="font-size:14px;font-weight:700;color:#1a7431;">${escapeHTML(dateStr)}</span></div>
  </div>` : '';
  printWindow.document.write(`
<!DOCTYPE html>
<html lang="${escapeHTML(locale)}">
<head>
  <meta charset="UTF-8">
  <title>${escapeHTML(title)}</title>
  <style>
    :root { --primary:#1a7431; --affected:#c0392b; --carrier:#e67e22; --text:#2c3e50; --border:#cde0cd; --font: Inter, Arial, sans-serif; --mono: Consolas, monospace; }
    body { font-family: var(--font); color: var(--text); margin: 24px; }
    h1 { font-size: 20px; margin: 0 0 12px; color: var(--primary); }
    .print-tree { border: 1px solid var(--border); padding: 12px; margin-top: 12px; page-break-inside: avoid; }
    svg { display: block; max-width: 100%; height: auto; margin: 0 auto; }
    .legend-pedigree { display:flex; gap:14px; flex-wrap:wrap; align-items:center; font-size:12px; margin: 10px 0 14px; }
    .leg-item { display:flex; align-items:center; gap:5px; }
    .leg-sq { width:14px; height:14px; border:2px solid #2c3e50; display:inline-block; position:relative; }
    .leg-circle { width:14px; height:14px; border-radius:50%; border:2px solid #2c3e50; display:inline-block; position:relative; }
    .leg-filled-sq, .leg-filled-ci { background:var(--affected); border-color:var(--affected); }
    .leg-carrier-sq::after, .leg-carrier-ci::after { content:''; position:absolute; width:6px; height:6px; border-radius:50%; background:var(--carrier); left:50%; top:50%; transform:translate(-50%,-50%); }
    .ped-line { stroke: var(--text); stroke-width: 1.8; fill: none; }
    .ped-label { font-family: var(--font); font-size: 11px; fill: #555; text-anchor: middle; }
    .ped-genotype { font-family: var(--mono); font-size: 10px; fill: #1a7431; text-anchor: middle; font-weight: 600; }
    .genotype-table { width:100%; border-collapse:collapse; font-size:12px; margin-top:10px; }
    .genotype-table th { background:var(--primary); color:#fff; text-align:left; padding:5px 7px; }
    .genotype-table td { padding:5px 7px; border-bottom:1px solid #e5e7eb; }
    .case-meta { font-size:13px; margin: 8px 0 12px; }
    .case-meta p { margin: 4px 0; }
    .student-print-answer { margin-top: 14px; page-break-inside: avoid; }
    .student-print-answer p { font-size:13px; margin: 6px 0; }
    code { font-family: var(--mono); color: #14532d; font-weight: 600; }
    .pattern-result { text-align:center; padding:10px; border-radius:8px; margin:10px 0; font-size:16px; font-weight:700; }
    .pattern-AR { background:#fef3c7; color:#92400e; border:2px solid #fcd34d; }
    .pattern-AD { background:#dbeafe; color:#1e40af; border:2px solid #93c5fd; }
    .pattern-XR { background:#fce7f3; color:#9d174d; border:2px solid #f9a8d4; }
    .pattern-XD { background:#ede9fe; color:#6d28d9; border:2px solid #c4b5fd; }
    .section-title { color:var(--primary); font-weight:700; margin-top:12px; }
    @media print {
      body { margin: 12mm; }
      .genotype-table { page-break-inside: auto; }
      .genotype-table tr { page-break-inside: avoid; page-break-after: auto; }
      .print-tree { max-height: 45vh; overflow: hidden; }
    }
  </style>
</head>
<body>
  <h1>${escapeHTML(title || t('pedigree.title.familyTree', 'Árbol genealógico'))}</h1>
  ${studentBox}
  ${legend}
  <div class="print-tree">${clone.outerHTML}</div>
  ${extra}
  <script>window.addEventListener('load', () => { window.focus(); window.print(); });<\/script>
</body>
</html>`);
  printWindow.document.close();
}

function toggleBuilderFullscreen() {
  const workspace = document.getElementById('builderWorkspace');
  workspace.classList.toggle('is-fullscreen');
  updateBuilderFullscreenButton();
}

function updateBuilderFullscreenButton() {
  const btn = document.getElementById('builderFullscreenBtn');
  const workspace = document.getElementById('builderWorkspace');
  if (!btn || !workspace) return;
  const isFs = workspace.classList.contains('is-fullscreen');
  btn.textContent = isFs ? '⊡' : '⛶';
  btn.title = isFs ? 'Salir de pantalla completa' : 'Pantalla completa';
}

function resetBuilderAnalysisPanel() {
  document.getElementById('builderAnalysisResult').classList.remove('visible');
  document.getElementById('builderGenotypeTableBody').innerHTML = '';
  document.getElementById('builderGenotypeNote').innerHTML = '';
}

function getBuilderMetadata() {
  return {
    title: document.getElementById('builderCaseTitle')?.value.trim() || '',
    trait: document.getElementById('builderTraitName')?.value.trim() || '',
    organismType: document.getElementById('builderOrganismType')?.value || 'human',
    prompt: document.getElementById('builderCasePrompt')?.value.trim() || '',
    expectedPattern: document.getElementById('builderExpectedPattern')?.value || '',
    alleleDom: document.getElementById('builderAlleleDom')?.value.trim() || 'A',
    alleleDomName: document.getElementById('builderAlleleDomName')?.value.trim() || '',
    alleleRec: document.getElementById('builderAlleleRec')?.value.trim() || 'a',
    alleleRecName: document.getElementById('builderAlleleRecName')?.value.trim() || '',
    allowAutoCheck: !!document.getElementById('builderAllowAutoCheck')?.checked,
  };
}

function setBuilderMetadata(metadata = {}) {
  const caseTitle = document.getElementById('builderCaseTitle');
  const traitName = document.getElementById('builderTraitName');
  const organismType = document.getElementById('builderOrganismType');
  const casePrompt = document.getElementById('builderCasePrompt');
  const expectedPattern = document.getElementById('builderExpectedPattern');
  const alleleDom = document.getElementById('builderAlleleDom');
  const alleleDomName = document.getElementById('builderAlleleDomName');
  const alleleRec = document.getElementById('builderAlleleRec');
  const alleleRecName = document.getElementById('builderAlleleRecName');
  const allowAutoCheck = document.getElementById('builderAllowAutoCheck');

  if (caseTitle) caseTitle.value = metadata.title || '';
  if (traitName) traitName.value = metadata.trait || '';
  if (organismType) organismType.value = metadata.organismType === 'other' ? 'other' : 'human';
  if (casePrompt) casePrompt.value = metadata.prompt || '';
  if (expectedPattern) expectedPattern.value = metadata.expectedPattern || '';
  if (alleleDom) alleleDom.value = metadata.alleleDom || 'A';
  if (alleleDomName) alleleDomName.value = metadata.alleleDomName || '';
  if (alleleRec) alleleRec.value = metadata.alleleRec || 'a';
  if (alleleRecName) alleleRecName.value = metadata.alleleRecName || '';
  if (allowAutoCheck) allowAutoCheck.checked = !!metadata.allowAutoCheck;
  updateBuilderMetadata();
}

function updateBuilderMetadata() {
  const meta = getBuilderMetadata();
  const defaultTitle = t('pedigree.title.builtPedigree', 'Pedigrí construido');
  const title = meta.title || meta.trait || defaultTitle;
  document.getElementById('builderSvgTitle').textContent = title === defaultTitle ? '' : `— ${title}`;
  builderPrintTitle = title;
  updateBuilderOrganismLabels();
}

function resetBuilderMetadata() {
  setBuilderMetadata({
    title: '',
    trait: '',
    organismType: 'human',
    prompt: '',
    expectedPattern: '',
    alleleDom: 'A',
    alleleDomName: '',
    alleleRec: 'a',
    alleleRecName: '',
    allowAutoCheck: false,
  });
}

function updateBuilderOrganismLabels() {
  const labels = getBuilderSexLabels();
  if (builderEngine) builderEngine.setSexLabels(labels);

  const addMale = document.getElementById('tool-addMale');
  const addFemale = document.getElementById('tool-addFemale');
  const childMale = document.getElementById('child-sex-male');
  const childFemale = document.getElementById('child-sex-female');

  if (addMale) addMale.textContent = t('pedigree.tool.addMale', '♂ Añadir {maleLower}', { maleLower: labels.maleLower });
  if (addFemale) addFemale.textContent = t('pedigree.tool.addFemale', '♀ Añadir {femaleLower}', { femaleLower: labels.femaleLower });
  if (childMale) childMale.title = t('pedigree.sex.descendantMale', 'Descendiente {maleLower}', { maleLower: labels.maleLower });
  if (childFemale) childFemale.title = t('pedigree.sex.descendantFemale', 'Descendiente {femaleLower}', { femaleLower: labels.femaleLower });

  if (document.getElementById('tab-constructor')?.classList.contains('active')) {
    updateLegendSexLabels(labels);
  }
}

function setBuilderSource(title) {
  const notice = document.getElementById('builderSourceNotice');
  const text = document.getElementById('builderSourceText');

  if (!title) {
    notice.style.display = 'none';
    text.innerHTML = '';
    return;
  }

  notice.style.display = '';
  text.innerHTML = `<strong>Copia editable:</strong> ${escapeHTML(title)}`;
}

function cloneExerciseForBuilder(exercise) {
  const copy = JSON.parse(JSON.stringify(exercise));
  copy.individuals = copy.individuals.map(ind => ({ ...ind, genotype: '' }));
  return copy;
}

function inferAlleleSymbolsFromExercise(exercise) {
  const values = Object.values(exercise.answer?.genotypes || {}).join(' ');
  const xAlleles = [...values.matchAll(/X\^([A-Za-z0-9]+)/g)].map(m => m[1]);
  if (xAlleles.length) {
    const dom = xAlleles.find(a => a !== a.toLowerCase()) || xAlleles[0] || 'A';
    const rec = xAlleles.find(a => a !== a.toUpperCase()) || dom.toLowerCase() || 'a';
    return { alleleDom: dom, alleleRec: rec };
  }

  const autosomal = [...values.matchAll(/\b([A-Za-z])([A-Za-z_])\b/g)]
    .flatMap(m => [m[1], m[2]])
    .filter(a => /^[A-Za-z]$/.test(a));
  const dom = autosomal.find(a => a === a.toUpperCase()) || 'A';
  const rec = autosomal.find(a => a === a.toLowerCase()) || dom.toLowerCase() || 'a';
  return { alleleDom: dom, alleleRec: rec };
}

function metadataFromExercise(exercise) {
  const alleles = inferAlleleSymbolsFromExercise(exercise);
  return {
    title: exercise.title || '',
    trait: (exercise.title || '').replace(/^Caso aleatorio:\s*/i, '').replace(/^Ejercicio\s+\d+:\s*/i, ''),
    organismType: 'human',
    prompt: [exercise.description, exercise.question].filter(Boolean).join('\n\n'),
    expectedPattern: exercise.answer?.pattern || '',
    alleleDom: alleles.alleleDom,
    alleleDomName: '',
    alleleRec: alleles.alleleRec,
    alleleRecName: '',
    allowAutoCheck: false,
  };
}

function copyExerciseToBuilder(exercise) {
  if (!exercise) {
    alert(t('pedigree.alert.noExerciseToCopy', 'No hay ningún ejercicio cargado para copiar.'));
    return;
  }

  const copy = cloneExerciseForBuilder(exercise);
  builderEngine.readOnly = false;
  setBuilderMetadata(metadataFromExercise(exercise));
  builderEngine.loadExercise(copy);
  setBuilderTool('select');
  setBuilderChildSex('');
  resetBuilderZoomAndSource(exercise.title);
  resetBuilderAnalysisPanel();
  switchTab('constructor');
  document.getElementById('builderWorkspace').scrollIntoView({ block: 'start' });
}

function resetBuilderZoomAndSource(title) {
  resetTreeZoom('builderSvg');
  setBuilderSource(title);
}

function copyAnalysisToBuilder() {
  copyExerciseToBuilder(currentAnalysisExercise);
}

function copyPracticeToBuilder() {
  copyExerciseToBuilder(currentPracticeExercise);
}

function setBuilderStatus(message) {
  const el = document.getElementById('builderSaveStatus');
  if (!el) return;
  el.textContent = message || '';
  if (message) {
    clearTimeout(setBuilderStatus._timer);
    setBuilderStatus._timer = setTimeout(() => { el.textContent = ''; }, 4500);
  }
}

function buildBuilderReferenceSolution() {
  const meta = getBuilderMetadata();
  const pattern = meta.expectedPattern || builderEngine.analyzePattern();
  const alleles = getBuilderAlleles();
  const inferred = inferBuilderGenotypes(pattern, alleles);
  return {
    pattern,
    patternName: RANDOM_PATTERN_NAMES[pattern] || builderEngine.getPatternInfo(pattern).name,
    genotypes: inferred.genotypes,
    genotypeLabels: inferred.genotypeLabels,
    notes: inferred.notes,
  };
}

function serializeBuilderCase(mode = 'teacher') {
  const studentMode = mode === 'student';
  const metadata = getBuilderMetadata();
  const data = {
    type: 'mendelsim-pedigree-case',
    version: 1,
    launchMode: mode,
    metadata,
    assignment: {
      allowAutoCheck: !!metadata.allowAutoCheck,
    },
    individuals: Array.from(builderEngine.individuals.values()).map(ind => ({
      id: ind.id,
      sex: ind.sex,
      affected: !!ind.affected,
      carrier: !!ind.carrier,
      x: ind.x,
      y: ind.y,
      label: ind.label,
      genotype: studentMode ? '' : (ind.genotype || ''),
    })),
    couples: builderEngine.couples.map(c => ({
      id: c.id,
      p1: c.p1,
      p2: c.p2,
      children: [...c.children],
    })),
  };
  if (studentMode && metadata.allowAutoCheck) {
    data.solution = buildBuilderReferenceSolution();
  }
  return data;
}

function normalizeBuilderCase(data) {
  if (!data || !Array.isArray(data.individuals) || !Array.isArray(data.couples)) {
    throw new Error(t('pedigree.error.invalidPedigreeCase', 'El archivo no contiene un caso de pedigrí válido.'));
  }
  const metadata = { ...(data.metadata || {}) };
  if (!metadata.title && data.title) metadata.title = data.title;
  if (!metadata.organismType) metadata.organismType = 'human';
  metadata.allowAutoCheck = !!(metadata.allowAutoCheck || data.assignment?.allowAutoCheck);
  if (!metadata.prompt && (data.description || data.question)) {
    metadata.prompt = [data.description, data.question].filter(Boolean).join('\n\n');
  }
  return {
    metadata,
    launchMode: data.launchMode || 'teacher',
    assignment: data.assignment || { allowAutoCheck: !!metadata.allowAutoCheck },
    solution: data.solution || null,
    exercise: {
      id: data.id || Date.now(),
      title: metadata.title || data.title || t('pedigree.title.builtPedigree', 'Pedigrí construido'),
      description: metadata.prompt || data.description || '',
      question: data.question || '',
      individuals: data.individuals.map(ind => ({
        id: Number(ind.id),
        sex: ind.sex === 'F' ? 'F' : 'M',
        affected: !!ind.affected,
        carrier: !!ind.carrier,
        x: Number(ind.x) || 80,
        y: Number(ind.y) || 80,
        label: ind.label || `#${ind.id}`,
        genotype: ind.genotype || '',
      })),
      couples: data.couples.map(c => ({
        id: c.id || `c${c.p1}-${c.p2}`,
        p1: Number(c.p1),
        p2: Number(c.p2),
        children: Array.isArray(c.children) ? c.children.map(Number) : [],
      })),
    },
  };
}

function loadBuilderCaseData(data, sourceLabel = 'caso cargado') {
  const normalized = normalizeBuilderCase(data);
  setStudentModeUI(false);
  builderEngine.readOnly = false;
  setBuilderMetadata(normalized.metadata);
  builderEngine.loadExercise(normalized.exercise);
  setBuilderTool('select');
  setBuilderChildSex('');
  resetTreeZoom('builderSvg');
  resetBuilderAnalysisPanel();
  setBuilderSource(sourceLabel);
  switchTab('constructor');
  setBuilderStatus(t('pedigree.save.caseLoaded', 'Caso cargado: {title}.', {
    title: normalized.metadata.title || normalized.exercise.title
  }));
}

function safeFilename(text, fallback = 'pedigri-mendelsim') {
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

function saveBuilderCaseToDisk(mode = 'teacher') {
  const data = serializeBuilderCase(mode);
  const json = JSON.stringify(data, null, 2);
  const suffix = mode === 'student' ? 'alumno' : 'editable';
  const filename = `${safeFilename(data.metadata.title || data.metadata.trait)}.${suffix}.mendelsim-pedigri.json`;
  downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), filename);
  setBuilderStatus(mode === 'student'
    ? t('pedigree.save.studentSaved', 'Actividad guardada en modo alumno. Al cargarla se abrirá lista para resolver.')
    : t('pedigree.save.teacherSaved', 'Caso editable guardado para modificarlo más tarde.'));
}

function loadBuilderCaseFromFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.type === 'mendelsim-pedigree-answer') {
        loadStudentSubmissionData(data, file.name);
      } else if (data.launchMode === 'student') {
        loadStudentAssignmentData(data, file.name);
      } else {
        loadBuilderCaseData(data, file.name);
      }
    } catch (err) {
      alert(err.message || t(`pedigree.error.loadCase`, `No se pudo cargar el caso.`));
    }
  };
  reader.readAsText(file);
}

function loadStudentAnswerFromFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      loadStudentSubmissionData(data, file.name);
    } catch (err) {
      alert(err.message || t(`pedigree.error.loadStudentAnswer`, `No se pudo cargar la respuesta del alumno.`));
    }
  };
  reader.readAsText(file);
}

function encodeCaseForURL(data) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeCaseFromURL(encoded) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - encoded.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function copyBuilderShareURL() {
  const encoded = encodeCaseForURL(serializeBuilderCase('student'));
  const url = `${location.origin}${location.pathname}#alumno=${encoded}`;
  try {
    await navigator.clipboard.writeText(url);
    setBuilderStatus(t(`pedigree.feedback.urlCopied`, `URL de alumno copiada al portapapeles.`));
  } catch (err) {
    prompt(t(`pedigree.action.copyUrlPrompt`, `Copia esta URL para compartirla con el alumnado:`), url);
    setBuilderStatus(t('pedigree.feedback.generatedUrl', 'URL generada.'));
  }
}

function loadBuilderCaseFromURL() {
  const studentMatch = location.hash.match(/^#alumno=(.+)$/);
  const teacherMatch = location.hash.match(/^#caso=(.+)$/);
  const answerMatch = location.hash.match(/^#respuesta=(.+)$/);
  if (answerMatch) {
    try {
      const answer = decodeCaseFromURL(answerMatch[1]);
      loadStudentSubmissionData(answer, 'URL compartida');
    } catch (err) {
      console.error(err);
      alert(t('pedigree.error.loadFromUrl', 'No se pudo leer el caso desde la URL.'));
    }
    return;
  }
  const match = studentMatch || teacherMatch;
  if (!match) return;
  try {
    const data = decodeCaseFromURL(match[1]);
    if (studentMatch || data.launchMode === 'student') {
      loadStudentAssignmentData(data, 'URL compartida');
    } else {
      loadBuilderCaseData(data, 'URL editable');
    }
  } catch (err) {
    console.error(err);
    alert(t(`pedigree.error.loadFromUrl`, `No se pudo leer el caso desde la URL.`));
  }
}

function setStudentModeUI(enabled) {
  const tabs = document.querySelector('.tabs');
  if (tabs) tabs.style.display = enabled ? 'none' : '';
  const studentTab = document.getElementById('studentTabBtn');
  if (studentTab && enabled) studentTab.style.display = 'none';
}

function showStudentReviewTab() {
  setStudentModeUI(false);
  const studentTab = document.getElementById('studentTabBtn');
  if (studentTab) studentTab.style.display = '';
  switchTab('alumno', studentTab);
}

function studentObservedStatus(ind) {
  if (ind.affected) return ind.sex === 'F'
    ? t('pedigree.status.affectedFemale', 'Afectada')
    : t('pedigree.status.affectedMale', 'Afectado');
  if (ind.carrier) return ind.sex === 'F'
    ? t('pedigree.status.carrierFemale', 'Portadora')
    : t('pedigree.status.carrierMale', 'Portador');
  return ind.sex === 'F'
    ? t('pedigree.status.unaffectedFemale', 'No afectada')
    : t('pedigree.status.unaffectedMale', 'No afectado');
}

function loadStudentAssignmentData(data, sourceLabel = 'actividad') {
  const normalized = normalizeBuilderCase(data);
  const metadata = normalized.metadata;
  const labels = labelsForOrganism(metadata.organismType);
  const exercise = {
    ...normalized.exercise,
    individuals: normalized.exercise.individuals.map(ind => ({ ...ind, genotype: '' })),
  };

  currentStudentAssignment = {
    metadata,
    assignment: normalized.assignment || {},
    solution: normalized.solution || null,
    exercise,
    sourceLabel,
  };

  studentEngine.setSexLabels(labels);
  studentEngine.readOnly = true;
  studentEngine.loadExercise(exercise);
  resetTreeZoom('studentSvg');
  renderStudentCase();
  setStudentModeUI(true);
  updateStudentResponsePreview();
  switchTab('alumno');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadStudentSubmissionData(answer, sourceLabel = 'respuesta') {
  if (!answer || answer.type !== 'mendelsim-pedigree-answer') {
    throw new Error(t('pedigree.error.invalidStudentAnswer', 'El archivo no parece una respuesta de alumno de MendelSim.'));
  }
  if (!answer.exercise || !Array.isArray(answer.exercise.individuals) || !Array.isArray(answer.exercise.couples)) {
    throw new Error(t('pedigree.error.missingOriginalTree', 'La respuesta no incluye el árbol original. Pide al alumno que descargue de nuevo sus respuestas desde esta versión de MendelSim.'));
  }

  const data = {
    type: 'mendelsim-pedigree-case',
    version: answer.version || 1,
    launchMode: 'student',
    metadata: {
      ...(answer.metadata || {}),
      title: answer.metadata?.title || answer.caseTitle || answer.exercise.title || t('pedigree.title.studentActivity', 'Actividad de pedigrí'),
    },
    assignment: answer.assignment || {},
    solution: answer.solution || null,
    individuals: answer.exercise.individuals,
    couples: answer.exercise.couples,
  };

  loadStudentAssignmentData(data, sourceLabel);
  showStudentReviewTab();

  document.getElementById('studentName').value = answer.studentName || '';
  document.getElementById('studentPattern').value = answer.pattern || '';
  document.getElementById('studentJustification').value = answer.justification || '';

  const genotypes = answer.genotypes || {};
  const notes = answer.notes || {};
  for (const ind of currentStudentAssignment.exercise.individuals) {
    const genotypeInput = document.getElementById(`studentGeno-${ind.id}`);
    if (genotypeInput) {
      genotypeInput.value = genotypes[ind.id] || '';
      updateStudentGenotype(ind.id);
    }
    const noteInput = document.getElementById(`studentNote-${ind.id}`);
    if (noteInput) noteInput.value = notes[ind.id] || '';
  }

  setStudentAnswerReadonly(true);
  showStudentFeedback(
    t('pedigree.feedback.loadedForReview', 'Respuesta cargada para revisión: <strong>{name}</strong>.', {
      name: escapeHTML(answer.studentName || t('pedigree.label.unknownName', '(sin nombre)'))
    }),
    'info'
  );
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStudentCase() {
  const assignment = currentStudentAssignment;
  if (!assignment) return;
  const meta = assignment.metadata;
  const labels = labelsForOrganism(meta.organismType);

  document.getElementById('studentCaseTitle').textContent = meta.title || t('pedigree.title.studentActivity', 'Actividad de pedigrí');
  document.getElementById('studentSvgTitle').textContent = meta.title ? `— ${meta.title}` : '';

  const promptBox = document.getElementById('studentCasePrompt');
  if (meta.prompt) {
    promptBox.style.display = '';
    document.getElementById('studentCasePromptText').innerHTML = formatGenotypeHTML(meta.prompt).replace(/\n/g, '<br>');
  } else {
    promptBox.style.display = 'none';
    document.getElementById('studentCasePromptText').innerHTML = '';
  }

  const metaItems = [];
  metaItems.push(`<div class="student-meta-item"><strong>${t('pedigree.print.organism', 'Organismo')}</strong><br>${meta.organismType === 'other' ? t('pedigree.print.otherOrganisms', 'otros organismos (macho/hembra)') : t('pedigree.print.people', 'personas (hombre/mujer)')}</div>`);
  if (meta.trait) metaItems.push(`<div class="student-meta-item"><strong>${t('pedigree.print.trait', 'Rasgo')}</strong><br>${escapeHTML(meta.trait)}</div>`);
  const alleleText = [
    meta.alleleDomName ? `${formatGenotypeHTML(meta.alleleDom || 'A')} = ${escapeHTML(meta.alleleDomName)}` : '',
    meta.alleleRecName ? `${formatGenotypeHTML(meta.alleleRec || 'a')} = ${escapeHTML(meta.alleleRecName)}` : '',
  ].filter(Boolean).join('<br>');
  if (alleleText) metaItems.push(`<div class="student-meta-item"><strong>${t('pedigree.print.alleles', 'Alelos')}</strong><br>${alleleText}</div>`);
  document.getElementById('studentCaseMeta').innerHTML = metaItems.join('');

  const tbody = document.getElementById('studentGenotypeTableBody');
  tbody.innerHTML = '';
  const individuals = [...assignment.exercise.individuals].sort((a, b) => a.id - b.id);
  for (const ind of individuals) {
    tbody.innerHTML += `<tr>
      <td><strong>${escapeHTML(ind.label)}</strong></td>
      <td>${sexLabel(ind.sex, labels)}</td>
      <td>${studentObservedStatus(ind)}</td>
      <td><input class="student-answer-input" id="studentGeno-${ind.id}" type="text" placeholder="Ej: Aa" oninput="updateStudentGenotype(${ind.id})"></td>
      <td><input id="studentNote-${ind.id}" type="text" placeholder="${t('pedigree.placeholder.studentNote', 'Duda o justificación breve')}" oninput="updateStudentResponsePreview()"></td>
    </tr>`;
  }

  document.getElementById('studentName').value = '';
  document.getElementById('studentPattern').value = '';
  document.getElementById('studentJustification').value = '';
  document.getElementById('studentFeedback').classList.remove('visible');
  document.getElementById('studentFeedback').innerHTML = '';
  setStudentAnswerReadonly(false);

  const allowCheck = !!assignment.assignment?.allowAutoCheck && !!assignment.solution;
  const checkBtn = document.getElementById('studentCheckBtn');
  checkBtn.disabled = !allowCheck;
  document.getElementById('studentAutoCheckNote').textContent = allowCheck
    ? t('pedigree.feedback.autoCheckEnabled', 'El profesor ha activado la autocorrección para esta actividad.')
    : t('pedigree.feedback.autoCheckDisabled', 'El profesor no ha activado la autocorrección. Completa la respuesta y envíala.');
}

function setStudentAnswerReadonly(readonly) {
  ['studentName', 'studentJustification'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.readOnly = readonly;
  });
  const pattern = document.getElementById('studentPattern');
  if (pattern) pattern.disabled = readonly;
  document.querySelectorAll('#studentGenotypeTableBody input').forEach(input => {
    input.readOnly = readonly;
  });
}

function updateStudentGenotype(id) {
  const input = document.getElementById(`studentGeno-${id}`);
  const ind = studentEngine.individuals.get(id);
  if (!input || !ind) return;
  ind.genotype = input.value.trim();
  studentEngine.render();
  updateStudentResponsePreview();
}

function updateStudentResponsePreview() {
  const name = document.getElementById('studentName')?.value.trim() || '';
  document.querySelectorAll('.student-export-btn').forEach(btn => {
    btn.disabled = !name;
  });
}

function collectStudentAnswers() {
  const assignment = currentStudentAssignment;
  const individuals = assignment ? [...assignment.exercise.individuals].sort((a, b) => a.id - b.id) : [];
  const genotypes = {};
  const notes = {};
  for (const ind of individuals) {
    genotypes[ind.id] = document.getElementById(`studentGeno-${ind.id}`)?.value.trim() || '';
    notes[ind.id] = document.getElementById(`studentNote-${ind.id}`)?.value.trim() || '';
  }
  return {
    type: 'mendelsim-pedigree-answer',
    version: 1,
    caseTitle: assignment?.metadata?.title || t('pedigree.title.studentActivity', 'Actividad de pedigrí'),
    metadata: assignment?.metadata || {},
    assignment: assignment?.assignment || {},
    solution: assignment?.solution || null,
    exercise: assignment ? {
      title: assignment.metadata?.title || assignment.exercise?.title || t('pedigree.title.studentActivity', 'Actividad de pedigrí'),
      individuals: assignment.exercise.individuals.map(ind => ({
        id: ind.id,
        sex: ind.sex,
        affected: !!ind.affected,
        carrier: !!ind.carrier,
        x: ind.x,
        y: ind.y,
        label: ind.label,
      })),
      couples: assignment.exercise.couples.map(c => ({
        id: c.id,
        p1: c.p1,
        p2: c.p2,
        children: [...c.children],
      })),
    } : null,
    studentName: document.getElementById('studentName').value.trim(),
    pattern: document.getElementById('studentPattern').value,
    patternLabel: RANDOM_PATTERN_NAMES[document.getElementById('studentPattern').value] || document.getElementById('studentPattern').value,
    justification: document.getElementById('studentJustification').value.trim(),
    genotypes,
    notes,
    sentAt: new Date().toISOString(),
  };
}

function formatStudentAnswersText(answer = collectStudentAnswers()) {
  const assignment = currentStudentAssignment;
  const individuals = assignment ? [...assignment.exercise.individuals].sort((a, b) => a.id - b.id) : [];
  const locale = window.MendelSimI18n?.getLocale() || 'es';
  const localeMap = { es: 'es-ES', ca: 'ca-ES', en: 'en-GB' };
  const lc = localeMap[locale] || locale;
  const now = new Date();
  const dateStr = now.toLocaleDateString(lc, { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + now.toLocaleTimeString(lc, { hour: '2-digit', minute: '2-digit' });
  const lines = [
    `${t('pedigree.print.case', 'Caso')}: ${answer.caseTitle}`,
    `${t('pedigree.print.studentLabel', 'Alumno/a')}: ${answer.studentName || t('pedigree.label.unknownName', '(sin nombre)')}`,
    `${t('pedigree.print.dateLabel', 'Fecha y hora')}: ${dateStr}`,
    `${t('pedigree.label.proposedPattern', 'Patrón propuesto')}: ${answer.patternLabel || t('pedigree.label.unspecifiedAnswer', '(sin responder)')}`,
    '',
    `${t('pedigree.label.justification', 'Justificación')}:`,
    answer.justification || t('pedigree.label.unspecifiedAnswer', '(sin responder)'),
    '',
    `${t('pedigree.print.genotypes', 'Genotipos propuestos')}:`,
  ];
  for (const ind of individuals) {
    const note = answer.notes[ind.id] ? ` | ${t('pedigree.print.note', 'Nota')}: ${answer.notes[ind.id]}` : '';
    lines.push(`- ${ind.label}: ${answer.genotypes[ind.id] || t('pedigree.label.unspecifiedAnswer', '(sin responder)')}${note}`);
  }
  return lines.join('\n');
}

function downloadStudentAnswers() {
  const answer = collectStudentAnswers();
  answer.text = formatStudentAnswersText(answer);
  const filename = `${safeFilename(answer.studentName, 'respuesta-alumno')}.respuesta-mendelsim.json`;
  downloadBlob(new Blob([JSON.stringify(answer, null, 2)], { type: 'application/json;charset=utf-8' }), filename);
}

async function copyStudentAnswers() {
  const text = formatStudentAnswersText();
  try {
    await navigator.clipboard.writeText(text);
    showStudentFeedback(t('pedigree.feedback.clipboardCopied', 'Respuestas copiadas al portapapeles.'), 'success');
  } catch (err) {
    prompt(t('pedigree.alert.copyPrompt', 'Copia estas respuestas:'), text);
  }
}

async function shareStudentAnswerAsURL() {
  if (!currentStudentAssignment) {
    alert(t('exercise.shareAnswerNoActivity', 'No hay actividad cargada.'));
    return;
  }
  const answer = collectStudentAnswers();
  const encoded = encodeCaseForURL(answer);
  const url = `${location.origin}${location.pathname}#respuesta=${encoded}`;
  try {
    await navigator.clipboard.writeText(url);
    showStudentFeedback(t('exercise.shareAnswerCopied', 'URL copiada al portapapeles. Envíala a tu profesor/a.'), 'success');
  } catch (err) {
    prompt(t('exercise.shareAnswerFallback', 'Copia esta URL para enviarla al profesor/a:'), url);
  }
}

function normalizeGenotypeForCheck(value) {
  return String(value || '')
    .replace(/[ᴬᵃᴮᵇᶜᴰᵈᴴʰᴿʳ]/g, ch => ({
      'ᴬ':'^A','ᵃ':'^a','ᴮ':'^B','ᵇ':'^b','ᶜ':'^c','ᴰ':'^D','ᵈ':'^d','ᴴ':'^H','ʰ':'^h','ᴿ':'^R','ʳ':'^r'
    }[ch] || ch))
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function genotypeAccepted(studentValue, referenceValue) {
  const student = normalizeGenotypeForCheck(studentValue);
  if (!student) return false;
  const alternatives = String(referenceValue || '').split(/\s+o\s+/i).map(normalizeGenotypeForCheck);
  return alternatives.includes(student);
}

function showStudentFeedback(message, type = 'info') {
  const box = document.getElementById('studentFeedback');
  box.className = `alert student-feedback visible alert-${type}`;
  box.innerHTML = message;
}

function checkStudentAnswers() {
  const assignment = currentStudentAssignment;
  if (!assignment?.solution) return;
  const answer = collectStudentAnswers();
  const solution = assignment.solution;
  const rows = [];

  const patternOk = answer.pattern && answer.pattern === solution.pattern;
  rows.push(`<p><span class="${patternOk ? 'check-ok' : 'check-error'}">${patternOk ? '✓' : '✗'}</span> ${t('pedigree.label.inheritancePattern', 'Patrón de herencia')}: ${patternOk ? t('pedigree.feedback.correct', 'correcto') : `${t('pedigree.feedback.reviewAnswer', 'revisa tu respuesta')}. ${t('pedigree.feedback.reference', 'Referencia')}: ${RANDOM_PATTERN_NAMES[solution.pattern] || solution.pattern}`}</p>`);

  const individuals = [...assignment.exercise.individuals].sort((a, b) => a.id - b.id);
  for (const ind of individuals) {
    const reference = solution.genotypes?.[ind.id];
    if (!reference) continue;
    const value = answer.genotypes[ind.id];
    const ok = genotypeAccepted(value, reference);
    rows.push(`<p><span class="${ok ? 'check-ok' : 'check-warn'}">${ok ? '✓' : '!'}</span> ${escapeHTML(ind.label)}: ${ok ? t('pedigree.feedback.compatibleGenotype', 'genotipo compatible') : `${t('pedigree.feedback.compatibleReference', 'referencia compatible')}: <code>${formatGenotypeHTML(reference)}</code>`}</p>`);
  }

  showStudentFeedback(rows.join(''), patternOk ? 'success' : 'warning');
}

function cssVar(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function exportedBuilderSVG() {
  const svg = document.getElementById('builderSvg');
  const clone = svg.cloneNode(true);
  const viewBox = svg.viewBox.baseVal;
  const width = viewBox?.width || parseFloat(svg.getAttribute('width')) || 700;
  const height = viewBox?.height || parseFloat(svg.getAttribute('height')) || 450;
  const affected = cssVar('--affected', '#c0392b');
  const carrier = cssVar('--carrier', '#e67e22');
  const text = cssVar('--text', '#2c3e50');
  const primary = cssVar('--primary', '#1a7431');

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', width);
  clone.setAttribute('height', height);
  clone.removeAttribute('style');

  clone.querySelectorAll('*').forEach(el => {
    for (const attr of ['fill', 'stroke']) {
      const value = el.getAttribute(attr);
      if (!value || !value.includes('var(')) continue;
      el.setAttribute(attr, value
        .replace(/var\(--affected\)/g, affected)
        .replace(/var\(--carrier\)/g, carrier)
        .replace(/var\(--primary-light\)/g, primary)
        .replace(/var\(--primary\)/g, primary)
        .replace(/var\(--text\)/g, text));
    }
  });

  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    .ped-line { stroke: ${text}; stroke-width: 1.8; fill: none; }
    .ped-label { font-family: Inter, Arial, sans-serif; font-size: 11px; fill: #555; text-anchor: middle; }
    .ped-genotype { font-family: Consolas, monospace; font-size: 10px; fill: ${primary}; text-anchor: middle; font-weight: 600; }
  `;
  clone.insertBefore(style, clone.firstChild);

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', 0);
  bg.setAttribute('y', 0);
  bg.setAttribute('width', width);
  bg.setAttribute('height', height);
  bg.setAttribute('fill', '#fafffe');
  clone.insertBefore(bg, style.nextSibling);

  return { text: new XMLSerializer().serializeToString(clone), width, height };
}

function wrapCanvasText(ctx, text, maxWidth, maxLines = 4) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  let truncated = false;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
    if (lines.length === maxLines) {
      truncated = i < words.length - 1 || !!line;
      break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (truncated && lines.length === maxLines) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > 3 ? `${last.replace(/\s+\S*$/, '')}...` : `${last}...`;
  }
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadBuilderPNG() {
  const meta = getBuilderMetadata();
  const svg = exportedBuilderSVG();
  const svgBlob = new Blob([svg.text], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(svgUrl);
    const scale = 2;
    const logicalWidth = Math.max(svg.width + 64, 860);
    const padding = 32;
    const temp = document.createElement('canvas').getContext('2d');
    temp.font = '14px Arial';
    const promptLines = wrapCanvasText(temp, meta.prompt, logicalWidth - padding * 2, 4);
    const metaLines = [];
    metaLines.push(`${t('pedigree.print.organism', 'Organismo')}: ${meta.organismType === 'other' ? t('pedigree.print.otherOrganisms', 'otros organismos (macho/hembra)') : t('pedigree.print.people', 'personas (hombre/mujer)')}`);
    if (meta.trait) metaLines.push(`${t('pedigree.print.trait', 'Rasgo')}: ${meta.trait}`);
    const alleleParts = [];
    if (meta.alleleDomName) alleleParts.push(`${meta.alleleDom} = ${meta.alleleDomName}`);
    if (meta.alleleRecName) alleleParts.push(`${meta.alleleRec} = ${meta.alleleRecName}`);
    if (alleleParts.length) metaLines.push(`${t('pedigree.print.alleles', 'Alelos')}: ${alleleParts.join('; ')}`);
    if (meta.expectedPattern) metaLines.push(`${t('pedigree.label.expectedPattern', 'Patrón esperado')}: ${RANDOM_PATTERN_NAMES[meta.expectedPattern] || meta.expectedPattern}`);

    const headerHeight = padding + 30 + metaLines.length * 20 + promptLines.length * 18 + 22;
    const logicalHeight = headerHeight + svg.height + padding;
    const canvas = document.createElement('canvas');
    canvas.width = logicalWidth * scale;
    canvas.height = logicalHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    let y = padding;
    ctx.fillStyle = cssVar('--primary', '#1a7431');
    ctx.font = '700 22px Arial';
    ctx.fillText(meta.title || t('pedigree.title.builtPedigree', 'Pedigrí construido'), padding, y);
    y += 28;

    ctx.fillStyle = '#374151';
    ctx.font = '13px Arial';
    for (const line of metaLines) {
      ctx.fillText(line, padding, y);
      y += 20;
    }
    if (promptLines.length) {
      ctx.fillStyle = '#4b5563';
      ctx.font = '13px Arial';
      for (const line of promptLines) {
        ctx.fillText(line, padding, y);
        y += 18;
      }
    }
    y += 12;
    ctx.drawImage(img, (logicalWidth - svg.width) / 2, y, svg.width, svg.height);

    canvas.toBlob(blob => {
      if (!blob) {
        alert(t(`pedigree.error.pngFailed`, `No se pudo generar el PNG.`));
        return;
      }
      downloadBlob(blob, `${safeFilename(meta.title || meta.trait)}.png`);
      setBuilderStatus('PNG descargado.');
    }, 'image/png');
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

// ══════════════════════════════════════════════════════
// ANALYSIS TAB
// ══════════════════════════════════════════════════════
function loadAnalysisExercise() {
  const id = parseInt(document.getElementById('exerciseSelect').value);
  const ex = EXERCISES.find(e => e.id === id);
  if (!ex) return;
  setAnalysisExercise(ex);
}

function loadRandomAnalysisExercise() {
  setAnalysisExercise(createRandomPedigreeExercise());
}

function setAnalysisExercise(ex) {
  currentAnalysisExercise = ex;
  currentClueIndex = 0;
  solutionVisible  = false;

  // Sync selector
  const sel = document.getElementById('exerciseSelect');
  const opt = sel.querySelector(`option[value="${ex.id}"]`);
  if (opt) {
    sel.value = ex.id;
  } else {
    let generated = sel.querySelector('option[value="__generated__"]');
    if (!generated) {
      generated = document.createElement('option');
      generated.value = '__generated__';
      sel.appendChild(generated);
    }
    generated.textContent = `🎲 ${ex.title}`;
    sel.value = '__generated__';
  }

  // Apply sex labels for organism type
  const aLabels = labelsForOrganism(ex.organismType || 'human');
  analysisEngine.setSexLabels(aLabels);
  updateLegendSexLabels(aLabels);

  // Load pedigree
  analysisEngine.loadExercise(ex);

  // Update UI
  document.getElementById('exerciseDescText').innerHTML = formatGenotypeHTML(ex.description);
  document.getElementById('exerciseDescription').style.display = '';
  document.getElementById('exerciseQuestionText').innerHTML = '<strong>Pregunta:</strong> ' + formatGenotypeHTML(ex.question);
  document.getElementById('exerciseQuestion').style.display = '';
  document.getElementById('analysisSvgTitle').textContent = '— ' + ex.title;

  // Reset clues
  document.getElementById('clueList').innerHTML = '';
  document.getElementById('clueBtn').textContent = `💡 ${t('pedigree.feedback.clue', 'Pista')} (0/${ex.answer.clues.length})`;
  document.getElementById('clueBtn').disabled = false;
  document.getElementById('solutionBox').classList.remove('visible');
  document.getElementById('solutionBtn').textContent = t('pedigree.button.showSolution', '✅ Ver solución');

  // Clear genotype display
  analysisEngine.hideSolution();
}

function revealNextClue() {
  const ex = currentAnalysisExercise;
  if (!ex) return;
  if (currentClueIndex >= ex.answer.clues.length) return;
  const clue = ex.answer.clues[currentClueIndex];
  currentClueIndex++;

  const li = document.createElement('div');
  li.className = 'clue-item';
  li.innerHTML = `<div class="clue-num">${currentClueIndex}</div><div>${formatGenotypeHTML(clue)}</div>`;
  document.getElementById('clueList').appendChild(li);

  document.getElementById('clueBtn').textContent =
    `💡 ${t('pedigree.feedback.clue', 'Pista')} (${currentClueIndex}/${ex.answer.clues.length})`;

  if (currentClueIndex >= ex.answer.clues.length) {
    document.getElementById('clueBtn').disabled = true;
  }
}

function toggleSolution() {
  const ex = currentAnalysisExercise;
  if (!ex) return;
  solutionVisible = !solutionVisible;
  const box = document.getElementById('solutionBox');

  if (solutionVisible) {
    box.classList.add('visible');
    document.getElementById('solutionBtn').textContent = t('pedigree.button.hideSolution', '🙈 Ocultar solución');

    // Show genotypes on pedigree
    analysisEngine.showSolution(ex.answer);

    // Pattern display
    const patternInfo = analysisEngine.getPatternInfo(ex.answer.pattern);
    document.getElementById('patternDisplay').innerHTML =
      `<div class="pattern-result ${patternInfo.class}">
        🧬 ${t('pedigree.label.inheritancePattern', 'Patrón de herencia')}: <strong>${patternInfo.name}</strong>
      </div>`;
    document.getElementById('patternDesc').innerHTML = formatGenotypeHTML(patternInfo.description);

    // Genotype table
    const tbody = document.getElementById('genotypeTableBody');
    tbody.innerHTML = '';
    for (const [idStr, geno] of Object.entries(ex.answer.genotypes)) {
      const id  = parseInt(idStr);
      const ind = ex.individuals.find(i => i.id === id);
      if (!ind) continue;
      const statusLabel = genderedStatusLabel(ex.answer.genotypeLabels?.[id] || (ind.affected ? t('pedigree.status.affectedNeutral', 'Afectado/a') : t('pedigree.status.unaffectedNeutral', 'No afectado/a')), ind.sex);
      tbody.innerHTML += `<tr>
        <td><strong>${ind.label}</strong> (${sexLabel(ind.sex, labelsForOrganism(ex.organismType || 'human'))})</td>
        <td><code>${formatGenotypeHTML(geno)}</code></td>
        <td>${statusLabel}</td>
      </tr>`;
    }
    if (ex.answer.probability) {
      document.getElementById('patternDesc').innerHTML +=
        `<br><br><strong>${t('pedigree.feedback.probabilityAffected', 'Probabilidad de descendiente afectado')}:</strong> <span style="color:var(--affected);font-weight:700;">${ex.answer.probability}</span>`;
    }
  } else {
    box.classList.remove('visible');
    document.getElementById('solutionBtn').textContent = t('pedigree.button.showSolution', '✅ Ver solución');
    analysisEngine.hideSolution();
  }
}

function resetExercise() {
  currentClueIndex = 0;
  solutionVisible  = false;
  document.getElementById('clueList').innerHTML  = '';
  document.getElementById('solutionBox').classList.remove('visible');
  document.getElementById('solutionBtn').textContent = t('pedigree.button.showSolution', '✅ Ver solución');
  if (currentAnalysisExercise) {
    document.getElementById('clueBtn').textContent =
      `💡 ${t('pedigree.feedback.clue', 'Pista')} (0/${currentAnalysisExercise.answer.clues.length})`;
    document.getElementById('clueBtn').disabled = false;
    analysisEngine.hideSolution();
    analysisEngine.loadExercise(currentAnalysisExercise);
  }
}

// ══════════════════════════════════════════════════════
// PRACTICE TAB
// ══════════════════════════════════════════════════════
function loadPracticeExercise() {
  const id = parseInt(document.getElementById('practiceExerciseSelect').value);
  const ex = EXERCISES.find(e => e.id === id);
  if (!ex) return;
  setPracticeExercise(ex);
}

function loadRandomPracticeExercise() {
  setPracticeExercise(createRandomPedigreeExercise());
}

function setPracticeExercise(ex) {
  currentPracticeExercise = ex;

  // Sync selector
  const sel = document.getElementById('practiceExerciseSelect');
  const opt = sel.querySelector(`option[value="${ex.id}"]`);
  if (opt) {
    sel.value = ex.id;
  } else {
    let generated = sel.querySelector('option[value="__generated__"]');
    if (!generated) {
      generated = document.createElement('option');
      generated.value = '__generated__';
      sel.appendChild(generated);
    }
    generated.textContent = `🎲 ${ex.title}`;
    sel.value = '__generated__';
  }

  const pLabels = labelsForOrganism(ex.organismType || 'human');
  practiceEngine.setSexLabels(pLabels);
  practiceEngine.loadExercise(ex);
  document.getElementById('practiceQuestionText').innerHTML = '<strong>Pregunta:</strong> ' + formatGenotypeHTML(ex.question);
  document.getElementById('practiceQuestion').style.display = '';
  document.getElementById('feedbackBox').style.display = 'none';
  document.getElementById('justification').value = '';
  document.querySelectorAll('.practice-mc label').forEach(l => {
    l.classList.remove('correct','wrong','selected');
  });
  document.querySelectorAll('.practice-mc input').forEach(i => { i.checked = false; });
}

function checkAnswer() {
  const ex = currentPracticeExercise;
  if (!ex) return;
  const chosen = document.querySelector('input[name="pattern"]:checked');
  if (!chosen) {
    alert(t(`pedigree.alert.selectPattern`, `Por favor, selecciona un patrón de herencia antes de comprobar.`));
    return;
  }

  scoreTot++;
  document.getElementById('scoreTot').textContent = scoreTot;

  const isCorrect = chosen.value === ex.answer.pattern;
  const feedbackBox = document.getElementById('feedbackBox');
  feedbackBox.style.display = '';

  // Color the labels
  document.querySelectorAll('.practice-mc label').forEach(label => {
    const input = label.querySelector('input');
    label.classList.remove('correct','wrong','selected');
    if (input.value === ex.answer.pattern) {
      label.classList.add('correct');
    } else if (input.checked) {
      label.classList.add('wrong');
    }
  });

  if (isCorrect) {
    score++;
    document.getElementById('scoreNum').textContent = score;
    feedbackBox.className = 'alert alert-success';
    feedbackBox.innerHTML = `<span class="alert-icon">✅</span>
      <div><strong>${t('pedigree.feedback.correctAnswer', '¡Correcto!')}</strong> ${t('pedigree.feedback.correctPattern', 'El patrón es')} <strong>${ex.answer.patternName}</strong>.
      ${formatGenotypeHTML(analysisEngine.getPatternInfo(ex.answer.pattern).description)}</div>`;
  } else {
    feedbackBox.className = 'alert alert-error';
    feedbackBox.innerHTML = `<span class="alert-icon">❌</span>
      <div><strong>${t('pedigree.feedback.incorrectAnswer', 'Incorrecto.')}</strong> ${t('pedigree.feedback.referencePattern', 'El patrón correcto es')} <strong>${ex.answer.patternName}</strong>.
      ${t('pedigree.feedback.clue', 'Pista')}: ${formatGenotypeHTML(ex.answer.clues[0])}</div>`;
  }
}

function resetScore() {
  score = 0; scoreTot = 0;
  document.getElementById('scoreNum').textContent = 0;
  document.getElementById('scoreTot').textContent = 0;
}

// ══════════════════════════════════════════════════════
// BUILDER TAB
// ══════════════════════════════════════════════════════
function setBuilderTool(tool) {
  builderEngine.setTool(tool);
  document.querySelectorAll('#builderToolbar .tool-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('tool-' + tool);
  if (activeBtn) activeBtn.classList.add('active');
}

function setBuilderChildSex(sex) {
  builderEngine.setChildSex(sex || null);
  document.querySelectorAll('#builderToolbar .sex-option').forEach(btn => btn.classList.remove('active'));
  const activeId = sex === 'M' ? 'child-sex-male' : sex === 'F' ? 'child-sex-female' : 'child-sex-random';
  document.getElementById(activeId).classList.add('active');
}

function getBuilderAlleles() {
  const meta = getBuilderMetadata();
  return {
    dom: meta.alleleDom,
    rec: meta.alleleRec,
    domName: meta.alleleDomName,
    recName: meta.alleleRecName,
    trait: meta.trait,
  };
}

function builderAlleleSummaryHTML(alleles) {
  const parts = [];
  if (alleles.trait) parts.push(`<strong>${t('pedigree.print.trait', 'Rasgo')}:</strong> ${escapeHTML(alleles.trait)}`);
  if (alleles.domName) parts.push(`<strong>${formatGenotypeHTML(alleles.dom)}:</strong> ${escapeHTML(alleles.domName)}`);
  if (alleles.recName) parts.push(`<strong>${formatGenotypeHTML(alleles.rec)}:</strong> ${escapeHTML(alleles.recName)}`);
  return parts.length ? `<div style="margin-top:0.5rem;">${parts.join(' · ')}</div>` : '';
}

function autoGeno(a1, a2) {
  return `${a1}${a2}`;
}

function xGeno(a1, a2) {
  if (a2 === 'Y') return `X^${a1} Y`;
  return `X^${a1} X^${a2}`;
}

function genderedStatusLabel(label, sex) {
  const isFemale = sex === 'F';
  return String(label || '')
    // Spanish
    .replace(/Portador\/a/g, isFemale ? 'Portadora' : 'Portador')
    .replace(/portador\/a/g, isFemale ? 'portadora' : 'portador')
    .replace(/Afectado\/a/g, isFemale ? 'Afectada' : 'Afectado')
    .replace(/afectado\/a/g, isFemale ? 'afectada' : 'afectado')
    .replace(/Heterocigoto\/a/g, isFemale ? 'Heterocigota' : 'Heterocigoto')
    .replace(/heterocigoto\/a/g, isFemale ? 'heterocigota' : 'heterocigoto')
    .replace(/Marcado\/a/g, isFemale ? 'Marcada' : 'Marcado')
    .replace(/marcado\/a/g, isFemale ? 'marcada' : 'marcado')
    // Catalan
    .replace(/Afectat\/ada/g, isFemale ? 'Afectada' : 'Afectat')
    .replace(/afectat\/ada/g, isFemale ? 'afectada' : 'afectat')
    .replace(/Heterozigot\/a/g, isFemale ? 'Heterozigota' : 'Heterozigot')
    .replace(/heterozigot\/a/g, isFemale ? 'heterozigota' : 'heterozigot')
    .replace(/Marcat\/ada/g, isFemale ? 'Marcada' : 'Marcat')
    .replace(/marcat\/ada/g, isFemale ? 'marcada' : 'marcat');
}

function inferBuilderGenotypes(pattern, alleles) {
  const D = alleles.dom;
  const r = alleles.rec;
  const sexLabels = getBuilderSexLabels();
  const individuals = Array.from(builderEngine.individuals.values());
  const genotypes = {};
  const genotypeLabels = {};
  const notes = [];

  if (pattern === 'unknown') {
    notes.push(t('pedigree.pattern.unknown.description', 'No hay suficientes datos para determinar el patrón de herencia.'));
    return { genotypes, genotypeLabels, notes };
  }

  if (pattern === 'AD') {
    for (const ind of individuals) {
      if (ind.affected) {
        genotypes[ind.id] = `${D}_`;
        genotypeLabels[ind.id] = t('pedigree.status.affectedNeutral', 'Afectado/a');
      } else if (ind.carrier) {
        genotypes[ind.id] = autoGeno(D, r);
        genotypeLabels[ind.id] = t('pedigree.status.markedCarrierNeutral', 'Portador/a marcado/a');
      } else {
        genotypes[ind.id] = autoGeno(r, r);
        genotypeLabels[ind.id] = t('pedigree.status.unaffectedNeutral', 'No afectado/a');
      }
    }
    for (const couple of builderEngine.couples) {
      const parents = [builderEngine.individuals.get(couple.p1), builderEngine.individuals.get(couple.p2)].filter(Boolean);
      const children = couple.children.map(id => builderEngine.individuals.get(id)).filter(Boolean);
      const hasUnaffectedChild = children.some(child => !child.affected);
      for (const parent of parents) {
        if (parent.affected && hasUnaffectedChild) {
          genotypes[parent.id] = autoGeno(D, r);
          genotypeLabels[parent.id] = t('pedigree.status.heterozygousAffectedNeutral', 'Afectado/a heterocigoto/a');
        }
      }
      const hasUnaffectedParent = parents.some(parent => !parent.affected);
      for (const child of children) {
        if (child.affected && hasUnaffectedParent) {
          genotypes[child.id] = autoGeno(D, r);
          genotypeLabels[child.id] = t('pedigree.status.heterozygousAffectedNeutral', 'Afectado/a heterocigoto/a');
        }
      }
    }
    notes.push(t(`pedigree.note.AD`,
      `En herencia dominante, la descendencia no afectada se representa como ${autoGeno(r, r)}. Los afectados pueden ser ${autoGeno(D, r)} o ${autoGeno(D, D)} si el árbol no permite distinguirlo.`,
      { rr: autoGeno(r, r), Dr: autoGeno(D, r), DD: autoGeno(D, D) }));
  } else if (pattern === 'AR') {
    for (const ind of individuals) {
      if (ind.affected) {
        genotypes[ind.id] = autoGeno(r, r);
        genotypeLabels[ind.id] = t('pedigree.status.affectedNeutral', 'Afectado/a');
      } else if (ind.carrier) {
        genotypes[ind.id] = autoGeno(D, r);
        genotypeLabels[ind.id] = t('pedigree.status.carrierNeutral', 'Portador/a');
      } else {
        genotypes[ind.id] = `${D}_`;
        genotypeLabels[ind.id] = t('pedigree.status.unaffectedNeutral', 'No afectado/a');
      }
    }
    for (const couple of builderEngine.couples) {
      const parents = [builderEngine.individuals.get(couple.p1), builderEngine.individuals.get(couple.p2)].filter(Boolean);
      const children = couple.children.map(id => builderEngine.individuals.get(id)).filter(Boolean);
      const hasAffectedChild = children.some(child => child.affected);
      if (hasAffectedChild) {
        for (const parent of parents) {
          if (!parent.affected) {
            genotypes[parent.id] = autoGeno(D, r);
            genotypeLabels[parent.id] = t('pedigree.status.carrierNeutral', 'Portador/a');
          }
        }
      }
      const hasAffectedParent = parents.some(parent => parent.affected);
      if (hasAffectedParent) {
        for (const child of children) {
          if (!child.affected) {
            genotypes[child.id] = autoGeno(D, r);
            genotypeLabels[child.id] = t('pedigree.status.carrierNeutral', 'Portador/a');
          }
        }
      }
    }
    notes.push(t(`pedigree.note.AR`,
      `En herencia recesiva, los afectados son ${autoGeno(r, r)}. Los no afectados pueden ser ${autoGeno(D, D)} o ${autoGeno(D, r)} si no hay más información.`,
      { rr: autoGeno(r, r), DD: autoGeno(D, D), Dr: autoGeno(D, r) }));
  } else if (pattern === 'XR') {
    for (const ind of individuals) {
      if (ind.sex === 'M') {
        genotypes[ind.id] = ind.affected ? xGeno(r, 'Y') : xGeno(D, 'Y');
        genotypeLabels[ind.id] = ind.affected ? t('pedigree.status.affectedMale', 'Afectado') : t('pedigree.status.unaffectedMale', 'No afectado');
      } else if (ind.affected) {
        genotypes[ind.id] = xGeno(r, r);
        genotypeLabels[ind.id] = t('pedigree.status.affectedFemale', 'Afectada');
      } else if (ind.carrier) {
        genotypes[ind.id] = xGeno(D, r);
        genotypeLabels[ind.id] = t('pedigree.status.carrierFemale', 'Portadora');
      } else {
        genotypes[ind.id] = `${xGeno(D, D)} o ${xGeno(D, r)}`;
        genotypeLabels[ind.id] = t('pedigree.status.unaffectedFemale', 'No afectada');
      }
    }
    for (const couple of builderEngine.couples) {
      const p1 = builderEngine.individuals.get(couple.p1);
      const p2 = builderEngine.individuals.get(couple.p2);
      const parents = [p1, p2].filter(Boolean);
      const father = parents.find(parent => parent.sex === 'M');
      const mother = parents.find(parent => parent.sex === 'F');
      const children = couple.children.map(id => builderEngine.individuals.get(id)).filter(Boolean);
      if (mother && children.some(child => child.sex === 'M' && child.affected) && !mother.affected) {
        genotypes[mother.id] = xGeno(D, r);
        genotypeLabels[mother.id] = t('pedigree.status.carrierFemale', 'Portadora');
      }
      if (father && father.affected) {
        for (const daughter of children.filter(child => child.sex === 'F' && !child.affected)) {
          genotypes[daughter.id] = xGeno(D, r);
          genotypeLabels[daughter.id] = t('pedigree.status.carrierFemale', 'Portadora');
        }
      }
    }
    notes.push(t(`pedigree.note.XR`,
      `En herencia recesiva ligada al X, los ${sexLabels.malePlural} no son portadores: o están afectados o no lo están. Las ${sexLabels.femalePlural} no afectadas pueden ser portadoras.`,
      { malePlural: sexLabels.malePlural, femalePlural: sexLabels.femalePlural }));
  } else if (pattern === 'XD') {
    for (const ind of individuals) {
      if (ind.sex === 'M') {
        genotypes[ind.id] = ind.affected ? xGeno(D, 'Y') : xGeno(r, 'Y');
      } else {
        genotypes[ind.id] = ind.affected ? `${xGeno(D, r)} o ${xGeno(D, D)}` : xGeno(r, r);
      }
      genotypeLabels[ind.id] = ind.affected ? t('pedigree.status.affectedNeutral', 'Afectado/a') : t('pedigree.status.unaffectedNeutral', 'No afectado/a');
    }
    for (const couple of builderEngine.couples) {
      const parents = [builderEngine.individuals.get(couple.p1), builderEngine.individuals.get(couple.p2)].filter(Boolean);
      const father = parents.find(parent => parent.sex === 'M');
      const mother = parents.find(parent => parent.sex === 'F');
      const children = couple.children.map(id => builderEngine.individuals.get(id)).filter(Boolean);
      if (father && father.affected && mother && !mother.affected) {
        for (const daughter of children.filter(child => child.sex === 'F' && child.affected)) {
          genotypes[daughter.id] = xGeno(D, r);
          genotypeLabels[daughter.id] = t('pedigree.status.heterozygousAffectedFemale', 'Afectada heterocigota');
        }
      }
    }
    {
      const isHuman = [`man`, `hombre`, `home`].includes(sexLabels.maleLower);
      notes.push(t(
        isHuman ? `pedigree.note.XD.human` : `pedigree.note.XD.other`,
        isHuman
          ? `En herencia dominante ligada al X, un padre afectado transmite su X afectado a todas sus hijas y su Y a todos sus hijos.`
          : `En herencia dominante ligada al X, un progenitor macho afectado transmite su X afectado a toda su descendencia hembra y su Y a toda su descendencia macho.`
      ));
    }
  }

  return { genotypes, genotypeLabels, notes };
}

function renderBuilderGenotypeTable(solution) {
  const tbody = document.getElementById('builderGenotypeTableBody');
  const note = document.getElementById('builderGenotypeNote');
  tbody.innerHTML = '';

  const individuals = Array.from(builderEngine.individuals.values()).sort((a, b) => a.id - b.id);
  if (individuals.length === 0 || Object.keys(solution.genotypes).length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">${t('pedigree.feedback.noGenotypes', 'Sin genotipos para mostrar.')}</td></tr>`;
    note.innerHTML = formatGenotypeHTML(solution.notes.join(' '));
    return;
  }

  const labels = getBuilderSexLabels();
  for (const ind of individuals) {
    const sexLabelText = sexLabel(ind.sex, labels);
    const statusLabel = genderedStatusLabel(solution.genotypeLabels[ind.id] || (ind.affected ? t('pedigree.status.affectedNeutral', 'Afectado/a') : t('pedigree.status.unaffectedNeutral', 'No afectado/a')), ind.sex);
    tbody.innerHTML += `<tr>
      <td><strong>${ind.label}</strong> (${sexLabelText})</td>
      <td><code>${formatGenotypeHTML(solution.genotypes[ind.id] || '—')}</code></td>
      <td>${statusLabel}</td>
    </tr>`;
  }
  note.innerHTML = formatGenotypeHTML(solution.notes.join(' '));
}

function analyzeBuilderTree() {
  const pattern = builderEngine.analyzePattern();
  const info    = builderEngine.getPatternInfo(pattern);
  const alleles = getBuilderAlleles();
  const meta = getBuilderMetadata();
  const solution = inferBuilderGenotypes(pattern, alleles);

  builderEngine.hideSolution();
  if (Object.keys(solution.genotypes).length > 0) {
    builderEngine.showSolution(solution);
  }

  const result  = document.getElementById('builderAnalysisResult');
  result.classList.add('visible');
  document.getElementById('builderPatternDisplay').innerHTML =
    `<div class="pattern-result ${info.class || 'alert alert-info'}">
      🔍 ${t('pedigree.analysis.mostLikelyPattern', 'Patrón más probable')}: <strong>${info.name}</strong>
    </div>`;
  const expectedNote = meta.expectedPattern
    ? `<div style="margin-top:0.5rem;"><strong>${t('pedigree.analysis.expectedTeacherPattern', 'Patrón esperado por el profesor')}:</strong> ${RANDOM_PATTERN_NAMES[meta.expectedPattern] || meta.expectedPattern}${meta.expectedPattern !== pattern ? ` <span style="color:#b45309;">(${t('pedigree.analysis.reviewTree', 'revisa si el árbol lo justifica de forma inequívoca')})</span>` : ''}</div>`
    : '';
  document.getElementById('builderPatternDesc').innerHTML =
    formatGenotypeHTML(info.description) + builderAlleleSummaryHTML(alleles) + expectedNote;
  renderBuilderGenotypeTable(solution);
}

function clearBuilderTree() {
  builderEngine.clear();
  builderEngine._updateInfo();
  resetBuilderAnalysisPanel();
  resetBuilderMetadata();
  setBuilderSource(null);
  setBuilderStatus('');
  if (location.hash.startsWith('#caso=')) history.replaceState(null, '', location.pathname);
}

function loadBuilderExample() {
  copyExerciseToBuilder(EXERCISES[0]);
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', initEngines);
