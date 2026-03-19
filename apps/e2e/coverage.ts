/**
 * E2E Interactive Element Coverage
 *
 * Every user-interactive element must have a `data-testid` and be listed here.
 * Every entry must have a test covering it (`test` field).
 *
 * Grep for `test: null` to find coverage gaps.
 */

import { defineE2ECoverage, interactions } from "@packages/e2e-coverage";

// ---------------------------------------------------------------------------
// Test IDs
// ---------------------------------------------------------------------------

const testId = {
  header: {
    logo: "header-logo",
    navHome: "header-nav-home",
    navAbout: "header-nav-about",
    signinLink: "header-signin-link",
    themeToggle: "theme-toggle",
  },
  userMenu: {
    trigger: "user-menu-trigger",
    account: "user-menu-account",
    signout: "user-menu-signout",
  },
  footer: {
    faq: "footer-faq",
    privacy: "footer-privacy",
    terms: "footer-terms",
  },
  home: {
    userLink: "home-user-link",
    signinLink: "home-signin-link",
    aboutLink: "home-about-link",
  },
  authCard: {
    tabSignin: "auth-tab-signin",
    tabSignup: "auth-tab-signup",
    legalTerms: "auth-legal-terms",
    legalPrivacy: "auth-legal-privacy",
  },
  signin: {
    form: "signin-form",
    email: "signin-email",
    password: "signin-password",
    submit: "signin-submit",
    forgotPassword: "signin-forgot-password",
  },
  signup: {
    form: "signup-form",
    firstname: "signup-firstname",
    lastname: "signup-lastname",
    email: "signup-email",
    password: "signup-password",
    confirmPassword: "signup-confirm-password",
    submit: "signup-submit",
  },
  socialAuth: {
    google: "google-oauth-button",
  },
  magicLink: {
    email: "magic-link-email",
    submit: "magic-link-submit",
  },
  forgotPassword: {
    email: "forgot-password-email",
    submit: "forgot-password-submit",
    back: "forgot-password-back",
  },
  resetPassword: {
    password: "reset-password-password",
    confirm: "reset-password-confirm",
    submit: "reset-password-submit",
    back: "reset-password-back",
    requestNew: "reset-password-request-new",
  },
  updateProfile: {
    name: "update-profile-name",
    submit: "update-profile-submit",
  },
  changePassword: {
    form: "change-password-form",
    current: "change-password-current",
    new: "change-password-new",
    confirm: "change-password-confirm",
    submit: "change-password-submit",
  },
  sessions: {
    revoke: "session-revoke",
  },
  passkeys: {
    add: "passkey-add",
    delete: "passkey-delete",
  },
  deleteAccount: {
    trigger: "delete-account-trigger",
    form: "delete-account-form",
    password: "delete-account-password",
    confirm: "delete-account-confirm",
    cancel: "delete-account-cancel",
  },
  admin: {
    navMain: "admin-nav-main",
    navAnalytics: "admin-nav-analytics",
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
} as const;

// ---------------------------------------------------------------------------
// Shared Components
// ---------------------------------------------------------------------------

const t = testId;
const f = testFile;

const userMenu = interactions({
  [t.userMenu.trigger]: [
    { condition: "authenticated", visible: true, test: f.signOut },
    { condition: "unauthenticated", visible: false, test: f.signOut },
  ],
  [t.header.signinLink]: [
    { condition: "unauthenticated", visible: true, test: f.signOut },
    { condition: "authenticated", visible: false, test: f.signOut },
  ],
  [t.userMenu.account]: [{ context: null, expected: "navigates to /account", test: null }],
  [t.userMenu.signout]: [{ context: null, expected: "signs out, redirects to /", test: f.signOut }],
});

const header = interactions({
  [t.header.logo]: [{ context: null, expected: "navigates to /", test: null }],
  [t.header.navHome]: [{ context: null, expected: "navigates to /", test: null }],
  [t.header.navAbout]: [{ context: null, expected: "navigates to /about", test: null }],
  [t.header.themeToggle]: [{ context: null, expected: "cycles auto → dark → light → auto", test: null }],
});

const footer = interactions({
  [t.footer.faq]: [{ context: null, expected: "navigates to /faq", test: null }],
  [t.footer.privacy]: [{ context: null, expected: "navigates to /privacy", test: null }],
  [t.footer.terms]: [{ context: null, expected: "navigates to /terms", test: null }],
});

const socialAuth = interactions({
  [t.socialAuth.google]: [
    { condition: "googleOAuth enabled", visible: true, test: null },
    { condition: "googleOAuth disabled", visible: false, test: null },
    { context: null, expected: "initiates Google OAuth flow", test: null },
  ],
});

const magicLinkAuth = interactions({
  [t.magicLink.email]: [
    { condition: "magicLink enabled", visible: true, test: null },
    { condition: "magicLink disabled", visible: false, test: null },
  ],
  [t.magicLink.submit]: [
    { context: "valid email", expected: "sends magic link, shows confirmation", test: null },
    { context: "empty email", expected: "validation error", test: null },
  ],
});

const authCardTabs = interactions({
  [t.authCard.tabSignin]: [{ context: null, expected: "navigates to /auth/sign-in", test: null }],
  [t.authCard.tabSignup]: [{ context: null, expected: "navigates to /auth/sign-up", test: null }],
});

const authCardLegal = interactions({
  [t.authCard.legalTerms]: [{ context: null, expected: "navigates to /terms", test: null }],
  [t.authCard.legalPrivacy]: [{ context: null, expected: "navigates to /privacy", test: null }],
});

const deleteAccountModal = interactions({
  [t.deleteAccount.password]: [{ context: null, expected: "accepts password input", test: f.deleteAccount }],
  [t.deleteAccount.confirm]: [
    { context: "correct password", expected: "deletes account, redirects to /", test: f.deleteAccount },
    { context: "wrong password", expected: "shows error", test: null },
  ],
  [t.deleteAccount.cancel]: [{ context: null, expected: "hides confirmation form", test: null }],
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
        [t.home.userLink]: [
          { condition: "authenticated", visible: true, test: null },
          { context: null, expected: "navigates to /admin", test: null },
        ],
        [t.home.signinLink]: [
          { condition: "unauthenticated", visible: true, test: null },
          { context: null, expected: "navigates to /auth/sign-in", test: null },
        ],
        [t.home.aboutLink]: [{ context: null, expected: "navigates to /about", test: null }],
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
        [t.signin.email]: [{ context: null, expected: "accepts email input", test: f.signIn }],
        [t.signin.password]: [{ context: null, expected: "accepts password input", test: f.signIn }],
        [t.signin.submit]: [
          { context: "valid credentials", expected: "signs in, redirects to /", test: f.signIn },
          { context: "invalid credentials", expected: "stays on page, shows error", test: f.signIn },
          { context: "empty form", expected: "validation errors", test: f.signIn },
        ],
        [t.signin.forgotPassword]: [{ context: null, expected: "navigates to /auth/forgot-password", test: null }],
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
        [t.signup.firstname]: [{ context: null, expected: "accepts first name input", test: f.signUp }],
        [t.signup.lastname]: [{ context: null, expected: "accepts last name input", test: f.signUp }],
        [t.signup.email]: [{ context: null, expected: "accepts email input", test: f.signUp }],
        [t.signup.password]: [
          { context: null, expected: "accepts password input, shows requirements", test: f.signUp },
        ],
        [t.signup.confirmPassword]: [{ context: null, expected: "accepts confirm password input", test: f.signUp }],
        [t.signup.submit]: [
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
        [t.forgotPassword.email]: [{ context: null, expected: "accepts email input", test: null }],
        [t.forgotPassword.submit]: [
          { context: "valid email", expected: "sends reset link, shows confirmation", test: null },
          { context: "empty email", expected: "validation error", test: null },
        ],
        [t.forgotPassword.back]: [{ context: null, expected: "navigates to /auth/sign-in", test: null }],
      },
    },

    "/auth/reset-password": {
      interactions: {
        ...header,
        ...userMenu,
        ...footer,
        [t.resetPassword.password]: [
          { condition: "valid token", visible: true, test: null },
          { context: null, expected: "accepts new password input, shows requirements", test: null },
        ],
        [t.resetPassword.confirm]: [
          { condition: "valid token", visible: true, test: null },
          { context: null, expected: "accepts confirm password input", test: null },
        ],
        [t.resetPassword.submit]: [
          { condition: "valid token", visible: true, test: null },
          { context: "valid passwords", expected: "resets password, redirects to /auth/sign-in", test: null },
          { context: "password mismatch", expected: "validation error", test: null },
        ],
        [t.resetPassword.back]: [{ context: null, expected: "navigates to /auth/sign-in", test: null }],
        [t.resetPassword.requestNew]: [
          { condition: "invalid/missing token", visible: true, test: null },
          { context: null, expected: "navigates to /auth/forgot-password", test: null },
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
        [t.updateProfile.name]: [
          { context: null, expected: "accepts name input, pre-filled from session", test: null },
        ],
        [t.updateProfile.submit]: [
          { context: "valid name", expected: "updates profile, success toast", test: null },
          { context: "empty name", expected: "validation error", test: null },
        ],
        [t.changePassword.form]: [
          { condition: "password auth enabled", visible: true, test: f.changePassword },
          { condition: "password auth disabled", visible: false, test: null },
        ],
        [t.changePassword.current]: [
          { context: null, expected: "accepts current password input", test: f.changePassword },
        ],
        [t.changePassword.new]: [
          {
            context: null,
            expected: "accepts new password input, shows requirements",
            test: f.changePassword,
          },
        ],
        [t.changePassword.confirm]: [
          { context: null, expected: "accepts confirm password input", test: f.changePassword },
        ],
        [t.changePassword.submit]: [
          {
            context: "correct current password",
            expected: "changes password, success toast",
            test: f.changePassword,
          },
          { context: "wrong current password", expected: "shows error", test: f.changePassword },
        ],
        [t.sessions.revoke]: [{ context: null, expected: "revokes session, removes from list", test: null }],
        [t.passkeys.add]: [
          { condition: "passkey auth enabled", visible: true, test: null },
          { condition: "passkey auth disabled", visible: false, test: null },
          { context: null, expected: "initiates WebAuthn registration", test: null },
        ],
        [t.passkeys.delete]: [
          { condition: "passkey auth enabled", visible: true, test: null },
          { context: null, expected: "deletes passkey, removes from list", test: null },
        ],
        [t.deleteAccount.trigger]: [
          {
            context: null,
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
        [t.admin.navMain]: [{ context: null, expected: "navigates to /admin", test: null }],
        [t.admin.navAnalytics]: [{ context: null, expected: "navigates to /admin/analytics", test: null }],
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
