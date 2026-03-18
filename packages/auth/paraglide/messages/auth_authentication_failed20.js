/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Authentication_Failed20Inputs */

const en_auth_authentication_failed20 =
  /** @type {(inputs: Auth_Authentication_Failed20Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Authentication failed`;
  };

/**
 * | output |
 * | --- |
 * | "Authentication failed" |
 *
 * @param {Auth_Authentication_Failed20Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_authentication_failed20 =
  /** @type {((inputs?: Auth_Authentication_Failed20Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Authentication_Failed20Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_authentication_failed20(inputs);
    }
  );
export { auth_authentication_failed20 as "auth_AUTHENTICATION_FAILED" };
