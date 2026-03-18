/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Password_Already_Set18Inputs */

const en_auth_password_already_set18 =
  /** @type {(inputs: Auth_Password_Already_Set18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User already has a password set`;
  };

/**
 * | output |
 * | --- |
 * | "User already has a password set" |
 *
 * @param {Auth_Password_Already_Set18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_password_already_set18 =
  /** @type {((inputs?: Auth_Password_Already_Set18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_Already_Set18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_password_already_set18(inputs);
    }
  );
export { auth_password_already_set18 as "auth_PASSWORD_ALREADY_SET" };
