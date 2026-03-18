/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Invalid_Token12Inputs */

const en_auth_invalid_token12 =
  /** @type {(inputs: Auth_Invalid_Token12Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invalid token`;
  };

/**
 * | output |
 * | --- |
 * | "Invalid token" |
 *
 * @param {Auth_Invalid_Token12Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_invalid_token12 =
  /** @type {((inputs?: Auth_Invalid_Token12Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Invalid_Token12Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_invalid_token12(inputs);
    }
  );
export { auth_invalid_token12 as "auth_INVALID_TOKEN" };
