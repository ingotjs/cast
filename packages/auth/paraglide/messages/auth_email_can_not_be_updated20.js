/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Email_Can_Not_Be_Updated20Inputs */

const en_auth_email_can_not_be_updated20 =
  /** @type {(inputs: Auth_Email_Can_Not_Be_Updated20Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email can not be updated`;
  };

/**
 * | output |
 * | --- |
 * | "Email can not be updated" |
 *
 * @param {Auth_Email_Can_Not_Be_Updated20Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_email_can_not_be_updated20 =
  /** @type {((inputs?: Auth_Email_Can_Not_Be_Updated20Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Email_Can_Not_Be_Updated20Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_email_can_not_be_updated20(inputs);
    }
  );
export { auth_email_can_not_be_updated20 as "auth_EMAIL_CAN_NOT_BE_UPDATED" };
