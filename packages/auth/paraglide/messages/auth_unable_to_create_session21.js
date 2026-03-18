/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Unable_To_Create_Session21Inputs */

const en_auth_unable_to_create_session21 =
  /** @type {(inputs: Auth_Unable_To_Create_Session21Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unable to create session`;
  };

/**
 * | output |
 * | --- |
 * | "Unable to create session" |
 *
 * @param {Auth_Unable_To_Create_Session21Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_unable_to_create_session21 =
  /** @type {((inputs?: Auth_Unable_To_Create_Session21Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Unable_To_Create_Session21Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_unable_to_create_session21(inputs);
    }
  );
export { auth_unable_to_create_session21 as "auth_UNABLE_TO_CREATE_SESSION" };
