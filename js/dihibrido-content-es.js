window.DIHYBRID_CONTENT = {
  presets: {
    clasico:   { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Amarillo', tr:'Verde', tb:'Liso', tbr:'Rugoso', description:'Cruce dihíbrido clásico con dos genes independientes y doble heterocigosis en ambos progenitores.' },
    testcross: { p1A:'Aa', p1B:'Bb', p2A:'aa', p2B:'bb', ta:'Amarillo', tr:'Verde', tb:'Liso', tbr:'Rugoso', description:'Cruce de prueba: el doble heterocigoto se cruza con un doble homocigoto recesivo.' },
    guisantes: { p1A:'Aa', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Semilla amarilla', tr:'Semilla verde', tb:'Forma lisa', tbr:'Forma rugosa', description:'Caso mendeliano clásico con color y forma de la semilla de guisante.' },
    AAbb:      { p1A:'AA', p1B:'Bb', p2A:'Aa', p2B:'Bb', ta:'Amarillo', tr:'Verde', tb:'Liso', tbr:'Rugoso', description:'Cruce con homocigosis dominante en el primer gen y segregación en el segundo.' },
  },
  randomTraitPairs: [
    { context: 'guisantes', ta: 'Semilla amarilla', tr: 'Semilla verde', tb: 'Semilla lisa', tbr: 'Semilla rugosa', description: 'Dos caracteres mendelianos clásicos de guisante, tratados como genes independientes.' },
    { context: 'Drosophila', ta: 'Cuerpo gris', tr: 'Cuerpo negro', tb: 'Alas normales', tbr: 'Alas vestigiales', description: 'Dos rasgos autosómicos de Drosophila usados habitualmente como modelo escolar de segregación independiente.' },
    { context: 'maíz', ta: 'Grano pigmentado', tr: 'Grano sin pigmento', tb: 'Grano liso', tbr: 'Grano rugoso', description: 'Rasgos de grano de maíz modelados como dos loci con dominancia completa.' },
    { context: 'tomate', ta: 'Tallo alto', tr: 'Tallo enano', tb: 'Fruto rojo', tbr: 'Fruto amarillo', description: 'Ejemplo didáctico de dos caracteres vegetales independientes con dominancia completa.' }
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
    generatedExample: 'Ejemplo generado ({context}): {description} Cruce: {cross}.'
  }
};
