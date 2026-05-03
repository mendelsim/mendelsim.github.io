// ══════════════════════════════════════════════════════
// EXERCISE DATA
// ══════════════════════════════════════════════════════
const EXERCISES = [
  {
    id: 1,
    title: "Ejercicio 1: Fibrosis Quística",
    description: "Dos progenitores sanos tienen descendencia afectada. Analiza el árbol y determina el patrón de herencia.",
    question: "¿Qué patrón de herencia sigue este rasgo? ¿Cuáles son los genotipos de los progenitores?",
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
      patternName: 'Autosómica Recesiva',
      clues: [
        'Los progenitores I-1 e I-2 no están afectados, pero tienen una hija afectada (II-3) → el alelo causante es RECESIVO (si fuera dominante, al menos uno de los padres estaría afectado).',
        'El rasgo aparece en individuos de ambos sexos (II-3 mujer, III-2 hombre) → el gen está en un autosoma, NO en el cromosoma X (herencia autosómica).',
        'Los progenitores sanos con hijos afectados son portadores heterocigotos (Aa × Aa → 1/4 posibilidad de hijo afectado aa).',
        'II-5 (no afectado) se unió a II-3 (afectada, genotipo aa) y tienen un hijo afectado (III-2) → II-5 también debe ser portador (Aa).',
      ],
      genotypes: {1:'Aa',2:'Aa',3:'AA o Aa',4:'AA o Aa',5:'aa',6:'AA o Aa',7:'Aa',8:'AA o Aa',9:'aa',10:'AA o Aa'},
      genotypeLabels: {1:'Portador',2:'Portadora',5:'Afectada',7:'Portador',9:'Afectado'},
    }
  },
  {
    id: 2,
    title: "Ejercicio 2: Polidactilia",
    description: "Un progenitor afectado transmite el rasgo a parte de su descendencia.",
    question: "¿El rasgo es dominante o recesivo? ¿Qué genotipo tiene el progenitor afectado (I-1)?",
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
      patternName: 'Autosómica Dominante',
      clues: [
        'El rasgo aparece directamente en I-1 y se transmite a sus hijos. Un progenitor afectado tiene hijos afectados → el alelo causante es DOMINANTE.',
        'El progenitor I-1 afectado tiene dos hijos no afectados (II-2 e II-4) → I-1 debe ser heterocigoto (Aa), no homocigoto (AA). Si fuera AA, todos los hijos serían afectados.',
        'El rasgo afecta tanto a mujeres (II-1, II-3) como a hombres (I-1) y hay hijos de ambos sexos no afectados → herencia autosómica (no ligada al X).',
        'La proporción observada (2 afectados de 4 hijos) es consistente con el cruce Aa × aa → 50% afectados esperado.',
      ],
      genotypes: {1:'Aa', 2:'aa', 3:'Aa', 4:'aa', 5:'Aa', 6:'aa'},
    }
  },
  {
    id: 3,
    title: "Ejercicio 3: Hemofilia A",
    description: "Un rasgo que afecta principalmente a los hombres. La madre portadora transmite el alelo patológico.",
    question: "¿Qué tipo de herencia sigue la hemofilia? ¿Cuál es el genotipo de la madre I-2? ¿Y de la hija II-4?",
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
      patternName: 'Recesiva ligada al cromosoma X',
      clues: [
        'Solo los hombres aparecen afectados en este árbol (II-2 y III-1) → posible herencia ligada al X (los hombres son hemicigotos).',
        'La madre I-2 no está afectada, pero tiene un hijo afectado (II-2) → I-2 debe ser portadora (X^H X^h), ya que el padre I-1 es normal.',
        'La hija II-4 tiene un hijo afectado (III-1) sin estar ella afectada → II-4 también es portadora (X^H X^h). Heredó el alelo X^h de su madre I-2.',
        'El patrón típico: madres portadoras → hijos hombres afectados (50% de probabilidad); nietas que también pueden ser portadoras.',
      ],
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
      genotypeLabels: {2:'Portadora', 4:'Afectado', 6:'Portadora', 8:'Afectado'},
    }
  },
  {
    id: 4,
    title: "Ejercicio 4: Albinismo (3 generaciones)",
    description: "Árbol de 3 generaciones con patrón recesivo. Hay individuos afectados en la generación II y III.",
    question: "Determina el patrón de herencia y los genotipos de todos los individuos. ¿Cuál es el genotipo de II-6?",
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
      patternName: 'Autosómica Recesiva',
      clues: [
        'Los padres I-1 e I-2 están sanos pero tienen hijos afectados (II-1, hombre afectado) → rasgo RECESIVO.',
        'El rasgo afecta tanto a hombres (II-1) como a mujeres (II-5, III-3) → gen en autosoma (no ligado al X).',
        'II-2 es hija de padres portadores (Aa × Aa): puede ser AA o Aa. Como tiene una hija afectada (III-3), II-2 DEBE ser Aa (portadora).',
        'II-6 (no afectado) × II-2 (Aa) → tienen una hija afectada (III-3, aa) → II-6 también es portador (Aa).',
        'Los padres I-3 e I-4 también son portadores porque tienen una hija afectada (II-5, aa).',
      ],
      genotypes: {1:'Aa',2:'Aa',3:'Aa',4:'Aa',5:'aa',6:'Aa',7:'AA o Aa',8:'AA o Aa',9:'aa',10:'Aa',11:'AA o Aa',12:'AA o Aa',13:'aa'},
      genotypeLabels: {1:'Portador',2:'Portadora',3:'Portador',4:'Portadora',5:'Afectado',6:'Portadora',9:'Afectada',10:'Portador',13:'Afectada'},
    }
  },
  {
    id: 5,
    title: "Ejercicio 5: Padre afectado y descendencia",
    description: "Un padre afectado y su descendencia. Observa quiénes están afectados: todas las hijas, ningún hijo hombre.",
    question: "Identifica el patrón de herencia y justifica tu respuesta. ¿Por qué ningún hijo hombre está afectado?",
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
      patternName: 'Dominante ligada al cromosoma X',
      clues: [
        'El padre afectado (I-1) transmite el rasgo a TODAS sus hijas (II-2 y II-4 afectadas) pero a NINGÚN hijo hombre (II-1, II-3, II-5 no afectados).',
        'Esto se explica porque el padre pasa su cromosoma X a sus hijas y su Y a sus hijos. Si el X del padre lleva el alelo dominante patológico, todas las hijas lo heredan.',
        'El rasgo es DOMINANTE porque basta con un solo alelo para expresarse (las hijas solo tienen una copia del alelo X^A pero están afectadas).',
        'Este patrón diagnóstico — padre afectado → todas hijas afectadas, ningún hijo — es exclusivo de herencia DOMINANTE LIGADA AL X.',
      ],
      genotypes: {1:'X^A Y', 2:'X^a X^a', 3:'X^a Y', 4:'X^A X^a', 5:'X^a Y', 6:'X^A X^a', 7:'X^a Y'},
    }
  },
  {
    id: 6,
    title: "Ejercicio 6: Caso clínico — Probabilidad",
    description: "Árbol complejo de 3 generaciones con herencia autosómica recesiva. Hay que determinar la probabilidad para la descendencia de una pareja.",
    question: "¿Cuál es la probabilidad de que el próximo hijo de II-3 y II-4 sea afectado? Determina antes sus genotipos.",
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
      patternName: 'Autosómica Recesiva',
      clues: [
        'II-3 tiene un hermano afectado (II-1, genotipo aa) → sus padres I-1 e I-2 son ambos portadores (Aa × Aa).',
        'II-3 no está afectado → es AA o Aa. Como tiene una hija afectada (III-1, aa), II-3 DEBE ser Aa.',
        'III-1 está afectada (aa) → heredó un alelo "a" de cada progenitor. Su madre II-4 también debe ser portadora (Aa). Sus padres I-3 e I-4 también son portadores.',
        'Cruce II-3 (Aa) × II-4 (Aa) → proporción de descendientes: 1 AA : 2 Aa : 1 aa. Probabilidad de afectado = 1/4 = 25%.',
      ],
      genotypes: {1:'Aa',2:'Aa',3:'Aa',4:'Aa',5:'aa',6:'AA o Aa',7:'Aa',8:'Aa',9:'AA o Aa',10:'aa',11:'AA o Aa'},
      genotypeLabels: {1:'Portador',2:'Portadora',3:'Portador',4:'Portadora',5:'Afectado',7:'Portador',8:'Portadora',10:'Afectada'},
      probability: '25% (1/4)',
    }
  },

  // ── Ejercicios con organismos no humanos ─────────────────

  {
    id: 7,
    title: "Ejercicio 7: Drosophila — Ojos blancos (Morgan)",
    organismType: 'other',
    description: "En Drosophila melanogaster, el color de ojo blanco es recesivo y está ligado al cromosoma X. Thomas Morgan observó este patrón en 1910. En este árbol, una hembra de ojos rojos y un macho de ojos rojos tienen descendencia con algunos machos de ojos blancos.",
    question: "¿Por qué solo los machos presentan ojos blancos en este cruce? Deduce los genotipos de los progenitores e identifica el patrón de herencia.",
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
      patternName: 'Recesiva ligada al cromosoma X',
      clues: [
        'Solo los machos presentan ojos blancos → el gen está ligado al cromosoma X. Los machos son hemicigotos (X^w Y): con un solo alelo recesivo expresan el rasgo.',
        'La hembra I-1 tiene ojos rojos pero tiene un hijo con ojos blancos (II-2) → I-1 es portadora heterocigota (X^W X^w).',
        'El macho I-2 tiene ojos rojos → su único X lleva el alelo dominante (X^W Y). Transmite su X a las hijas y su Y a los hijos.',
        'Los hijos varones reciben el X de la madre: 50% X^W (ojos rojos) y 50% X^w (ojos blancos). Las hembras reciben el X^W del padre → nunca afectadas en este cruce.',
      ],
      genotypes: {1:'X^W X^w', 2:'X^W Y', 3:'X^W X^W o X^W X^w', 4:'X^w Y', 5:'X^W X^W o X^W X^w', 6:'X^W Y'},
      genotypeLabels: {1:'Portadora', 4:'Afectado (ojos blancos)'},
    }
  },

  {
    id: 8,
    title: "Ejercicio 8: Labrador Retriever — Color de pelaje",
    organismType: 'other',
    description: "En los perros Labrador Retriever, el pelaje chocolate (marrón) depende de un gen autosómico recesivo (b). Dos labradores negros tienen descendencia chocolate. Analiza el árbol familiar.",
    question: "¿Qué genotipos tienen los progenitores I-1 e I-2? ¿Qué proporción de la descendencia esperarías que fuera chocolate?",
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
      patternName: 'Autosómica Recesiva',
      clues: [
        'Los progenitores I-1 e I-2 tienen pelaje negro (fenotipo dominante) pero tienen descendientes chocolate (bb, fenotipo recesivo) → ambos progenitores son heterocigotos portadores (Bb).',
        'El pelaje chocolate (bb) aparece en machos y hembras → el gen está en un autosoma, no en el cromosoma X.',
        'Cruce Bb × Bb → proporciones esperadas: 1/4 BB (negro), 2/4 Bb (negro portador), 1/4 bb (chocolate). El 25% de la descendencia debería ser chocolate.',
        'En este árbol, 2 de 5 cachorros son chocolate (40%), lo que es coherente con la variabilidad esperada en camadas pequeñas.',
      ],
      genotypes: {1:'Bb', 2:'Bb', 3:'BB o Bb', 4:'bb', 5:'bb', 6:'BB o Bb', 7:'BB o Bb'},
      genotypeLabels: {1:'Negro portador', 2:'Negra portadora', 4:'Chocolate', 5:'Chocolate'},
    }
  },

  {
    id: 9,
    title: "Ejercicio 9: Ganado vacuno — Sin cuernos (Astas)",
    organismType: 'other',
    description: "En el ganado vacuno, la condición 'sin cuernos' (mocho) es autosómica dominante (P) sobre la condición 'con cuernos'. Dos animales mochos heterocigotos se cruzan y producen descendencia con y sin cuernos.",
    question: "¿Qué proporción de la descendencia tendrá cuernos? ¿Cuál es el genotipo de los progenitores? Identifica el patrón de herencia.",
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
      patternName: 'Autosómica Dominante',
      clues: [
        'Los progenitores I-1 e I-2 son mochos (sin cuernos) pero tienen descendencia con cuernos (pp) → el alelo mocho (P) es DOMINANTE y los progenitores son heterocigotos (Pp).',
        'La descendencia con cuernos aparece en ambos sexos → el gen es autosómico.',
        'Cruce Pp × Pp → 1/4 PP (mocho), 2/4 Pp (mocho), 1/4 pp (con cuernos). El 75% de la descendencia esperada es mocha y el 25% tiene cuernos.',
        'Los animales mochos pueden ser PP o Pp; solo los pp (homocigotos recesivos) desarrollan cuernos.',
      ],
      genotypes: {1:'Pp', 2:'Pp', 3:'PP o Pp', 4:'pp', 5:'PP o Pp', 6:'PP o Pp'},
      genotypeLabels: {1:'Mocho (Pp)', 2:'Mocha (Pp)', 4:'Con cuernos'},
    }
  },

  {
    id: 10,
    title: "Ejercicio 10: Gato doméstico — Pelaje naranja (ligado al X)",
    organismType: 'other',
    description: "En el gato doméstico, el color naranja está codificado por un gen ligado al cromosoma X. El alelo X^N produce pelaje naranja y es epistático sobre el negro. Las hembras pueden ser calico (naranja y negro) si son heterocigotas X^N X^n. Analiza este árbol donde una gata calico se cruza con un gato negro.",
    question: "¿Por qué no existen gatos machos calico en condiciones normales? ¿Qué fenotipos esperas en la descendencia de este cruce?",
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
      patternName: 'Dominante ligada al cromosoma X',
      clues: [
        'La gata I-1 es calico (X^N X^n: portadora de ambos alelos). El gato I-2 es negro (X^n Y: solo tiene el alelo no-naranja).',
        'Los machos solo tienen un cromosoma X: son naranjas (X^N Y) o negros/no-naranjas (X^n Y). No pueden ser calico porque necesitan dos alelos X diferentes, por eso los gatos calico machos son extremadamente raros (solo en casos de XXY).',
        'Del cruce X^N X^n × X^n Y: hembras X^N X^n (calico) o X^n X^n (negra/no-naranja); machos X^N Y (naranja) o X^n Y (negro).',
        'En el árbol: II-1 (negra, X^n X^n), II-2 (negro, X^n Y), II-3 (calico, X^N X^n), II-4 (naranja, X^N Y).',
      ],
      genotypes: {1:'X^N X^n', 2:'X^n Y', 3:'X^n X^n', 4:'X^n Y', 5:'X^N X^n', 6:'X^N Y'},
      genotypeLabels: {1:'Calico (portadora)', 2:'Negro', 3:'Negra', 4:'Negro', 5:'Calico', 6:'Naranja'},
    }
  },
];

