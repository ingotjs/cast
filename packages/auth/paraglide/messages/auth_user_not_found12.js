/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_User_Not_Found12Inputs */

const en_auth_user_not_found12 =
  /** @type {(inputs: Auth_User_Not_Found12Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User not found`;
  };

/**
 * | output |
 * | --- |
 * | "User not found" |
 *
 * @param {Auth_User_Not_Found12Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_user_not_found12 =
  /** @type {((inputs?: Auth_User_Not_Found12Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_User_Not_Found12Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_user_not_found12(inputs);
    }
  );
export { auth_user_not_found12 as "auth_USER_NOT_FOUND" };
