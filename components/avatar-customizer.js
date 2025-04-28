import config from "./config.js";
import configUtils from "./character/configUtils.js";
import { renderCharacter } from "./ui/character/character.js";
import { renderSelector } from "./ui/character/Selector.js";


const firstSkinToneId = config.colors.find((color) => color.isSkinTone).id;
let partInfoArray = configUtils.part.getDefaultSelection(firstSkinToneId);
let skinTone = firstSkinToneId;
let changing = false;
let selectedPartType = 0;

// DOM Elements
let ParentContainer;
let characterContainer;
let selectorContainer;
let topContainer;

function rerender() {
  characterContainer.innerHTML = "";
  renderCharacter(characterContainer, partInfoArray, changing);

  selectorContainer.innerHTML = "";
  renderSelector(selectorContainer, {
    addPart,
    removePart,
    changeSkinTone,
    skinTone,
    partsArray: partInfoArray,
    randomize,
    save,
    share,
    refresh,
    selectedPartType, // ✅ Pass current part type
    setPartType: (newType) => {
      selectedPartType = newType;
      rerender();
    },
  });
}

function cleanUrl() {
  window.location.href = window.location.href.split("#")[0] + "#";
}

function addPart(newPart) {
  cleanUrl();
  const newState = [...partInfoArray];
  let shouldAdd = true;
  const bodyChanged = configUtils.part.isBodyPart(newPart);

  newState.forEach((part, idx) => {
    if (
      part.partTypeId === newPart.partTypeId &&
      (!configUtils.part.allowsMultipleSelection(part) ||
        part.name === newPart.name)
    ) {
      configUtils.part.replacePart(part, newPart);
      shouldAdd = false;
    } else if (
      bodyChanged &&
      configUtils.partType.boundToBodyShape(part.partTypeId)
    ) {
      const boundPart = configUtils.part.findPartBoundToBodyShape(
        config,
        part,
        newPart.bodyShapeId
      );
      if (boundPart) configUtils.part.replacePart(part, boundPart);
    }
  });

  if (shouldAdd) newState.push({ ...newPart });

  partInfoArray = [...newState];
  rerender();
}

function removePart(removedPart) {
  cleanUrl();
  partInfoArray = partInfoArray.filter((part) =>
    configUtils.part.isBodyPart(removedPart)
      ? true
      : part.name !== removedPart.name
  );
  rerender();
}

function changeSkinTone(newTone) {
  cleanUrl();
  skinTone = newTone;
  partInfoArray = partInfoArray.map((part) => {
    if (configUtils.partType.usesSkinTone(part.partTypeId)) {
      const replacement = config.parts.find(
        (p) =>
          p.partTypeId === part.partTypeId &&
          p.name === part.name &&
          p.colorId === newTone
      );
      return replacement ? { ...replacement } : part;
    }
    return part;
  });
  rerender();
}

function randomize() {
  cleanUrl();
  const randomTone = _.sample(config.colors.filter((c) => c.isSkinTone));
  const randomBody = _.sample(
    config.parts.filter(
      (p) => configUtils.part.isBodyPart(p) && p.colorId === randomTone.id
    )
  );

  const randomParts = [randomBody];
  config.partTypes.forEach((pt) => {
    const options = config.parts.filter((p) => {
      return (
        !configUtils.part.isBodyPart(p) &&
        p.partTypeId === pt.id &&
        (!pt.useSkinTone || p.colorId === randomTone.id) &&
        (!pt.boundToBodyShape || p.bodyShapeId === randomBody.bodyShapeId)
      );
    });
    const randomPart = _.sample(options);
    if (randomPart) randomParts.push({ ...randomPart });
  });

  partInfoArray = randomParts;
  skinTone = randomTone.id;
  changing = true;
  rerender();
  setTimeout(() => {
    changing = false;
    rerender();
  }, 500);
}

function save() {
  const container = document.querySelector("#character");
  const image = document.querySelector(".characterLayer");

  if (container && image) {
    const xOffset = container.clientWidth - image.clientWidth;
    const yOffset = container.clientHeight - image.clientHeight;

    html2canvas(container, {
      x: xOffset,
      y: yOffset,
      height: image.clientHeight,
      width: image.clientWidth,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "character.png";
      link.click();
    });
  }
}

function share() {
  const data = btoa(JSON.stringify(partInfoArray));
  window.location.href = `${window.location.href.split("#")[0]}#${data}`;
}

function refresh() {
  cleanUrl();
  partInfoArray = configUtils.part.getDefaultSelection(firstSkinToneId);
  skinTone = firstSkinToneId;
  changing = true;
  rerender();
  setTimeout(() => {
    changing = false;
    rerender();
  }, 500);
}

// Load from URL on startup
function loadPartsFromUrl() {
  const encoded = window.location.hash.split("#")[1];
  if (encoded) {
    try {
      const decoded = JSON.parse(atob(encoded));
      partInfoArray = decoded;
      const newTone = partInfoArray.find((part) =>
        configUtils.partType.usesSkinTone(part.partTypeId)
      )?.colorId;
      if (newTone) skinTone = newTone;
    } catch (err) {
      console.error("Failed to decode character:", err);
    }
  }
}

// Start App

export function init() {
  ParentContainer = document.getElementById("characters");
  characterContainer = document.createElement("div");
  selectorContainer = document.createElement("div");
  characterContainer.id = "character";
  selectorContainer.id = "selector";

  ParentContainer.appendChild(characterContainer);
  ParentContainer.appendChild(selectorContainer);

  loadPartsFromUrl();
  rerender();
}

window.addEventListener("DOMContentLoaded", init);
