// ══════════════════════════════════════════════════════
// EXERCISE DATA
// ══════════════════════════════════════════════════════
const PEDIGREE_CONTENT = window.PEDIGREE_CONTENT || { exercises: {}, randomTraits: {}, randomTemplates: {} };

const RANDOM_PATTERN_NAMES = {
  AR: t('pedigree.pattern.AR', 'Autosómica Recesiva'),
  AD: t('pedigree.pattern.AD', 'Autosómica Dominante'),
  XR: t('pedigree.pattern.XR', 'Recesiva ligada al cromosoma X'),
  XD: t('pedigree.pattern.XD', 'Dominante ligada al cromosoma X')
};

function formatPedigreeContent(template, params = {}) {
  return String(template || '').replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match
  ));
}

function formatPedigreeContentList(items = [], params = {}) {
  return items.map(item => formatPedigreeContent(item, params));
}

function withExerciseContent(exercise) {
  const content = PEDIGREE_CONTENT.exercises?.[exercise.id] || {};
  return {
    ...exercise,
    title: content.title || exercise.title,
    description: content.description || exercise.description,
    question: content.question || exercise.question,
    answer: {
      ...exercise.answer,
      patternName: RANDOM_PATTERN_NAMES[exercise.answer.pattern] || content.patternName || exercise.answer.patternName,
      clues: content.clues || exercise.answer.clues || [],
      genotypeLabels: content.genotypeLabels || exercise.answer.genotypeLabels || {},
    }
  };
}

