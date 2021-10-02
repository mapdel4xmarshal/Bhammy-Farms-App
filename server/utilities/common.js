/**
 * Determines if a variable is empty
 * @param val
 * @returns {boolean|arg is Array<any>|*}
 */
module.exports.isEmpty = (val) => ((val !== null && typeof val === 'object' && Object.keys(val).length === 0)
    || (Array.isArray(val) && val.length === 0) || val === null || val === ''
    || typeof (val) === 'undefined' || (typeof (val) === 'number' && isNaN(val)));

module.exports.dateRegex = /(\d{1,2})([\/-])(\d{1,2})\2(\d{2,4})/;

module.exports.getBool = (val) => !!JSON.parse(String(val).toLowerCase());
