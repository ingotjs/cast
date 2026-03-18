/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Verification_Email_Not_Enabled27Inputs */

const en_auth_verification_email_not_enabled27 =
  /** @type {(inputs: Auth_Verification_Email_Not_Enabled27Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Verification email isn't enabled`;
  };

/**
 * | output |
 * | --- |
 * | "Verification email isn't enabled" |
 *
 * @param {Auth_Verification_Email_Not_Enabled27Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_verification_email_not_enabled27 =
  /** @type {((inputs?: Auth_Verification_Email_Not_Enabled27Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Verification_Email_Not_Enabled27Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_verification_email_not_enabled27(inputs);
    }
  );
export { auth_verification_email_not_enabled27 as "auth_VERIFICATION_EMAIL_NOT_ENABLED" };
