// import configUtils from "../../../../components/character/configUtils.js";

/**
 * Renders color options for each selected part in a type
 * @param {HTMLElement} container
 * @param {Object} props
 */
export function renderPartColorSelector(container, props) {
  container.className = "PartColorSelector";

  const onClickColorHandler = (part) => {
    if (configUtils.partType.usesSkinTone(part.partTypeId)) {
      props.setSkinTone(part.colorId);
    } else {
      props.addPart(part);
    }
  };

  const selectedParts = props.partsArray.filter(
    (part) => part.partTypeId === props.partType
  );

  selectedParts.forEach((part) => {
    const wrapper = document.createElement("div");
    wrapper.className = "PartColorSelectorPart";

    const title = document.createElement("div");
    title.className = "partName";
    title.textContent = part.name;

    const colorsContainer = document.createElement("div");
    colorsContainer.className = "PartColorSelectorColors";

    const colorOptions = props.parts.filter(
      (other) =>
        other.bodyShapeId === part.bodyShapeId &&
        other.partTypeId === part.partTypeId &&
        other.name === part.name
    );

    colorOptions.forEach((other) => {
      const color = configUtils.color.getColor(other.colorId);
      let colorBox;

      if (Array.isArray(color.hex)) {
        // Multi-color gradient
        colorBox = document.createElement("div");

        // Always add the base class
        colorBox.classList.add("colorMultiple");

        // Conditionally add selected class
        if (color.id === part.colorId) {
          colorBox.classList.add("colorMultipleSelected");
        }

        if (color.id === part.colorId) {
          colorBox.style.borderColor = color.hex[0];
        }

        color.hex.forEach((hex) => {
          const block = document.createElement("div");
          block.style.backgroundColor = hex;
          colorBox.appendChild(block);
        });
      } else {
        // Single color
        colorBox = document.createElement("div");

        // Always add the base class
        colorBox.classList.add("color");

        // Conditionally add the selected class
        if (color.id === part.colorId) {
          colorBox.classList.add("colorSelected");
        }

        colorBox.style.backgroundColor = color.hex;

        if (color.id === part.colorId) {
          colorBox.style.borderColor = color.hex;
        }
      }

      colorBox.addEventListener("click", () => onClickColorHandler(other));
      colorsContainer.appendChild(colorBox);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(colorsContainer);
    container.appendChild(wrapper);
  });
}
