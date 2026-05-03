window.MONOHYBRID_CONTENT = {
  dominanceLabels: {
    complete: 'dominancia completa',
    incomplete: 'dominancia incompleta',
    codominance: 'codominancia',
  },
  presets: {
    guisantes: {
      p1: 'Aa', p2: 'Aa', dominance: 'complete',
      dom: 'Amarillo', rec: 'Verde', inter: '',
      description: 'Mendel cruzó guisantes amarillos (AA y Aa) con guisantes verdes (aa). El color amarillo (A) es dominante sobre el verde (a).'
    },
    sangre: {
      p1: 'Aa', p2: 'Aa', dominance: 'codominance',
      dom: 'Grupo sanguíneo M', rec: 'Grupo sanguíneo N', inter: 'Grupo sanguíneo MN',
      description: 'El sistema sanguíneo MN presenta codominancia. En el heterocigoto se expresan simultáneamente los alelos M y N.'
    },
    boca: {
      p1: 'Aa', p2: 'Aa', dominance: 'incomplete',
      dom: 'Roja', rec: 'Blanca', inter: 'Rosa',
      description: 'La flor de boca de dragón muestra dominancia incompleta. La mezcla de alelos rojo (A) y blanco (a) produce flores rosas (Aa).'
    },
    pelaje: {
      p1: 'Aa', p2: 'aa', dominance: 'complete',
      dom: 'Negro', rec: 'Naranja', inter: '',
      description: 'En el pelaje del gato, el alelo negro (A) es dominante sobre el naranja (a) en herencia autosómica.'
    }
  },
  randomTraits: {
    complete: [
      { dom: 'Semillas amarillas', rec: 'Semillas verdes', description: 'Caso mendeliano clásico en guisantes: el alelo para color amarillo se modela como dominante sobre el verde.' },
      { dom: 'Semillas lisas', rec: 'Semillas rugosas', description: 'Rasgo clásico de guisantes de Mendel: la forma lisa se modela como dominante sobre la rugosa.' },
      { dom: 'Alas normales', rec: 'Alas vestigiales', description: 'Ejemplo didáctico en Drosophila: las alas vestigiales se tratan como fenotipo recesivo frente a alas normales.' },
      { dom: 'Pigmentación normal', rec: 'Albinismo', description: 'Modelo autosómico recesivo frecuente en genética humana escolar: el albinismo aparece en homocigosis recesiva.' }
    ],
    incomplete: [
      { dom: 'Flores rojas', rec: 'Flores blancas', inter: 'Flores rosas', description: 'Dominancia incompleta en boca de dragón o dondiego de noche: el heterocigoto presenta un fenotipo intermedio.' },
      { dom: 'Plumaje negro', rec: 'Plumaje blanco', inter: 'Plumaje azul', description: 'Modelo clásico de dominancia incompleta en gallinas andaluzas: el heterocigoto presenta plumaje azul.' },
      { dom: 'Frutos rojos', rec: 'Frutos blancos', inter: 'Frutos rosados', description: 'Ejemplo escolar de dominancia incompleta: el heterocigoto muestra una intensidad intermedia del color.' }
    ],
    codominance: [
      { dom: 'Grupo sanguíneo M', rec: 'Grupo sanguíneo N', inter: 'Grupo sanguíneo MN', description: 'Sistema sanguíneo MN: los alelos M y N se expresan simultáneamente en el heterocigoto.' },
      { dom: 'Pelaje rojo', rec: 'Pelaje blanco', inter: 'Pelaje ruano', description: 'Codominancia en ganado ruano: en el heterocigoto se observan pelos rojos y blancos a la vez.' }
    ]
  },
  randomCrosses: [
    ['Aa', 'Aa'],
    ['Aa', 'aa'],
    ['aa', 'Aa'],
    ['AA', 'aa'],
    ['aa', 'AA'],
    ['AA', 'Aa'],
    ['Aa', 'AA']
  ],
  messages: {
    customMode: 'Modo personalizado: elige genotipos, fenotipos y tipo de dominancia. Los ejemplos guiados fijan su tipo para evitar combinaciones incoherentes.',
    presetLocked: 'Tipo fijado por este ejemplo: {dominance}. Usa “Personalizado” si quieres cambiarlo.',
    randomLocked: 'Tipo fijado por el ejemplo aleatorio: {dominance}. Usa “Personalizado” si quieres cambiarlo.',
    generatedExample: 'Ejemplo generado: {description} Cruce: {p1} × {p2}.'
  }
};
