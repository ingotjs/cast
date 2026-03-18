/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Session_Not_Fresh15Inputs */

const en_auth_session_not_fresh15 =
  /** @type {(inputs: Auth_Session_Not_Fresh15Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Session is not fresh`;
  };

/**
 * | output |
 * | --- |
 * | "Session is not fresh" |
 *
 * @param {Auth_Session_Not_Fresh15Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_session_not_fresh15 =
  /** @type {((inputs?: Auth_Session_Not_Fresh15Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Session_Not_Fresh15Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_session_not_fresh15(inputs);
    }
  );
export { auth_session_not_fresh15 as "auth_SESSION_NOT_FRESH" };
