/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_Password15Inputs */

const en_auth_invalid_password15 =
  /** @type {(inputs: Auth_Invalid_Password15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid password`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid password" |
 *
 * @param {Auth_Invalid_Password15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_password15 =
  /** @type {((inputs?: Auth_Invalid_Password15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_Password15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_password15(inputs);
    }
  );
export { auth_invalid_password15 as "auth_INVALID_PASSWORD" };
