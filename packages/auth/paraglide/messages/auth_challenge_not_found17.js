/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Challenge_Not_Found17Inputs */

const en_auth_challenge_not_found17 =
  /** @type {(inputs: Auth_Challenge_Not_Found17Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Challenge not found`;
  };

/**
 * | output |
 * | --- |
 * | "Challenge not found" |
 *
 * @param {Auth_Challenge_Not_Found17Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_challenge_not_found17 =
  /** @type {((inputs?: Auth_Challenge_Not_Found17Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Challenge_Not_Found17Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_challenge_not_found17(inputs);
    }
  );
export { auth_challenge_not_found17 as "auth_CHALLENGE_NOT_FOUND" };