const RANDOM_PEDIGREE_TRAITS = {
  AR: [
    { name:'Albinismo', affected:'albinismo' },
    { name:'Fibrosis quística', affected:'fibrosis quística' },
    { name:'Fenilcetonuria', affected:'fenilcetonuria' },
    { name:'Anemia falciforme', affected:'anemia falciforme' },
    { name:'Pelaje chocolate en perros', affected:'pelaje chocolate', organism:'other' },
    { name:'Sordera congénita en dálmatas', affected:'sordera congénita', organism:'other' },
    { name:'Pelaje no-agouti en ratones', affected:'pelaje no-agouti', organism:'other' },
    { name:'Plumaje recesivo en gallinas', affected:'plumaje recesivo', organism:'other' },
  ],
  AD: [
    { name:'Polidactilia', affected:'polidactilia' },
    { name:'Braquidactilia', affected:'braquidactilia' },
    { name:'Enfermedad de Huntington', affected:'enfermedad de Huntington' },
    { name:'Hipercolesterolemia familiar', affected:'hipercolesterolemia familiar' },
    { name:'Sin cuernos (mocho) en vacuno', affected:'condición con cuernos', organism:'other' },
    { name:'Cresta de rosa en gallinas', affected:'cresta simple', organism:'other' },
    { name:'Pelaje ondulado en conejos', affected:'pelaje liso recesivo', organism:'other' },
  ],
  XR: [
    { name:'Hemofilia A', affected:'hemofilia A', dom:'H', rec:'h' },
    { name:'Daltonismo rojo-verde', affected:'daltonismo rojo-verde', dom:'C', rec:'c' },
    { name:'Distrofia Muscular Duchenne', affected:'distrofia muscular de Duchenne', dom:'D', rec:'d' },
    { name:'Deficiencia de G6PD', affected:'deficiencia de G6PD', dom:'G', rec:'g' },
    { name:'Ojos blancos en Drosophila', affected:'ojos blancos', dom:'W', rec:'w', organism:'other' },
    { name:'Hemofilia en perros', affected:'hemofilia', dom:'H', rec:'h', organism:'other' },
  ],
  XD: [
    { name:'Raquitismo hipofosfatémico ligado al X', affected:'raquitismo hipofosfatémico', dom:'R', rec:'r' },
    { name:'Incontinencia pigmentaria', affected:'incontinencia pigmentaria', dom:'I', rec:'i' },
    { name:'Pelaje naranja en gatos', affected:'pelaje naranja', dom:'N', rec:'n', organism:'other', codominant:true },
  ]
};

