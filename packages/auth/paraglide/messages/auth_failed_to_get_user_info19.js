/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Get_User_Info19Inputs */

const en_auth_failed_to_get_user_info19 =
  /** @type {(inputs: Auth_Failed_To_Get_User_Info19Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to get user info`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to get user info" |
 *
 * @param {Auth_Failed_To_Get_User_Info19Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_get_user_info19 =
  /** @type {((inputs?: Auth_Failed_To_Get_User_Info19Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Get_User_Info19Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_get_user_info19(inputs);
    }
  );
export { auth_failed_to_get_user_info19 as "auth_FAILED_TO_GET_USER_INFO" };
