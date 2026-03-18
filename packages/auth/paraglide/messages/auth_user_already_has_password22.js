/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_User_Already_Has_Password22Inputs */

const en_auth_user_already_has_password22 =
  /** @type {(inputs: Auth_User_Already_Has_Password22Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User already has a password. Provide that to delete the account.`;
  };

/**
 * | output |
 * | --- |
 * | "User already has a password. Provide that to delete the account." |
 *
 * @param {Auth_User_Already_Has_Password22Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_user_already_has_password22 =
  /** @type {((inputs?: Auth_User_Already_Has_Password22Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_User_Already_Has_Password22Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_user_already_has_password22(inputs);
    }
  );
export { auth_user_already_has_password22 as "auth_USER_ALREADY_HAS_PASSWORD" };
