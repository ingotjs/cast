/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Failed_To_Create_Session21Inputs */

const en_auth_failed_to_create_session21 =
  /** @type {(inputs: Auth_Failed_To_Create_Session21Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to create session`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to create session" |
 *
 * @param {Auth_Failed_To_Create_Session21Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_failed_to_create_session21 =
  /** @type {((inputs?: Auth_Failed_To_Create_Session21Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Failed_To_Create_Session21Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_failed_to_create_session21(inputs);
    }
  );
export { auth_failed_to_create_session21 as "auth_FAILED_TO_CREATE_SESSION" };
