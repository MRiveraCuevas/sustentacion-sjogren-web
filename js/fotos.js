/* Fotografías de las recetas (imágenes aportadas por los autores).
   Opcional: escribe en 'herramienta' y 'fecha' la herramienta de IA usada y la fecha de generación.
   Si alguna es una fotografía real, cambia tipo a 'propia' (con fecha) o 'externa' (con autor, licencia y url).
   Coloca cada imagen en la carpeta fotos/ con estos nombres: receta1.jpg … receta6.jpg
   (o cambia "file"). Mientras no exista la foto, la página muestra la ilustración del PPTX.
   Completa el CRÉDITO de cada una según su origen:
   tipo 'ia'      → imagen generada con IA: indica herramienta y fecha (el prompt está en PROMPTS_IMAGENES.md)
   tipo 'propia'  → fotografía de los autores: indica fecha
   tipo 'externa' → fotografía de otra fuente: indica autor, licencia y url                         */
const FOTOS = [
  { file: 'fotos/receta1.jpg', tipo: 'ia', herramienta: '', fecha: '' },
  { file: 'fotos/receta2.jpg', tipo: 'ia', herramienta: '', fecha: '' },
  { file: 'fotos/receta3.jpg', tipo: 'ia', herramienta: '', fecha: '' },
  { file: 'fotos/receta4.jpg', tipo: 'ia', herramienta: '', fecha: '' },
  { file: 'fotos/receta5.jpg', tipo: 'ia', herramienta: '', fecha: '' },
  { file: 'fotos/receta6.jpg', tipo: 'ia', herramienta: '', fecha: '' },
];
