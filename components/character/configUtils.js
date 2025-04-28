import config from "../../components/config.js";

const configUtils = {
  filter: {
    byPartType: (part, partType) => part.partTypeId === partType,

    bySkinTone: (part, skinTone) =>
      configUtils.partType.usesSkinTone(part.partTypeId)
        ? part.colorId === skinTone
        : true,

    byBodyShape: (part, partsArray) =>
      configUtils.partType.boundToBodyShape(part.partTypeId)
        ? part.bodyShapeId === configUtils.part.selectedBodyShape(partsArray)
        : true,
  },

  reduce: {
    byPartName: (accumulator, currentValue) =>
      accumulator.some((part) => part.name === currentValue.name)
        ? [...accumulator]
        : [...accumulator, currentValue],
  },

  color: {
    getColor: (colorId) => config.colors.find((color) => color.id === colorId),
  },

  partType: {
    usesSkinTone: (partTypeId) =>
      config.partTypes.find((partType) => partType.id === partTypeId)
        ?.useSkinTone || false,

    boundToBodyShape: (partTypeId) =>
      config.partTypes.find((partType) => partType.id === partTypeId)
        ?.boundToBodyShape || false,

    getPartIcon: (partTypeId) =>
      config.partTypes.find((partType) => partType.id === partTypeId)
        ?.iconFilename,
  },

  part: {
    replacePart: (oldPart, newPart) => {
      const utils = configUtils.part;

      if (
        utils.isSamePart(oldPart, newPart) &&
        oldPart.name !== newPart.name &&
        !configUtils.partType.usesSkinTone(newPart.partTypeId)
      ) {
        const sameColorPart = utils.findSameColorPart(oldPart, newPart);
        newPart = sameColorPart ? { ...sameColorPart } : newPart;
      }

      oldPart.images = newPart.images;
      oldPart.name = newPart.name;
      oldPart.partTypeId = newPart.partTypeId;
      oldPart.bodyShapeId = newPart.bodyShapeId;
      oldPart.colorId = newPart.colorId;
    },

    isSamePart: (oldPart, newPart) =>
      oldPart.bodyShapeId === newPart.bodyShapeId &&
      oldPart.partTypeId === newPart.partTypeId,

    findSameColorPart: (oldPart, newPart) =>
      config.parts.find(
        (part) =>
          configUtils.part.isSamePart(part, newPart) &&
          part.name === newPart.name &&
          part.colorId === oldPart.colorId
      ),

    selectedBodyShape: (selectedParts) =>
      selectedParts.find((part) => configUtils.part.isBodyPart(part))
        ?.bodyShapeId,

    findPartBoundToBodyShape: (configObj, oldPart, bodyGroupId) =>
      configObj.parts.find(
        (part) =>
          part.partTypeId === oldPart.partTypeId &&
          part.bodyShapeId === bodyGroupId &&
          part.colorId === oldPart.colorId
      ),

    isBodyPart: (part) => part.partTypeId === 0,

    getDefaultSelection: (skinToneId) => {
      const defaultSelection = [];

      const body = config.parts.find(
        (part) =>
          configUtils.part.isBodyPart(part) && part.colorId === skinToneId
      );

      const head = config.parts.find(
        (part) => part.partTypeId === 1 && part.colorId === skinToneId
      );

      if (body) defaultSelection.push({ ...body });
      if (head) defaultSelection.push({ ...head });

      return defaultSelection;
    },

    allowsMultipleSelection: (part) =>
      config.partTypes.find((partType) => partType.id === part.partTypeId)
        ?.allowsMultipleSelection || false,
  },
};

export default configUtils;
