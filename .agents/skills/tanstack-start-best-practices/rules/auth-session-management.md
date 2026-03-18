# auth-session-management: Implement Secure Session Handling

## Priority: HIGH

## Explanation

Use HTTP-only cookies with secure settings to prevent XSS and CSRF attacks. Store minimal data in sessions and fetch user details on demand.

## Bad Example

```tsx
// Storing auth token in localStorage - XSS can steal this
function login(token: string) {
  localStorage.setItem('auth_token', token)
}

// Non-HTTP-only cookie - accessible to JavaScript
document.cookie = `session=${token}; path=/`
```

## Good Example: Secure Cookie Sessions

```tsx
// lib/session.server.ts
import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId: string
  email: string
  role: 'user' | 'admin'
}

export function getSessionData() {
  return useSession<SessionData>({
    password: process.env.SESSION_SECRET!,  // 32+ chars
    cookie: {
      httpOnly: true,        // No JavaScript access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',       // CSRF protection
      maxAge: 60 * 60 * 24 * 7,  // 7 days
    },
  })
}
```

## Key Principles

- **httpOnly: true** — blocks JavaScript access, mitigates XSS
- **secure: true** (production) — HTTPS-only transmission
- **sameSite: 'lax'** — CSRF protection
- **Store minimal data** — userId, email, role only; fetch details on demand
- **Strong secret** — 32+ character SESSION_SECRET
- Consider clearing sessions on password change

## Context

- Never store tokens in localStorage or sessionStorage
- Use server-side session validation for every protected request
- Implement role-based middleware for protected routes
