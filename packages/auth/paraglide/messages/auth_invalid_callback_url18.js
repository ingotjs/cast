/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_Callback_Url18Inputs */

const en_auth_invalid_callback_url18 =
  /** @type {(inputs: Auth_Invalid_Callback_Url18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid callback URL`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid callback URL" |
 *
 * @param {Auth_Invalid_Callback_Url18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_callback_url18 =
  /** @type {((inputs?: Auth_Invalid_Callback_Url18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_Callback_Url18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_callback_url18(inputs);
    }
  );
export { auth_invalid_callback_url18 as "auth_INVALID_CALLBACK_URL" };
