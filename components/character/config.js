/**
 * @typedef {Object} ConfigColor
 * @property {number} id
 * @property {string} name
 * @property {boolean} [isSkinTone]
 * @property {string|string[]} hex
 */

/**
 * @typedef {Object} ConfigPartType
 * @property {number} id
 * @property {string} name
 * @property {string} iconFilename
 * @property {boolean} [useSkinTone]
 * @property {boolean} [boundToBodyShape]
 * @property {boolean} [allowsMultipleSelection]
 */

/**
 * @typedef {Object} ConfigImage
 * @property {string} filename
 * @property {number} zIndex
 */

/**
 * @typedef {Object} ConfigPart
 * @property {string} name
 * @property {number} partTypeId
 * @property {ConfigImage[]} images
 * @property {number} [bodyShapeId]
 * @property {number} [colorId]
 */

/**
 * @typedef {Object} Config
 * @property {ConfigColor[]} colors
 * @property {ConfigPartType[]} partTypes
 * @property {ConfigPart[]} parts
 */

// Example export if needed
export const config = {
    /** @type {ConfigColor[]} */
    colors: [],
    
    /** @type {ConfigPartType[]} */
    partTypes: [],
    
    /** @type {ConfigPart[]} */
    parts: []
  };
  