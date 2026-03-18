/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Credential_Account_Not_Found25Inputs */

const en_auth_credential_account_not_found25 =
  /** @type {(inputs: Auth_Credential_Account_Not_Found25Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Credential account not found`;
  };

/**
 * | output |
 * | --- |
 * | "Credential account not found" |
 *
 * @param {Auth_Credential_Account_Not_Found25Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_credential_account_not_found25 =
  /** @type {((inputs?: Auth_Credential_Account_Not_Found25Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Credential_Account_Not_Found25Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_credential_account_not_found25(inputs);
    }
  );
export { auth_credential_account_not_found25 as "auth_CREDENTIAL_ACCOUNT_NOT_FOUND" };