const EXERCISES = [
  {
    id: 1,
    individuals: [
      {id:1,  sex:'M', affected:false, x:220, y:70,  label:'I-1'},
      {id:2,  sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3,  sex:'M', affected:false, x:90,  y:200, label:'II-1'},
      {id:4,  sex:'F', affected:false, x:190, y:200, label:'II-2'},
      {id:5,  sex:'F', affected:true,  x:390, y:200, label:'II-3'},
      {id:6,  sex:'M', affected:false, x:290, y:200, label:'II-4'},
      {id:7,  sex:'M', affected:false, x:520, y:200, label:'II-5'},
      {id:8,  sex:'M', affected:false, x:410, y:330, label:'III-1'},
      {id:9,  sex:'M', affected:true,  x:510, y:330, label:'III-2'},
      {id:10, sex:'F', affected:false, x:610, y:330, label:'III-3'},
    ],
    couples: [
      {id:'c1', p1:1,  p2:2,  children:[3,4,5,6]},
      {id:'c2', p1:5,  p2:7,  children:[8,9,10]},
    ],
    answer: {
      pattern: 'AR',
      genotypes: {1:'Aa',2:'Aa',3:'AA o Aa',4:'AA o Aa',5:'aa',6:'AA o Aa',7:'Aa',8:'AA o Aa',9:'aa',10:'AA o Aa'},
    }
  },
  {
    id: 2,
    individuals: [
      {id:1, sex:'M', affected:true,  x:220, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'F', affected:true,  x:110, y:200, label:'II-1'},
      {id:4, sex:'M', affected:false, x:210, y:200, label:'II-2'},
      {id:5, sex:'F', affected:true,  x:310, y:200, label:'II-3'},
      {id:6, sex:'M', affected:false, x:410, y:200, label:'II-4'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]},
    ],
    answer: {
      pattern: 'AD',
      genotypes: {1:'Aa', 2:'aa', 3:'Aa', 4:'aa', 5:'Aa', 6:'aa'},
    }
  },
  {
    id: 3,
    individuals: [
      {id:1, sex:'M', affected:false, x:200, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:320, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false, x:90,  y:200, label:'II-1'},
      {id:4, sex:'M', affected:true,  x:190, y:200, label:'II-2'},
      {id:5, sex:'F', affected:false, x:290, y:200, label:'II-3'},
      {id:6, sex:'F', affected:false, x:390, y:200, label:'II-4'},
      {id:7, sex:'M', affected:false, x:470, y:200, label:'II-5'},
      {id:8, sex:'M', affected:true,  x:420, y:330, label:'III-1'},
      {id:9, sex:'F', affected:false, x:520, y:330, label:'III-2'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]},
      {id:'c2', p1:7, p2:6, children:[8,9]},
    ],
    answer: {
      pattern: 'XR',
      genotypes: {
        1:'X^H Y',
        2:'X^H X^h (portadora)',
        3:'X^H Y',
        4:'X^h Y',
        5:'X^H X^H o X^H X^h',
        6:'X^H X^h (portadora)',
        7:'X^H Y',
        8:'X^h Y',
        9:'X^H X^H o X^H X^h',
      },
    }
  },
  {
    id: 4,
    individuals: [
      {id:1,  sex:'M', affected:false, x:150, y:60,  label:'I-1'},
      {id:2,  sex:'F', affected:false, x:270, y:60,  label:'I-2'},
      {id:3,  sex:'M', affected:false, x:420, y:60,  label:'I-3'},
      {id:4,  sex:'F', affected:false, x:540, y:60,  label:'I-4'},
      {id:5,  sex:'M', affected:true,  x:100, y:190, label:'II-1'},
      {id:6,  sex:'F', affected:false, x:200, y:190, label:'II-2'},
      {id:7,  sex:'M', affected:false, x:310, y:190, label:'II-3'},
      {id:8,  sex:'F', affected:false, x:430, y:190, label:'II-4'},
      {id:9,  sex:'F', affected:true,  x:530, y:190, label:'II-5'},
      {id:10, sex:'M', affected:false, x:260, y:190, label:'II-6'},
      {id:11, sex:'F', affected:false, x:200, y:330, label:'III-1'},
      {id:12, sex:'M', affected:false, x:300, y:330, label:'III-2'},
      {id:13, sex:'F', affected:true,  x:400, y:330, label:'III-3'},
    ],
    couples: [
      {id:'c1', p1:1,  p2:2,  children:[5,6,7]},
      {id:'c2', p1:3,  p2:4,  children:[8,9]},
      {id:'c3', p1:10, p2:6,  children:[11,12,13]},
    ],
    answer: {
      pattern: 'AR',
      genotypes: {1:'Aa',2:'Aa',3:'Aa',4:'Aa',5:'aa',6:'Aa',7:'AA o Aa',8:'AA o Aa',9:'aa',10:'Aa',11:'AA o Aa',12:'AA o Aa',13:'aa'},
    }
  },
  {
    id: 5,
    individuals: [
      {id:1, sex:'M', affected:true,  x:240, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:360, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false, x:100, y:200, label:'II-1'},
      {id:4, sex:'F', affected:true,  x:200, y:200, label:'II-2'},
      {id:5, sex:'M', affected:false, x:300, y:200, label:'II-3'},
      {id:6, sex:'F', affected:true,  x:400, y:200, label:'II-4'},
      {id:7, sex:'M', affected:false, x:500, y:200, label:'II-5'},
    ],
    couples: [{id:'c1', p1:1, p2:2, children:[3,4,5,6,7]}],
    answer: {
      pattern: 'XD',
      genotypes: {1:'X^A Y', 2:'X^a X^a', 3:'X^a Y', 4:'X^A X^a', 5:'X^a Y', 6:'X^A X^a', 7:'X^a Y'},
    }
  },
  {
    id: 6,
    individuals: [
      {id:1,  sex:'M', affected:false, x:180, y:60,  label:'I-1'},
      {id:2,  sex:'F', affected:false, x:300, y:60,  label:'I-2'},
      {id:3,  sex:'M', affected:false, x:420, y:60,  label:'I-3'},
      {id:4,  sex:'F', affected:false, x:540, y:60,  label:'I-4'},
      {id:5,  sex:'M', affected:true,  x:120, y:190, label:'II-1'},
      {id:6,  sex:'F', affected:false, x:220, y:190, label:'II-2'},
      {id:7,  sex:'M', affected:false, x:340, y:190, label:'II-3'},
      {id:8,  sex:'F', affected:false, x:470, y:190, label:'II-4'},
      {id:9,  sex:'M', affected:false, x:560, y:190, label:'II-5'},
      {id:10, sex:'F', affected:true,  x:410, y:330, label:'III-1'},
      {id:11, sex:'M', affected:false, x:510, y:330, label:'III-2'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2,  children:[5,6,7]},
      {id:'c2', p1:3, p2:4,  children:[8,9]},
      {id:'c3', p1:7, p2:8,  children:[10,11]},
    ],
    answer: {
      pattern: 'AR',
      genotypes: {1:'Aa',2:'Aa',3:'Aa',4:'Aa',5:'aa',6:'AA o Aa',7:'Aa',8:'Aa',9:'AA o Aa',10:'aa',11:'AA o Aa'},
      probability: '25% (1/4)',
    }
  },

  // ── Ejercicios con organismos no humanos ─────────────────

  {
    id: 7,
    organismType: 'other',
    individuals: [
      {id:1, sex:'F', affected:false, x:220, y:70,  label:'I-1'},
      {id:2, sex:'M', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'F', affected:false, x:110, y:200, label:'II-1'},
      {id:4, sex:'M', affected:true,  x:210, y:200, label:'II-2'},
      {id:5, sex:'F', affected:false, x:310, y:200, label:'II-3'},
      {id:6, sex:'M', affected:false, x:410, y:200, label:'II-4'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]},
    ],
    answer: {
      pattern: 'XR',
      genotypes: {1:'X^W X^w', 2:'X^W Y', 3:'X^W X^W o X^W X^w', 4:'X^w Y', 5:'X^W X^W o X^W X^w', 6:'X^W Y'},
    }
  },

  {
    id: 8,
    organismType: 'other',
    individuals: [
      {id:1,  sex:'M', affected:false, x:220, y:70,  label:'I-1'},
      {id:2,  sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3,  sex:'M', affected:false, x:100, y:200, label:'II-1'},
      {id:4,  sex:'F', affected:true,  x:200, y:200, label:'II-2'},
      {id:5,  sex:'M', affected:true,  x:300, y:200, label:'II-3'},
      {id:6,  sex:'F', affected:false, x:400, y:200, label:'II-4'},
      {id:7,  sex:'M', affected:false, x:500, y:200, label:'II-5'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6,7]},
    ],
    answer: {
      pattern: 'AR',
      genotypes: {1:'Bb', 2:'Bb', 3:'BB o Bb', 4:'bb', 5:'bb', 6:'BB o Bb', 7:'BB o Bb'},
    }
  },

  {
    id: 9,
    organismType: 'other',
    individuals: [
      {id:1, sex:'M', affected:false, x:220, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false, x:110, y:200, label:'II-1'},
      {id:4, sex:'F', affected:true,  x:210, y:200, label:'II-2'},
      {id:5, sex:'M', affected:false, x:310, y:200, label:'II-3'},
      {id:6, sex:'F', affected:false, x:410, y:200, label:'II-4'},
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]},
    ],
    answer: {
      pattern: 'AD',
      genotypes: {1:'Pp', 2:'Pp', 3:'PP o Pp', 4:'pp', 5:'PP o Pp', 6:'PP o Pp'},
    }
  },

  {
    id: 10,
    organismType: 'other',
    individuals: [
      {id:1, sex:'F', affected:false, x:220, y:70,  label:'I-1'},
      {id:2, sex:'M', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'F', affected:false, x:110, y:200, label:'II-1'},
      {id:4, sex:'M', affected:false, x:210, y:200, label:'II-2'},
      {id:5, sex:'F', affected:true,  x:310, y:200, label:'II-3'},
      {id:6, sex:'M', affected:true,  x:410, y:200, label:'II-4'},
    ],
    couples: [
      {id:'c1', p1:2, p2:1, children:[3,4,5,6]},
    ],
    answer: {
      pattern: 'XD',
      genotypes: {1:'X^N X^n', 2:'X^n Y', 3:'X^n X^n', 4:'X^n Y', 5:'X^N X^n', 6:'X^N Y'},
    }
  },
].map(withExerciseContent);

