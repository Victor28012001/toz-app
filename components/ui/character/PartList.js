// import configUtils from "../../../../components/character/configUtils.js";

/**
 * Renders a list of parts for the selected part type
 * @param {HTMLElement} container
 * @param {Object} props
 */
export function renderPartList(container, props) {
  container.className = "PartList";

  const { filter, reduce } = configUtils;

  const filteredParts = props.parts
    .filter((part) => filter.byPartType(part, props.partType))
    .filter((part) => filter.bySkinTone(part, props.skinTone))
    .filter((part) => filter.byBodyShape(part, props.partsArray))
    .reduce(reduce.byPartName, []);

  const list = document.createElement("div");
  list.className = "partList";

  filteredParts.forEach((part, index) => {
    const isSelected = props.partsArray.some(
      (layer) => layer.name === part.name
    );

    const item = document.createElement("div");
    item.classList.add("partItem");

    if (props.partsArray.some((layer) => layer.name === part.name)) {
      item.classList.add("partItemSelected");
    }
    // item.className = isSelected ? 'partItemSelected' : 'partItem';
    item.textContent = index + 1;

    item.addEventListener("click", () => {
      if (isSelected) {
        props.removePart(part);
      } else {
        props.addPart(part);
      }
    });

    list.appendChild(item);
  });

  container.appendChild(list);
}