const RANDOM_PATTERN_NAMES = {
  AR: t('pedigree.pattern.AR', 'Autosómica Recesiva'),
  AD: t('pedigree.pattern.AD', 'Autosómica Dominante'),
  XR: t('pedigree.pattern.XR', 'Recesiva ligada al cromosoma X'),
  XD: t('pedigree.pattern.XD', 'Dominante ligada al cromosoma X')
};

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

function buildRandomARExercise(trait) {
  return {
    id: randomExerciseId('AR'),
    organismType: trait.organism || 'human',
    title: `Caso aleatorio: ${trait.name}`,
    description: `Dos progenitores no afectados tienen una hija afectada por ${trait.affected}. El árbol está generado con una plantilla mendeliana resoluble.`,
    question: `Identifica el patrón de herencia de ${trait.name} y deduce los genotipos que quedan determinados por el árbol.`,
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
      clues: [
        'Los progenitores I-1 e I-2 no están afectados, pero tienen una hija afectada (II-2): el rasgo debe comportarse como recesivo.',
        'Una hija afectada con padre no afectado descarta una herencia recesiva ligada al X en el modelo escolar, porque una hija X-recesiva afectada necesitaría recibir el X patológico de su padre.',
        'El patrón se interpreta como autosómico recesivo: ambos progenitores son portadores heterocigotos (Aa × Aa).',
        'Los descendientes no afectados de ese cruce pueden ser AA o Aa; el árbol no permite distinguirlos sin más datos.'
      ],
      genotypes: {1:'Aa', 2:'Aa', 3:'AA o Aa', 4:'aa', 5:'AA o Aa', 6:'AA o Aa'},
      genotypeLabels: {1:'Portador', 2:'Portadora', 4:'Afectada'}
    }
  };
}

