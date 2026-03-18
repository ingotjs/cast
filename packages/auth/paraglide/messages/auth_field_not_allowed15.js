/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Field_Not_Allowed15Inputs */

const en_auth_field_not_allowed15 =
  /** @type {(inputs: Auth_Field_Not_Allowed15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Field not allowed to be set`;
  };

/**
 * | output |
 * | --- |
 * | "Field not allowed to be set" |
 *
 * @param {Auth_Field_Not_Allowed15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_field_not_allowed15 =
  /** @type {((inputs?: Auth_Field_Not_Allowed15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Field_Not_Allowed15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_field_not_allowed15(inputs);
    }
  );
export { auth_field_not_allowed15 as "auth_FIELD_NOT_ALLOWED" };
