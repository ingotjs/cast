/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Token_Expired12Inputs */

const en_auth_token_expired12 =
  /** @type {(inputs: Auth_Token_Expired12Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Token expired`;
  };

/**
 * | output |
 * | --- |
 * | "Token expired" |
 *
 * @param {Auth_Token_Expired12Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_token_expired12 =
  /** @type {((inputs?: Auth_Token_Expired12Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Token_Expired12Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_token_expired12(inputs);
    }
  );
export { auth_token_expired12 as "auth_TOKEN_EXPIRED" };
