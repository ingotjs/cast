/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_User_Already_Exists17Inputs */

const en_auth_user_already_exists17 =
  /** @type {(inputs: Auth_User_Already_Exists17Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User already exists`;
  };

/**
 * | output |
 * | --- |
 * | "User already exists" |
 *
 * @param {Auth_User_Already_Exists17Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_user_already_exists17 =
  /** @type {((inputs?: Auth_User_Already_Exists17Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_User_Already_Exists17Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_user_already_exists17(inputs);
    }
  );
export { auth_user_already_exists17 as "auth_USER_ALREADY_EXISTS" };
