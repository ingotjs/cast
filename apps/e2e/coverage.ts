/**
 * E2E Interactive Element Coverage
 *
 * Every user-interactive element must have a `data-testid` and be listed here.
 * Every entry must have a test covering it (`test` field).
 *
 * Grep for `test: null` to find coverage gaps.
 */

import { defineE2ECoverage, interactions } from "@ingot/prospect";

// ---------------------------------------------------------------------------
// Test IDs
// ---------------------------------------------------------------------------

const testId = {
  header: {
    linkLogo: "header-link-logo",
    linkHome: "header-link-home",
    linkAbout: "header-link-about",
    linkSignin: "header-link-signin",
    buttonThemeToggle: "header-button-theme-toggle",
    localeSwitcherTrigger: "locale-switcher-button-trigger",
    localeSwitcherItemEn: "locale-switcher-item-en",
  },
  userMenu: {
    buttonTrigger: "user-menu-button-trigger",
    buttonAccount: "user-menu-button-account",
    buttonSignout: "user-menu-button-signout",
  },
  footer: {
    linkFaq: "footer-link-faq",
    linkPrivacy: "footer-link-privacy",
    linkTerms: "footer-link-terms",
  },
  home: {
    linkUser: "home-link-user",
    linkSignin: "home-link-signin",
    linkAbout: "home-link-about",
  },
  authCard: {
    linkTabSignin: "auth-link-tab-signin",
    linkTabSignup: "auth-link-tab-signup",
    linkLegalTerms: "auth-link-legal-terms",
    linkLegalPrivacy: "auth-link-legal-privacy",
  },
  signin: {
    inputEmail: "signin-input-email",
    inputPassword: "signin-input-password",
    buttonSubmit: "signin-button-submit",
    linkForgotPassword: "signin-link-forgot-password",
  },
  signup: {
    inputFirstname: "signup-input-firstname",
    inputLastname: "signup-input-lastname",
    inputEmail: "signup-input-email",
    inputPassword: "signup-input-password",
    inputConfirmPassword: "signup-input-confirm-password",
    buttonSubmit: "signup-button-submit",
  },
  socialAuth: {
    buttonGoogle: "social-auth-button-google",
  },
  magicLink: {
    inputEmail: "magic-link-input-email",
    buttonSubmit: "magic-link-button-submit",
  },
  forgotPassword: {
    inputEmail: "forgot-password-input-email",
    buttonSubmit: "forgot-password-button-submit",
    linkBack: "forgot-password-link-back",
  },
  resetPassword: {
    inputPassword: "reset-password-input-password",
    inputConfirm: "reset-password-input-confirm",
    buttonSubmit: "reset-password-button-submit",
    linkBack: "reset-password-link-back",
    linkRequestNew: "reset-password-link-request-new",
  },
  updateProfile: {
    inputName: "update-profile-input-name",
    buttonSubmit: "update-profile-button-submit",
  },
  changePassword: {
    inputCurrent: "change-password-input-current",
    inputNew: "change-password-input-new",
    inputConfirm: "change-password-input-confirm",
    buttonSubmit: "change-password-button-submit",
  },
  sessions: {
    buttonRevoke: "session-button-revoke",
  },
  passkeys: {
    buttonAdd: "passkey-button-add",
    buttonDelete: "passkey-button-delete",
  },
  deleteAccount: {
    buttonTrigger: "delete-account-button-trigger",
    inputPassword: "delete-account-input-password",
    buttonConfirm: "delete-account-button-confirm",
    buttonCancel: "delete-account-button-cancel",
  },
  admin: {
    linkMain: "admin-link-main",
    linkAnalytics: "admin-link-analytics",
  },
} as const;

// ---------------------------------------------------------------------------
// Test Files
// ---------------------------------------------------------------------------

const testFile = {
  signIn: "auth/sign-in.e2e.ts",
  signUp: "auth/sign-up.e2e.ts",
  signOut: "auth/sign-out.e2e.ts",
  changePassword: "auth/change-password.e2e.ts",
  deleteAccount: "auth/delete-account.e2e.ts",
  localeSwitcher: "locale-switcher.e2e.ts",
} as const;

// ---------------------------------------------------------------------------
// Shared Components
// ---------------------------------------------------------------------------

const t = testId;
const f = testFile;

const userMenu = interactions({
  [t.userMenu.buttonTrigger]: [
    { condition: "authenticated", visible: true, test: f.signOut },
    { condition: "unauthenticated", visible: false, test: f.signOut },
  ],
  [t.header.linkSignin]: [
    { condition: "unauthenticated", visible: true, test: f.signOut },
    { condition: "authenticated", visible: false, test: f.signOut },
  ],
  [t.userMenu.buttonAccount]: [{ expected: "navigates to /account", test: null }],
  [t.userMenu.buttonSignout]: [{ expected: "signs out, redirects to /", test: f.signOut }],
});

