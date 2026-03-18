/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Method_Not_Allowed_Defer_Session_Required36Inputs */

const en_auth_method_not_allowed_defer_session_required36 =
  /** @type {(inputs: Auth_Method_Not_Allowed_Defer_Session_Required36Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `POST method requires deferSessionRefresh to be enabled in session config`;
  };

/**
 * | output |
 * | --- |
 * | "POST method requires deferSessionRefresh to be enabled in session config" |
 *
 * @param {Auth_Method_Not_Allowed_Defer_Session_Required36Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_method_not_allowed_defer_session_required36 =
  /** @type {((inputs?: Auth_Method_Not_Allowed_Defer_Session_Required36Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Method_Not_Allowed_Defer_Session_Required36Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_method_not_allowed_defer_session_required36(inputs);
    }
  );
export { auth_method_not_allowed_defer_session_required36 as "auth_METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED" };
