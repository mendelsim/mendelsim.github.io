window.X_LINKED_CONTENT = {
  presets: {
    hemofilia: { trait:'Hemofilia A', allA:'H', allA2:'h', description:'Rasgo recesivo ligado al X: el alelo h se expresa en hombres hemicigotos y en mujeres homocigotas recesivas.' },
    daltonismo:{ trait:'Daltonismo rojo-verde', allA:'C', allA2:'c', description:'Rasgo recesivo ligado al X usado como ejemplo clásico de mayor frecuencia en hombres.' },
    duchenne:  { trait:'Distrofia Muscular Duchenne', allA:'D', allA2:'d', description:'Enfermedad recesiva ligada al X: las madres portadoras pueden tener hijos hombres afectados.' },
  },
  randomTraits: [
    { trait:'Hemofilia A', allA:'H', allA2:'h' },
    { trait:'Daltonismo rojo-verde', allA:'C', allA2:'c' },
    { trait:'Distrofia Muscular Duchenne', allA:'D', allA2:'d' },
    { trait:'Deficiencia de G6PD', allA:'G', allA2:'g' },
    { trait:'Ictiosis ligada al X', allA:'I', allA2:'i' },
    { trait:'Adrenoleucodistrofia ligada al X', allA:'L', allA2:'l' }
  ],
  randomCrosses: [
    { mother:'X^AX^a', father:'X^AY', label:'madre portadora × padre normal' },
    { mother:'X^AX^a', father:'X^aY', label:'madre portadora × padre afectado' },
    { mother:'X^aX^a', father:'X^AY', label:'madre afectada × padre normal' },
    { mother:'X^AX^A', father:'X^aY', label:'madre normal homocigota × padre afectado' }
  ],
  messages: {
    generatedExample: 'Ejemplo generado: {trait}, {cross}. El caso usa herencia recesiva ligada al X con genotipos parentales resolubles.'
  }
};
