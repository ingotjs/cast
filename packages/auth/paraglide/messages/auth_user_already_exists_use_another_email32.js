/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_User_Already_Exists_Use_Another_Email32Inputs */

const en_auth_user_already_exists_use_another_email32 =
  /** @type {(inputs: Auth_User_Already_Exists_Use_Another_Email32Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `User already exists. Use another email.`;
  };

/**
 * | output |
 * | --- |
 * | "User already exists. Use another email." |
 *
 * @param {Auth_User_Already_Exists_Use_Another_Email32Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_user_already_exists_use_another_email32 =
  /** @type {((inputs?: Auth_User_Already_Exists_Use_Another_Email32Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_User_Already_Exists_Use_Another_Email32Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_user_already_exists_use_another_email32(inputs);
    }
  );
export { auth_user_already_exists_use_another_email32 as "auth_USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" };