const header = interactions({
  [t.header.linkLogo]: [{ expected: "navigates to /", test: null }],
  [t.header.linkHome]: [{ expected: "navigates to /", test: null }],
  [t.header.linkAbout]: [{ expected: "navigates to /about", test: null }],
  [t.header.buttonThemeToggle]: [{ expected: "cycles auto → dark → light → auto", test: null }],
  [t.header.localeSwitcherTrigger]: [{ expected: "opens locale dropdown", test: f.localeSwitcher }],
  [t.header.localeSwitcherItemEn]: [{ expected: "selects English locale", test: f.localeSwitcher }],
});

const footer = interactions({
  [t.footer.linkFaq]: [{ expected: "navigates to /faq", test: null }],
  [t.footer.linkPrivacy]: [{ expected: "navigates to /privacy", test: null }],
  [t.footer.linkTerms]: [{ expected: "navigates to /terms", test: null }],
});

const socialAuth = interactions({
  [t.socialAuth.buttonGoogle]: [
    { condition: "googleOAuth enabled", visible: true, test: null },
    { condition: "googleOAuth disabled", visible: false, test: null },
    { expected: "initiates Google OAuth flow", test: null },
  ],
});

const magicLinkAuth = interactions({
  [t.magicLink.inputEmail]: [
    { condition: "magicLink enabled", visible: true, test: null },
    { condition: "magicLink disabled", visible: false, test: null },
  ],
  [t.magicLink.buttonSubmit]: [
    { context: "valid email", expected: "sends magic link, shows confirmation", test: null },
    { context: "empty email", expected: "validation error", test: null },
  ],
});

const authCardTabs = interactions({
  [t.authCard.linkTabSignin]: [{ expected: "navigates to /auth/sign-in", test: null }],
  [t.authCard.linkTabSignup]: [{ expected: "navigates to /auth/sign-up", test: null }],
});

const authCardLegal = interactions({
  [t.authCard.linkLegalTerms]: [{ expected: "navigates to /terms", test: null }],
  [t.authCard.linkLegalPrivacy]: [{ expected: "navigates to /privacy", test: null }],
});