function buildRandomADExercise(trait) {
  return {
    id: randomExerciseId('AD'),
    organismType: trait.organism || 'human',
    title: `Caso aleatorio: ${trait.name}`,
    description: `Un padre afectado por ${trait.affected} y una madre no afectada tienen hijos afectados y no afectados, incluyendo transmisión padre-hijo hombre.`,
    question: `Determina el patrón de herencia de ${trait.name}. ¿Qué genotipo debe tener el progenitor afectado?`,
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
      clues: [
        'El rasgo aparece en un progenitor afectado y en parte de su descendencia: esto encaja con herencia dominante.',
        'Hay transmisión de padre afectado a hijo hombre afectado (I-1 → II-1), lo que descarta herencia ligada al X.',
        'Como I-1 tiene hijos no afectados, no puede ser AA. Debe ser heterocigoto Aa.',
        'El cruce Aa × aa explica que aproximadamente la mitad de la descendencia esté afectada.'
      ],
      genotypes: {1:'Aa', 2:'aa', 3:'Aa', 4:'aa', 5:'Aa', 6:'aa'},
      genotypeLabels: {1:'Afectado heterocigoto', 3:'Afectado', 5:'Afectada'}
    }
  };
}

function buildRandomXRExercise(trait) {
  const A = trait.dom;
  const a = trait.rec;
  return {
    id: randomExerciseId('XR'),
    organismType: trait.organism || 'human',
    title: `Caso aleatorio: ${trait.name}`,
    description: `Un padre afectado por ${trait.affected} tiene hijas no afectadas que son portadoras obligadas; una de ellas tiene un hijo afectado.`,
    question: `Identifica el patrón de herencia de ${trait.name}. ¿Por qué el rasgo reaparece en un nieto hombre?`,
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
      clues: [
        'Un padre afectado transmite su cromosoma X a todas sus hijas y su cromosoma Y a todos sus hijos; por eso sus hijos hombres no heredan el X patológico paterno.',
        'Las hijas II-2 e II-4 son portadoras obligadas: recibieron X patológico de I-1, pero no están afectadas porque el rasgo es recesivo.',
        'II-4 puede transmitir su X patológico a un hijo hombre. Si el hijo recibe ese X, expresa el rasgo porque solo tiene un cromosoma X.',
        'La ausencia de transmisión padre-hijo hombre y la reaparición en hombres a través de mujeres portadoras encajan con herencia recesiva ligada al X.'
      ],
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
      genotypeLabels: {1:'Afectado', 4:'Portadora', 6:'Portadora', 8:'Afectado'}
    }
  };
}

