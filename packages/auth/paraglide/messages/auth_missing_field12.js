/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Missing_Field12Inputs */

const en_auth_missing_field12 =
  /** @type {(inputs: Auth_Missing_Field12Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Field is required`;
  };

/**
 * | output |
 * | --- |
 * | "Field is required" |
 *
 * @param {Auth_Missing_Field12Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_missing_field12 =
  /** @type {((inputs?: Auth_Missing_Field12Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Missing_Field12Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_missing_field12(inputs);
    }
  );
export { auth_missing_field12 as "auth_MISSING_FIELD" };
