/**
 * Determines if a variable is empty
 * @param val
 * @returns {boolean|arg is Array<any>|*}
 */
module.exports.isEmpty = (val) => {
  return ((val !== null && typeof val === "object" && Object.keys(val).length === 0) ||
    (Array.isArray(val) && val.length === 0) || val === null || val === "" ||
    typeof (val) === "undefined" || (typeof (val) === "number" && isNaN(val)));
};
