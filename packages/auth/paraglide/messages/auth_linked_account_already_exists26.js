/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Linked_Account_Already_Exists26Inputs */

const en_auth_linked_account_already_exists26 =
  /** @type {(inputs: Auth_Linked_Account_Already_Exists26Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Linked account already exists`;
  };

/**
 * | output |
 * | --- |
 * | "Linked account already exists" |
 *
 * @param {Auth_Linked_Account_Already_Exists26Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_linked_account_already_exists26 =
  /** @type {((inputs?: Auth_Linked_Account_Already_Exists26Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Linked_Account_Already_Exists26Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_linked_account_already_exists26(inputs);
    }
  );
export { auth_linked_account_already_exists26 as "auth_LINKED_ACCOUNT_ALREADY_EXISTS" };
