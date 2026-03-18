/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Email_Not_Verified16Inputs */

const en_auth_email_not_verified16 =
  /** @type {(inputs: Auth_Email_Not_Verified16Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email not verified`;
  };

/**
 * | output |
 * | --- |
 * | "Email not verified" |
 *
 * @param {Auth_Email_Not_Verified16Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_email_not_verified16 =
  /** @type {((inputs?: Auth_Email_Not_Verified16Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Email_Not_Verified16Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_email_not_verified16(inputs);
    }
  );
export { auth_email_not_verified16 as "auth_EMAIL_NOT_VERIFIED" };
