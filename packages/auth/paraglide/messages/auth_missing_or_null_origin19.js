/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Missing_Or_Null_Origin19Inputs */

const en_auth_missing_or_null_origin19 =
  /** @type {(inputs: Auth_Missing_Or_Null_Origin19Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Missing or null Origin`;
  };

/**
 * | output |
 * | --- |
 * | "Missing or null Origin" |
 *
 * @param {Auth_Missing_Or_Null_Origin19Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_missing_or_null_origin19 =
  /** @type {((inputs?: Auth_Missing_Or_Null_Origin19Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Missing_Or_Null_Origin19Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_missing_or_null_origin19(inputs);
    }
  );
export { auth_missing_or_null_origin19 as "auth_MISSING_OR_NULL_ORIGIN" };
