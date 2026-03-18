/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Validation_Error15Inputs */

const en_auth_validation_error15 =
  /** @type {(inputs: Auth_Validation_Error15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Validation error`;
  };

/**
 * | output |
 * | --- |
 * | "Validation error" |
 *
 * @param {Auth_Validation_Error15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_validation_error15 =
  /** @type {((inputs?: Auth_Validation_Error15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Validation_Error15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_validation_error15(inputs);
    }
  );
export { auth_validation_error15 as "auth_VALIDATION_ERROR" };
