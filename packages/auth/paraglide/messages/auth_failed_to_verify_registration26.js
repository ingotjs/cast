/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Verify_Registration26Inputs */

const en_auth_failed_to_verify_registration26 =
  /** @type {(inputs: Auth_Failed_To_Verify_Registration26Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to verify registration`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to verify registration" |
 *
 * @param {Auth_Failed_To_Verify_Registration26Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_verify_registration26 =
  /** @type {((inputs?: Auth_Failed_To_Verify_Registration26Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Verify_Registration26Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_verify_registration26(inputs);
    }
  );
export { auth_failed_to_verify_registration26 as "auth_FAILED_TO_VERIFY_REGISTRATION" };
