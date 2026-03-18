/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Social_Account_Already_Linked26Inputs */

const en_auth_social_account_already_linked26 =
  /** @type {(inputs: Auth_Social_Account_Already_Linked26Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Social account already linked`;
  };

/**
 * | output |
 * | --- |
 * | "Social account already linked" |
 *
 * @param {Auth_Social_Account_Already_Linked26Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_social_account_already_linked26 =
  /** @type {((inputs?: Auth_Social_Account_Already_Linked26Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Social_Account_Already_Linked26Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_social_account_already_linked26(inputs);
    }
  );
export { auth_social_account_already_linked26 as "auth_SOCIAL_ACCOUNT_ALREADY_LINKED" };
