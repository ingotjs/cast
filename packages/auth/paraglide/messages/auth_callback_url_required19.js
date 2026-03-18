/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Callback_Url_Required19Inputs */

const en_auth_callback_url_required19 =
  /** @type {(inputs: Auth_Callback_Url_Required19Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Callback URL is required`;
  };

/**
 * | output |
 * | --- |
 * | "Callback URL is required" |
 *
 * @param {Auth_Callback_Url_Required19Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_callback_url_required19 =
  /** @type {((inputs?: Auth_Callback_Url_Required19Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Callback_Url_Required19Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_callback_url_required19(inputs);
    }
  );
export { auth_callback_url_required19 as "auth_CALLBACK_URL_REQUIRED" };