const RANDOM_PEDIGREE_TRAITS = PEDIGREE_CONTENT.randomTraits || {};

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomExerciseId(pattern) {
  return 9000 + ['AR','AD','XR','XD'].indexOf(pattern) * 100 + Math.floor(Math.random() * 100);
}

function createRandomPedigreeExercise() {
  const pattern = randomChoice(['AR', 'AD', 'XR', 'XD']);
  const trait = randomChoice(RANDOM_PEDIGREE_TRAITS[pattern]);
  const builders = {
    AR: buildRandomARExercise,
    AD: buildRandomADExercise,
    XR: buildRandomXRExercise,
    XD: buildRandomXDExercise
  };
  return builders[pattern](trait);
}

function randomExerciseTitle(trait) {
  return formatPedigreeContent(PEDIGREE_CONTENT.randomTemplates?.title || 'Caso aleatorio: {name}', trait);
}

function randomTemplate(pattern) {
  return PEDIGREE_CONTENT.randomTemplates?.[pattern] || {};
}

function randomTemplateText(pattern, key, params) {
  return formatPedigreeContent(randomTemplate(pattern)[key], params);
}

function randomTemplateList(pattern, key, params) {
  return formatPedigreeContentList(randomTemplate(pattern)[key] || [], params);
}

function buildRandomARExercise(trait) {
  const textParams = { ...trait };
  return {
    id: randomExerciseId('AR'),
    organismType: trait.organism || 'human',
    title: randomExerciseTitle(trait),
    description: randomTemplateText('AR', 'description', textParams),
    question: randomTemplateText('AR', 'question', textParams),
    individuals: [
      {id:1, sex:'M', affected:false, x:220, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false, x:110, y:200, label:'II-1'},
      {id:4, sex:'F', affected:true,  x:220, y:200, label:'II-2'},
      {id:5, sex:'M', affected:false, x:330, y:200, label:'II-3'},
      {id:6, sex:'F', affected:false, x:440, y:200, label:'II-4'}
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]}
    ],
    answer: {
      pattern: 'AR',
      patternName: RANDOM_PATTERN_NAMES.AR,
      clues: randomTemplateList('AR', 'clues', textParams),
      genotypes: {1:'Aa', 2:'Aa', 3:'AA o Aa', 4:'aa', 5:'AA o Aa', 6:'AA o Aa'},
      genotypeLabels: randomTemplate('AR').genotypeLabels || {}
    }
  };
}

