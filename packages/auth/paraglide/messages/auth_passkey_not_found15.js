/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Passkey_Not_Found15Inputs */

const en_auth_passkey_not_found15 =
  /** @type {(inputs: Auth_Passkey_Not_Found15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Passkey not found`;
  };

/**
 * | output |
 * | --- |
 * | "Passkey not found" |
 *
 * @param {Auth_Passkey_Not_Found15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_passkey_not_found15 =
  /** @type {((inputs?: Auth_Passkey_Not_Found15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passkey_Not_Found15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_passkey_not_found15(inputs);
    }
  );
export { auth_passkey_not_found15 as "auth_PASSKEY_NOT_FOUND" };
