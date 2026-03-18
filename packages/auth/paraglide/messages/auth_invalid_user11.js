/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_User11Inputs */

const en_auth_invalid_user11 =
  /** @type {(inputs: Auth_Invalid_User11Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid user`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid user" |
 *
 * @param {Auth_Invalid_User11Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_user11 =
  /** @type {((inputs?: Auth_Invalid_User11Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_User11Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_user11(inputs);
    }
  );
export { auth_invalid_user11 as "auth_INVALID_USER" };
