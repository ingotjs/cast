/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Id_Token_Not_Supported19Inputs */

const en_auth_id_token_not_supported19 =
  /** @type {(inputs: Auth_Id_Token_Not_Supported19Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `id_token not supported`;
  };

/**
 * | output |
 * | --- |
 * | "id_token not supported" |
 *
 * @param {Auth_Id_Token_Not_Supported19Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_id_token_not_supported19 =
  /** @type {((inputs?: Auth_Id_Token_Not_Supported19Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Id_Token_Not_Supported19Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_id_token_not_supported19(inputs);
    }
  );
export { auth_id_token_not_supported19 as "auth_ID_TOKEN_NOT_SUPPORTED" };
