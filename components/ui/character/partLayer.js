/**
 * Create a part layer DOM element.
 * @param {Object} image - A ConfigImage object
 * @returns {HTMLElement} The DOM node representing the image layer
 */
export function createPartLayer(image) {
  // const urlPrefix = `${process.env.PUBLIC_URL || '.'}/character_parts`;
  const urlPrefix = `../../../public/character_parts`;
  const layer = document.createElement('div');
  layer.className = 'Layer';
  layer.style.zIndex = image.zIndex;
  layer.dataset.part = image.filename;

  const img = document.createElement('img');
  img.src = `${urlPrefix}/${image.filename}.png`;
  img.alt = image.filename;
  img.className = 'characterLayer';

  layer.appendChild(img);
  return layer;
}
