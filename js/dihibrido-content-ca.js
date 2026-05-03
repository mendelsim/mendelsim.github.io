if (window.MendelSimI18n?.getLocale() === 'ca') {
  window.DIHYBRID_CONTENT = {
    presets: {
      clasico:   { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Groc', tr:'Verd', tb:'Llis', tbr:'Rugós', description:'Encreuament dihíbrid clàssic amb dos gens independents i doble heterozigosi en tots dos progenitors.' },
      testcross: { p1A:'Aa', p1B:'Bb', p2A:'aa', p2B:'bb', ta:'Groc', tr:'Verd', tb:'Llis', tbr:'Rugós', description:'Encreuament de prova: el doble heterozigot es creua amb un doble homozigot recessiu.' },
      guisantes: { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Llavor groga', tr:'Llavor verda', tb:'Forma llisa', tbr:'Forma rugosa', description:'Cas mendelià clàssic amb color i forma de la llavor de pèsol.' },
      AAbb:      { p1A:'AA', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Groc', tr:'Verd', tb:'Llis', tbr:'Rugós', description:'Encreuament amb homozigosi dominant en el primer gen i segregació en el segon.' },
    },
    randomTraitPairs: [
      { context: 'pèsols', ta: 'Llavor groga', tr: 'Llavor verda', tb: 'Llavor llisa', tbr: 'Llavor rugosa', description: 'Dos caràcters mendelians clàssics del pèsol, tractats com a gens independents.' },
      { context: 'Drosophila', ta: 'Cos gris', tr: 'Cos negre', tb: 'Ales normals', tbr: 'Ales vestigials', description: 'Dos trets autosòmics de Drosophila utilitzats habitualment com a model escolar de segregació independent.' },
      { context: 'blat de moro', ta: 'Gra pigmentat', tr: 'Gra sense pigment', tb: 'Gra llis', tbr: 'Gra rugós', description: 'Trets del gra de blat de moro modelitzats com dos loci amb dominància completa.' },
      { context: 'tomàquet', ta: 'Tija alta', tr: 'Tija nana', tb: 'Fruit vermell', tbr: 'Fruit groc', description: 'Exemple didàctic de dos caràcters vegetals independents amb dominància completa.' }
    ],
    randomCrosses: [
      { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', label:'AaBb × AaBb' },
      { p1A:'Aa', p1B:'Bb', p2A:'aa', p2B:'bb', label:'AaBb × aabb' },
      { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'bb', label:'AaBb × Aabb' },
      { p1A:'Aa', p1B:'bb', p2A:'Aa', p2B:'Bb', label:'Aabb × AaBb' },
      { p1A:'AA', p1B:'Bb', p2A:'Aa', p2B:'Bb', label:'AABb × AaBb' },
      { p1A:'Aa', p1B:'BB', p2A:'Aa', p2B:'Bb', label:'AaBB × AaBb' },
      { p1A:'aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', label:'aaBb × AaBb' }
    ],
    messages: {
      generatedExample: 'Exemple generat ({context}): {description} Encreuament: {cross}.'
    },
    ui: {
      pageTitle: 'Encreuament dihíbrid — MendelSim',
      back: '← Inici',
      heading: 'Encreuament dihíbrid',
      subtitle: 'Herència de dos caràcters independents — Quadre de Punnett 4×4',
      lawTitle: '📜 Llei de la distribució independent (3a llei de Mendel)',
      lawText: 'Els al·lels de gens situats en cromosomes diferents es distribueixen de manera independent durant la formació de gàmetes. Això produeix 4 tipus de gàmetes en proporcions iguals (per a un doble heterozigot AaBb: AB, Ab, aB, ab).',
      configTitle: 'Configuració de l’encreuament dihíbrid',
      presetClassic: '🟡 Clàssic AaBb × AaBb',
      presetTestcross: '🔬 Encreuament de prova (AaBb × aabb)',
      presetPeas: '🌱 Pèsols (color × forma)',
      randomExample: '🎲 Nou exemple',
      p1: 'Genotip progenitor P1',
      p2: 'Genotip progenitor P2',
      traitNames: 'Noms dels trets (dominància completa en tots dos gens):',
      traitADom: 'Caràcter A dominant (A_)',
      traitARec: 'Caràcter A recessiu (aa)',
      traitBDom: 'Caràcter B dominant (B_)',
      traitBRec: 'Caràcter B recessiu (bb)',
      run: '▶ Fer l’encreuament',
      clear: '↺ Netejar',
      punnettTitle: 'Quadre de Punnett 4×4 (16 combinacions)',
      resultsTitle: 'Resultats',
      genoRatios: '📊 Proporcions genotípiques',
      phenoRatios: '🎨 Proporcions fenotípiques',
      mendel9331: '<strong>Proporció 9:3:3:1 de Mendel!</strong> Aquest resultat clàssic confirma que els dos gens s’hereten de manera independent (cromosomes diferents).',
      understandingTitle: 'Comprensió i autoavaluació',
      reviewQuestions: '❓ Preguntes de repàs',
      phenotypes: 'Fenotips:',
      explanationStart: 'L’encreuament <strong>{p1} × {p2}</strong> produeix {count} fenotips diferents. ',
      explanation9331: 'La proporció 9:3:3:1 és la signatura clàssica de l’encreuament dihíbrid de Mendel i confirma que els dos gens són en cromosomes diferents (s’hereten de manera independent).',
      explanationOther: 'Com que almenys un dels progenitors és homozigot per a algun gen, les proporcions difereixen de la 9:3:3:1 clàssica.',
      q9331: 'Per què l’encreuament AaBb × AaBb produeix la proporció 9:3:3:1?',
      a9331: 'Perquè cada gen s’hereta de manera independent. El doble heterozigot AaBb produeix 4 tipus de gàmetes (AB, Ab, aB, ab) en proporcions iguals. En creuar 4 × 4 gàmetes obtenim 16 combinacions: 9 A_B_, 3 A_bb, 3 aaB_ i 1 aabb.',
      qTestcross: 'Què és un encreuament de prova?',
      aTestcross: 'És l’encreuament d’un individu de genotip desconegut amb un individu homozigot recessiu (aabb). Les proporcions de descendents revelen el genotip del progenitor desconegut.',
      qLinked: 'Què passa si els dos gens són en el mateix cromosoma?',
      aLinked: 'Si els gens estan lligats, no es distribueixen de manera independent i no s’obté la proporció 9:3:3:1. Les combinacions parentals són més freqüents que les recombinants.',
      showAnswer: '▼ Veure resposta',
      hideAnswer: '▲ Amagar',
    }
  };
}
