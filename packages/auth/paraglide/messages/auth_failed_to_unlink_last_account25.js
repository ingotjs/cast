/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Unlink_Last_Account25Inputs */

const en_auth_failed_to_unlink_last_account25 =
  /** @type {(inputs: Auth_Failed_To_Unlink_Last_Account25Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `You can't unlink your last account`;
  };

/**
 * | output |
 * | --- |
 * | "You can't unlink your last account" |
 *
 * @param {Auth_Failed_To_Unlink_Last_Account25Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_unlink_last_account25 =
  /** @type {((inputs?: Auth_Failed_To_Unlink_Last_Account25Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Unlink_Last_Account25Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_unlink_last_account25(inputs);
    }
  );
export { auth_failed_to_unlink_last_account25 as "auth_FAILED_TO_UNLINK_LAST_ACCOUNT" };