const deleteAccountModal = interactions({
  [t.deleteAccount.inputPassword]: [{ expected: "accepts password input", test: f.deleteAccount }],
  [t.deleteAccount.buttonConfirm]: [
    { context: "correct password", expected: "deletes account, redirects to /", test: f.deleteAccount },
    { context: "wrong password", expected: "shows error", test: null },
  ],
  [t.deleteAccount.buttonCancel]: [{ expected: "hides confirmation form", test: null }],
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const e2e = defineE2ECoverage({
  testId,
  routes: {
    "/": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.home.linkUser]: [
          { condition: "authenticated", visible: true, test: null },
          { expected: "navigates to /admin", test: null },
        ],
        [t.home.linkSignin]: [
          { condition: "unauthenticated", visible: true, test: null },
          { expected: "navigates to /auth/sign-in", test: null },
        ],
        [t.home.linkAbout]: [{ expected: "navigates to /about", test: null }],
      },
    },

    "/auth/sign-in": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        ...authCardTabs,
        ...authCardLegal,
        ...socialAuth,
        ...magicLinkAuth,
        [t.signin.inputEmail]: [{ expected: "accepts email input", test: f.signIn }],
        [t.signin.inputPassword]: [{ expected: "accepts password input", test: f.signIn }],
        [t.signin.buttonSubmit]: [
          { context: "valid credentials", expected: "signs in, redirects to /", test: f.signIn },
          { context: "invalid credentials", expected: "stays on page, shows error", test: f.signIn },
          { context: "empty form", expected: "validation errors", test: f.signIn },
        ],
        [t.signin.linkForgotPassword]: [{ expected: "navigates to /auth/forgot-password", test: null }],
      },
    },

    "/auth/sign-up": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        ...authCardTabs,
        ...authCardLegal,
        ...socialAuth,
        ...magicLinkAuth,
        [t.signup.inputFirstname]: [{ expected: "accepts first name input", test: f.signUp }],
        [t.signup.inputLastname]: [{ expected: "accepts last name input", test: f.signUp }],
        [t.signup.inputEmail]: [{ expected: "accepts email input", test: f.signUp }],
        [t.signup.inputPassword]: [{ expected: "accepts password input, shows requirements", test: f.signUp }],
        [t.signup.inputConfirmPassword]: [{ expected: "accepts confirm password input", test: f.signUp }],
        [t.signup.buttonSubmit]: [
          { context: "valid form", expected: "creates account, redirects to /", test: f.signUp },
          { context: "empty form", expected: "validation errors", test: f.signUp },
          { context: "password mismatch", expected: "validation error", test: f.signUp },
        ],
      },
    },

    "/auth/forgot-password": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.forgotPassword.inputEmail]: [{ expected: "accepts email input", test: null }],
        [t.forgotPassword.buttonSubmit]: [
          { context: "valid email", expected: "sends reset link, shows confirmation", test: null },
          { context: "empty email", expected: "validation error", test: null },
        ],
        [t.forgotPassword.linkBack]: [{ expected: "navigates to /auth/sign-in", test: null }],
      },
    },

    "/auth/reset-password": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.resetPassword.inputPassword]: [
          { condition: "valid token", visible: true, test: null },
          { expected: "accepts new password input, shows requirements", test: null },
        ],
        [t.resetPassword.inputConfirm]: [
          { condition: "valid token", visible: true, test: null },
          { expected: "accepts confirm password input", test: null },
        ],
        [t.resetPassword.buttonSubmit]: [
          { condition: "valid token", visible: true, test: null },
          { context: "valid passwords", expected: "resets password, redirects to /auth/sign-in", test: null },
          { context: "password mismatch", expected: "validation error", test: null },
        ],
        [t.resetPassword.linkBack]: [{ expected: "navigates to /auth/sign-in", test: null }],
        [t.resetPassword.linkRequestNew]: [
          { condition: "invalid/missing token", visible: true, test: null },
          { expected: "navigates to /auth/forgot-password", test: null },
        ],
      },
    },

    "/account": {
      access: {
        authenticated: { expected: "renders page", test: null },
        unauthenticated: { expected: "redirects to /auth/sign-in", test: null },
      },
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.updateProfile.inputName]: [{ expected: "accepts name input, pre-filled from session", test: null }],
        [t.updateProfile.buttonSubmit]: [
          { context: "valid name", expected: "updates profile, success toast", test: null },
          { context: "empty name", expected: "validation error", test: null },
        ],
        [t.changePassword.inputCurrent]: [{ expected: "accepts current password input", test: f.changePassword }],
        [t.changePassword.inputNew]: [
          {
            expected: "accepts new password input, shows requirements",
            test: f.changePassword,
          },
        ],
        [t.changePassword.inputConfirm]: [{ expected: "accepts confirm password input", test: f.changePassword }],
        [t.changePassword.buttonSubmit]: [
          {
            context: "correct current password",
            expected: "changes password, success toast",
            test: f.changePassword,
          },
          { context: "wrong current password", expected: "shows error", test: f.changePassword },
        ],
        [t.sessions.buttonRevoke]: [{ expected: "revokes session, removes from list", test: null }],
        [t.passkeys.buttonAdd]: [
          { condition: "passkey auth enabled", visible: true, test: null },
          { condition: "passkey auth disabled", visible: false, test: null },
          { expected: "initiates WebAuthn registration", test: null },
        ],
        [t.passkeys.buttonDelete]: [
          { condition: "passkey auth enabled", visible: true, test: null },
          { expected: "deletes passkey, removes from list", test: null },
        ],
        [t.deleteAccount.buttonTrigger]: [
          {
            expected: "reveals confirmation form",
            test: f.deleteAccount,
            reveals: deleteAccountModal,
          },
        ],
      },
    },

    "/admin": {
      access: {
        admin: { expected: "renders page", test: null },
        user: { expected: "redirects to /", test: null },
        unauthenticated: { expected: "redirects to /auth/sign-in", test: null },
      },
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.admin.linkMain]: [{ expected: "navigates to /admin", test: null }],
        [t.admin.linkAnalytics]: [{ expected: "navigates to /admin/analytics", test: null }],
      },
    },

    "/admin/analytics": {
      access: {
        admin: { expected: "renders page", test: null },
        user: { expected: "redirects to /", test: null },
        unauthenticated: { expected: "redirects to /auth/sign-in", test: null },
      },
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
      },
    },
  },
});

export { testId, testFile };
export const { routes, setup } = e2e;

// ---------------------------------------------------------------------------
// Email Notifications
// ---------------------------------------------------------------------------

export const notifications = {
  verification: { trigger: "sign up with email/password", subjectKeyword: "verif", test: f.signUp },
  passwordChanged: { trigger: "change password", subjectKeyword: "password", test: f.changePassword },
  accountDeleted: { trigger: "delete account", subjectKeyword: "deleted", test: f.deleteAccount },
  welcome: { trigger: "new user created", subjectKeyword: "welcome", test: null },
  passwordReset: { trigger: "forgot password flow", subjectKeyword: "reset", test: null },
  magicLink: { trigger: "magic link requested", subjectKeyword: "magic", test: null },
} as const;
