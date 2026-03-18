/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Email_Mismatch13Inputs */

const en_auth_email_mismatch13 =
  /** @type {(inputs: Auth_Email_Mismatch13Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email mismatch`;
  };

/**
 * | output |
 * | --- |
 * | "Email mismatch" |
 *
 * @param {Auth_Email_Mismatch13Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_email_mismatch13 =
  /** @type {((inputs?: Auth_Email_Mismatch13Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Email_Mismatch13Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_email_mismatch13(inputs);
    }
  );
export { auth_email_mismatch13 as "auth_EMAIL_MISMATCH" };
