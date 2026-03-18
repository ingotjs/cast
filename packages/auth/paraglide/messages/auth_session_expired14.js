/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Session_Expired14Inputs */

const en_auth_session_expired14 =
  /** @type {(inputs: Auth_Session_Expired14Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Session expired. Re-authenticate to perform this action.`;
  };

/**
 * | output |
 * | --- |
 * | "Session expired. Re-authenticate to perform this action." |
 *
 * @param {Auth_Session_Expired14Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_session_expired14 =
  /** @type {((inputs?: Auth_Session_Expired14Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Session_Expired14Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_session_expired14(inputs);
    }
  );
export { auth_session_expired14 as "auth_SESSION_EXPIRED" };
