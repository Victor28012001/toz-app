import config from '../../config.js';
import { renderPartTypes } from './PartTypes.js';
import { renderPartList } from './PartList.js';
import { renderPartColorSelector } from './PartColorSelector.js';

/**
 * Renders the full selector panel (part types, list, color selector).
 * @param {HTMLElement} container - Where the selector panel goes
 * @param {Object} props - All required props from main.js
 */
export function renderSelector(container, props) {
  container.innerHTML = ''; // Clear previous render
  container.className = 'Selector';

  const partTypesContainer = document.createElement('div');
  const partListContainer = document.createElement('div');
  const partColorSelectorContainer = document.createElement('div');
  const downContainer = document.createElement('div');

  container.appendChild(partTypesContainer);
  container.appendChild(downContainer);
  downContainer.appendChild(partListContainer);
  downContainer.appendChild(partColorSelectorContainer);

  const rerender = () => {
    partListContainer.innerHTML = '';
    partColorSelectorContainer.innerHTML = '';

    renderPartList(partListContainer, {
      parts: config.parts,
      partType: props.selectedPartType, // ✅ use props.selectedPartType
      addPart: props.addPart,
      removePart: props.removePart,
      skinTone: props.skinTone,
      partsArray: props.partsArray
    });

    renderPartColorSelector(partColorSelectorContainer, {
      parts: config.parts,
      partType: props.selectedPartType, // ✅ use props.selectedPartType
      addPart: props.addPart,
      skinTone: props.skinTone,
      partsArray: props.partsArray,
      setSkinTone: props.changeSkinTone
    });
  };

  renderPartTypes(partTypesContainer, {
    partTypes: config.partTypes,
    partType: props.selectedPartType, // ✅ pass it to PartTypes
    setPartType: props.setPartType,   // ✅ callback from main.js
    randomize: props.randomize,
    save: props.save,
    share: props.share,
    refresh: props.refresh
  });

  rerender();
}