function buildRandomXDExercise(trait) {
  const A = trait.dom;
  const a = trait.rec;
  const codo = trait.codominant || false;
  const femAffected = !codo;
  const femLabel = codo ? 'Portadora' : 'Afectada';
  const description = codo
    ? `Un macho con ${trait.affected} (X^${A} Y) transmite su X a todas sus hijas, que resultan portadoras (X^${A} X^${a}) con fenotipo intermedio. Ningún hijo macho expresa el rasgo.`
    : `Un padre afectado por ${trait.affected} tiene todas sus hijas afectadas y ningún hijo hombre afectado.`;
  const question = codo
    ? `Identifica el patrón de herencia de ${trait.name}. ¿Por qué las hijas muestran un fenotipo distinto al padre? ¿Por qué ningún hijo macho expresa el rasgo paterno?`
    : `Identifica el patrón de herencia de ${trait.name}. ¿Por qué el padre afectado no transmite el rasgo a sus hijos hombres?`;
  const clues = codo ? [
    `El macho afectado (X^${A} Y) transmite su X a todas sus hijas y su Y a todos sus hijos machos.`,
    `Las hijas reciben X^${A} del padre y X^${a} de la madre (X^${a} X^${a}), resultando heterocigotas X^${A} X^${a} con fenotipo intermedio (portadoras visibles).`,
    `Los hijos machos solo reciben el X^${a} materno, por eso ninguno expresa el rasgo paterno.`,
    `El patrón macho afectado → todas las hijas portadoras y ningún hijo macho afectado es típico de herencia ligada al X con codominancia o dominancia incompleta.`
  ] : [
    'El padre afectado transmite su cromosoma X a todas sus hijas; por eso todas ellas aparecen afectadas.',
    'El padre transmite el cromosoma Y a sus hijos hombres, no su X afectado; por eso ningún hijo hombre está afectado.',
    'Las hijas están afectadas con una sola copia del alelo paterno, así que el alelo se comporta como dominante.',
    'El patrón padre afectado → todas las hijas afectadas y ningún hijo hombre afectado es diagnóstico de herencia dominante ligada al X.'
  ];
  return {
    id: randomExerciseId('XD'),
    organismType: trait.organism || 'human',
    title: `Caso aleatorio: ${trait.name}`,
    description,
    question,
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
      clues,
      genotypes: {
        1:`X^${A} Y`,
        2:`X^${a} X^${a}`,
        3:`X^${a} Y`,
        4:`X^${A} X^${a}`,
        5:`X^${a} Y`,
        6:`X^${A} X^${a}`,
        7:`X^${a} Y`
      },
      genotypeLabels: {1:'Afectado', 4:femLabel, 6:femLabel}
    }
  };
}
