/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_You_Are_Not_Allowed_To_Register_This_Passkey37Inputs */

const en_auth_you_are_not_allowed_to_register_this_passkey37 =
  /** @type {(inputs: Auth_You_Are_Not_Allowed_To_Register_This_Passkey37Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `You are not allowed to register this passkey`;
  };

/**
 * | output |
 * | --- |
 * | "You are not allowed to register this passkey" |
 *
 * @param {Auth_You_Are_Not_Allowed_To_Register_This_Passkey37Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_you_are_not_allowed_to_register_this_passkey37 =
  /** @type {((inputs?: Auth_You_Are_Not_Allowed_To_Register_This_Passkey37Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_You_Are_Not_Allowed_To_Register_This_Passkey37Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_you_are_not_allowed_to_register_this_passkey37(inputs);
    }
  );
export { auth_you_are_not_allowed_to_register_this_passkey37 as "auth_YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY" };
