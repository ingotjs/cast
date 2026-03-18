/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Email_Already_Verified20Inputs */

const en_auth_email_already_verified20 =
  /** @type {(inputs: Auth_Email_Already_Verified20Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email is already verified`;
  };

/**
 * | output |
 * | --- |
 * | "Email is already verified" |
 *
 * @param {Auth_Email_Already_Verified20Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_email_already_verified20 =
  /** @type {((inputs?: Auth_Email_Already_Verified20Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Email_Already_Verified20Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_email_already_verified20(inputs);
    }
  );
export { auth_email_already_verified20 as "auth_EMAIL_ALREADY_VERIFIED" };
