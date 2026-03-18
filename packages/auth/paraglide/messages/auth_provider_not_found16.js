/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Provider_Not_Found16Inputs */

const en_auth_provider_not_found16 =
  /** @type {(inputs: Auth_Provider_Not_Found16Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Provider not found`;
  };

/**
 * | output |
 * | --- |
 * | "Provider not found" |
 *
 * @param {Auth_Provider_Not_Found16Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_provider_not_found16 =
  /** @type {((inputs?: Auth_Provider_Not_Found16Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Provider_Not_Found16Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_provider_not_found16(inputs);
    }
  );
export { auth_provider_not_found16 as "auth_PROVIDER_NOT_FOUND" };