function buildRandomADExercise(trait) {
  const textParams = { ...trait };
  return {
    id: randomExerciseId('AD'),
    organismType: trait.organism || 'human',
    title: randomExerciseTitle(trait),
    description: randomTemplateText('AD', 'description', textParams),
    question: randomTemplateText('AD', 'question', textParams),
    individuals: [
      {id:1, sex:'M', affected:true,  x:220, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:340, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:true,  x:100, y:200, label:'II-1'},
      {id:4, sex:'F', affected:false, x:210, y:200, label:'II-2'},
      {id:5, sex:'F', affected:true,  x:320, y:200, label:'II-3'},
      {id:6, sex:'M', affected:false, x:430, y:200, label:'II-4'}
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]}
    ],
    answer: {
      pattern: 'AD',
      patternName: RANDOM_PATTERN_NAMES.AD,
      clues: randomTemplateList('AD', 'clues', textParams),
      genotypes: {1:'Aa', 2:'aa', 3:'Aa', 4:'aa', 5:'Aa', 6:'aa'},
      genotypeLabels: randomTemplate('AD').genotypeLabels || {}
    }
  };
}

function buildRandomXRExercise(trait) {
  const A = trait.dom;
  const a = trait.rec;
  const textParams = { ...trait, A, a };
  return {
    id: randomExerciseId('XR'),
    organismType: trait.organism || 'human',
    title: randomExerciseTitle(trait),
    description: randomTemplateText('XR', 'description', textParams),
    question: randomTemplateText('XR', 'question', textParams),
    individuals: [
      {id:1, sex:'M', affected:true,  x:180, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false, x:300, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false, x:80,  y:200, label:'II-1'},
      {id:4, sex:'F', affected:false, x:190, y:200, label:'II-2'},
      {id:5, sex:'M', affected:false, x:300, y:200, label:'II-3'},
      {id:6, sex:'F', affected:false, x:410, y:200, label:'II-4'},
      {id:7, sex:'M', affected:false, x:560, y:200, label:'II-5'},
      {id:8, sex:'M', affected:true,  x:430, y:330, label:'III-1'},
      {id:9, sex:'F', affected:false, x:530, y:330, label:'III-2'}
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6]},
      {id:'c2', p1:6, p2:7, children:[8,9]}
    ],
    answer: {
      pattern: 'XR',
      patternName: RANDOM_PATTERN_NAMES.XR,
      clues: randomTemplateList('XR', 'clues', textParams),
      genotypes: {
        1:`X^${a} Y`,
        2:`X^${A} X^${A}`,
        3:`X^${A} Y`,
        4:`X^${A} X^${a}`,
        5:`X^${A} Y`,
        6:`X^${A} X^${a}`,
        7:`X^${A} Y`,
        8:`X^${a} Y`,
        9:`X^${A} X^${A} o X^${A} X^${a}`
      },
      genotypeLabels: randomTemplate('XR').genotypeLabels || {}
    }
  };
}

