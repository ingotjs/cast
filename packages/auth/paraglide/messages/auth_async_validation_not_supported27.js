/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Async_Validation_Not_Supported27Inputs */

const en_auth_async_validation_not_supported27 =
  /** @type {(inputs: Auth_Async_Validation_Not_Supported27Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Async validation is not supported`;
  };

/**
 * | output |
 * | --- |
 * | "Async validation is not supported" |
 *
 * @param {Auth_Async_Validation_Not_Supported27Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_async_validation_not_supported27 =
  /** @type {((inputs?: Auth_Async_Validation_Not_Supported27Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Async_Validation_Not_Supported27Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_async_validation_not_supported27(inputs);
    }
  );
export { auth_async_validation_not_supported27 as "auth_ASYNC_VALIDATION_NOT_SUPPORTED" };
