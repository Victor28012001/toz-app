import { createPartLayer } from './partLayer.js';

/**
 * Renders the character based on the given parts.
 * @param {HTMLElement} container - DOM node where the character is rendered
 * @param {Array} partsArray - Array of ConfigPart objects
 * @param {boolean} changing - Whether character is in changing state
 */
export function renderCharacter(container, partsArray, changing) {
  container.className = 'Character'; // Apply base class
  if (changing) container.classList.add('Changing');


  partsArray.forEach(part => {
    part.images.forEach(image => {
      const layer = createPartLayer(image);
      container.appendChild(layer);
    });
  });
}
