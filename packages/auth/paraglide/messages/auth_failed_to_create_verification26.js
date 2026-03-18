/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Create_Verification26Inputs */

const en_auth_failed_to_create_verification26 =
  /** @type {(inputs: Auth_Failed_To_Create_Verification26Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unable to create verification`;
  };

/**
 * | output |
 * | --- |
 * | "Unable to create verification" |
 *
 * @param {Auth_Failed_To_Create_Verification26Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_create_verification26 =
  /** @type {((inputs?: Auth_Failed_To_Create_Verification26Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Create_Verification26Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_create_verification26(inputs);
    }
  );
export { auth_failed_to_create_verification26 as "auth_FAILED_TO_CREATE_VERIFICATION" };
