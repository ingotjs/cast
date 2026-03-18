/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Auth_Cross_Site_Navigation_Login_Blocked31Inputs */

const en_auth_cross_site_navigation_login_blocked31 =
  /** @type {(inputs: Auth_Cross_Site_Navigation_Login_Blocked31Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cross-site navigation login blocked. This request appears to be a CSRF attack.`;
  };

/**
 * | output |
 * | --- |
 * | "Cross-site navigation login blocked. This request appears to be a CSRF attack." |
 *
 * @param {Auth_Cross_Site_Navigation_Login_Blocked31Inputs} inputs
 * @param {{ locale?: "en" }} options
 * @returns {LocalizedString}
 */
const auth_cross_site_navigation_login_blocked31 =
  /** @type {((inputs?: Auth_Cross_Site_Navigation_Login_Blocked31Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Cross_Site_Navigation_Login_Blocked31Inputs, { locale?: "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      experimentalStaticLocale ?? options.locale ?? getLocale();
      return en_auth_cross_site_navigation_login_blocked31(inputs);
    }
  );
export { auth_cross_site_navigation_login_blocked31 as "auth_CROSS_SITE_NAVIGATION_LOGIN_BLOCKED" };
