/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Get_Session18Inputs */

const en_auth_failed_to_get_session18 =
  /** @type {(inputs: Auth_Failed_To_Get_Session18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to get session`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to get session" |
 *
 * @param {Auth_Failed_To_Get_Session18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_get_session18 =
  /** @type {((inputs?: Auth_Failed_To_Get_Session18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Get_Session18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_get_session18(inputs);
    }
  );
export { auth_failed_to_get_session18 as "auth_FAILED_TO_GET_SESSION" };
