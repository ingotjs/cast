/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_Redirect_Url18Inputs */

const en_auth_invalid_redirect_url18 =
  /** @type {(inputs: Auth_Invalid_Redirect_Url18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid redirect URL`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid redirect URL" |
 *
 * @param {Auth_Invalid_Redirect_Url18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_redirect_url18 =
  /** @type {((inputs?: Auth_Invalid_Redirect_Url18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_Redirect_Url18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_redirect_url18(inputs);
    }
  );
export { auth_invalid_redirect_url18 as "auth_INVALID_REDIRECT_URL" };
