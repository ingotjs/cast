/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Too_Long15Inputs */

const en_auth_password_too_long15 =
  /** @type {(inputs: Auth_Password_Too_Long15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Password too long`;
  };

/**
 * | output |
 * | --- |
 * | "Password too long" |
 *
 * @param {Auth_Password_Too_Long15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_password_too_long15 =
  /** @type {((inputs?: Auth_Password_Too_Long15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Too_Long15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_password_too_long15(inputs);
    }
  );
export { auth_password_too_long15 as "auth_PASSWORD_TOO_LONG" };
