/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_New_User_Callback_Url25Inputs */

const en_auth_invalid_new_user_callback_url25 =
  /** @type {(inputs: Auth_Invalid_New_User_Callback_Url25Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid new user callback URL`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid new user callback URL" |
 *
 * @param {Auth_Invalid_New_User_Callback_Url25Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_new_user_callback_url25 =
  /** @type {((inputs?: Auth_Invalid_New_User_Callback_Url25Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_New_User_Callback_Url25Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_new_user_callback_url25(inputs);
    }
  );
export { auth_invalid_new_user_callback_url25 as "auth_INVALID_NEW_USER_CALLBACK_URL" };
