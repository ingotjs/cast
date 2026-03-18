/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Body_Must_Be_An_Object18Inputs */

const en_auth_body_must_be_an_object18 =
  /** @type {(inputs: Auth_Body_Must_Be_An_Object18Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Body must be an object`;
  };

/**
 * | output |
 * | --- |
 * | "Body must be an object" |
 *
 * @param {Auth_Body_Must_Be_An_Object18Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_body_must_be_an_object18 =
  /** @type {((inputs?: Auth_Body_Must_Be_An_Object18Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Body_Must_Be_An_Object18Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_body_must_be_an_object18(inputs);
    }
  );
export { auth_body_must_be_an_object18 as "auth_BODY_MUST_BE_AN_OBJECT" };
