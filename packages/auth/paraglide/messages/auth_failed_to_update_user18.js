/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Update_User18Inputs */

const en_auth_failed_to_update_user18 =
  /** @type {(inputs: Auth_Failed_To_Update_User18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to update user`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to update user" |
 *
 * @param {Auth_Failed_To_Update_User18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_update_user18 =
  /** @type {((inputs?: Auth_Failed_To_Update_User18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Update_User18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_update_user18(inputs);
    }
  );
export { auth_failed_to_update_user18 as "auth_FAILED_TO_UPDATE_USER" };
