/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Too_Short16Inputs */

const en_auth_password_too_short16 =
  /** @type {(inputs: Auth_Password_Too_Short16Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Password too short`;
  };

/**
 * | output |
 * | --- |
 * | "Password too short" |
 *
 * @param {Auth_Password_Too_Short16Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_password_too_short16 =
  /** @type {((inputs?: Auth_Password_Too_Short16Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Too_Short16Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_password_too_short16(inputs);
    }
  );
export { auth_password_too_short16 as "auth_PASSWORD_TOO_SHORT" };
