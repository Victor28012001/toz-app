/**
 * @typedef {Object} ConfigPart
 * @property {number} partTypeId
 * @property {number} bodyShapeId
 * @property {number} colorId
 * @property {string} name
 * @property {Array} images
 */

/**
 * @typedef {Object} ConfigColor
 * @property {number} id
 * @property {string} hex
 */

/**
 * @typedef {Object} Config
 * @property {ConfigPart[]} parts
 * @property {Object[]} partTypes
 * @property {ConfigColor[]} colors
 */

/**
 * @typedef {Object} ConfigUtils
 * @property {{
*   byPartType: (part: ConfigPart, partType: number) => boolean,
*   bySkinTone: (part: ConfigPart, skinTone: number) => boolean,
*   byBodyShape: (part: ConfigPart, partsArray: ConfigPart[]) => boolean
* }} filter
*
* @property {{
*   byPartName: (accumulator: ConfigPart[], currentValue: ConfigPart) => ConfigPart[]
* }} reduce
*
* @property {{
*   getColor: (colorId: number) => ConfigColor | undefined
* }} color
*
* @property {{
*   usesSkinTone: (partTypeId: number) => boolean,
*   boundToBodyShape: (partTypeId: number) => boolean,
*   getPartIcon: (partTypeId: number) => string
* }} partType
*
* @property {{
*   replacePart: (oldPart: ConfigPart, newPart: ConfigPart) => void,
*   isSamePart: (oldPart: ConfigPart, newPart: ConfigPart) => boolean,
*   findSameColorPart: (oldPart: ConfigPart, newPart: ConfigPart) => ConfigPart | undefined,
*   selectedBodyShape: (selectedParts: ConfigPart[]) => number | undefined,
*   findPartBoundToBodyShape: (config: Config, oldPart: ConfigPart, bodyShapeId: number) => ConfigPart | undefined,
*   isBodyPart: (part: ConfigPart) => boolean,
*   getDefaultSelection: (skinToneId: number) => ConfigPart[],
*   allowsMultipleSelection: (part: ConfigPart) => boolean
* }} part
*/

export {};