function buildRandomXDExercise(trait) {
  const A = trait.dom;
  const a = trait.rec;
  const codo = trait.codominant || false;
  const femAffected = !codo;
  const templateGroup = randomTemplate('XD');
  const variant = codo ? templateGroup.codominant || {} : templateGroup.dominant || {};
  const textParams = { ...trait, A, a };
  const femLabel = codo
    ? templateGroup.codominantFemaleLabel || 'Portadora'
    : templateGroup.dominantFemaleLabel || 'Afectada';
  return {
    id: randomExerciseId('XD'),
    organismType: trait.organism || 'human',
    title: randomExerciseTitle(trait),
    description: formatPedigreeContent(variant.description, textParams),
    question: formatPedigreeContent(variant.question, textParams),
    individuals: [
      {id:1, sex:'M', affected:true,        x:240, y:70,  label:'I-1'},
      {id:2, sex:'F', affected:false,        x:360, y:70,  label:'I-2'},
      {id:3, sex:'M', affected:false,        x:100, y:200, label:'II-1'},
      {id:4, sex:'F', affected:femAffected, carrier:codo, x:200, y:200, label:'II-2'},
      {id:5, sex:'M', affected:false,                    x:300, y:200, label:'II-3'},
      {id:6, sex:'F', affected:femAffected, carrier:codo, x:400, y:200, label:'II-4'},
      {id:7, sex:'M', affected:false,        x:500, y:200, label:'II-5'}
    ],
    couples: [
      {id:'c1', p1:1, p2:2, children:[3,4,5,6,7]}
    ],
    answer: {
      pattern: 'XD',
      patternName: RANDOM_PATTERN_NAMES.XD,
      clues: formatPedigreeContentList(variant.clues || [], textParams),
      genotypes: {
        1:`X^${A} Y`,
        2:`X^${a} X^${a}`,
        3:`X^${a} Y`,
        4:`X^${A} X^${a}`,
        5:`X^${a} Y`,
        6:`X^${A} X^${a}`,
        7:`X^${a} Y`
      },
      genotypeLabels: {1:t('pedigree.status.affectedMale', 'Afectado'), 4:femLabel, 6:femLabel}
    }
  };
}
