/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_User_Email_Not_Found17Inputs */

const en_auth_user_email_not_found17 =
  /** @type {(inputs: Auth_User_Email_Not_Found17Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User email not found`;
  };

/**
 * | output |
 * | --- |
 * | "User email not found" |
 *
 * @param {Auth_User_Email_Not_Found17Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_user_email_not_found17 =
  /** @type {((inputs?: Auth_User_Email_Not_Found17Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_User_Email_Not_Found17Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_user_email_not_found17(inputs);
    }
  );
export { auth_user_email_not_found17 as "auth_USER_EMAIL_NOT_FOUND" };
