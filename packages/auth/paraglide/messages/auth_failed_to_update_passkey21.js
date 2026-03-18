/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Update_Passkey21Inputs */

const en_auth_failed_to_update_passkey21 =
  /** @type {(inputs: Auth_Failed_To_Update_Passkey21Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to update passkey`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to update passkey" |
 *
 * @param {Auth_Failed_To_Update_Passkey21Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_update_passkey21 =
  /** @type {((inputs?: Auth_Failed_To_Update_Passkey21Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Update_Passkey21Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_update_passkey21(inputs);
    }
  );
export { auth_failed_to_update_passkey21 as "auth_FAILED_TO_UPDATE_PASSKEY" };
