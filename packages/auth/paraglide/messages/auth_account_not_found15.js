/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Account_Not_Found15Inputs */

const en_auth_account_not_found15 =
  /** @type {(inputs: Auth_Account_Not_Found15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account not found`;
  };

/**
 * | output |
 * | --- |
 * | "Account not found" |
 *
 * @param {Auth_Account_Not_Found15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_account_not_found15 =
  /** @type {((inputs?: Auth_Account_Not_Found15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Account_Not_Found15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_account_not_found15(inputs);
    }
  );
export { auth_account_not_found15 as "auth_ACCOUNT_NOT_FOUND" };
