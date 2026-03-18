# auth-route-protection: Protect Routes with beforeLoad

## Priority: HIGH

## Explanation

Use `beforeLoad` in route definitions to check authentication before the route loads. This prevents unauthorized access, redirects to login, and can extend context with user data for child routes.

## Bad Example

```tsx
// Checking auth in component - too late, data may have loaded
function DashboardPage() {
  const user = useAuth()

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' })  // Redirect after render
    }
  }, [user])

  if (!user) return null  // Flash of content possible

  return <Dashboard user={user} />
}
```

## Good Example: Route-Level Protection

```tsx
// routes/_authenticated.tsx - Layout route for protected area
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getSessionData()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    // Extend context with user for all child routes
    return {
      user: session,
    }
  },
  component: AuthenticatedLayout,
})
```

## Good Example: Role-Based Access

```tsx
// routes/_admin.tsx
export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context }) => {
    if (context.user.role !== 'admin') {
      throw redirect({ to: '/unauthorized' })
    }
  },
  component: AdminLayout,
})
```

## Good Example: Preserving Redirect URL

```tsx
// In protected routes
beforeLoad: async ({ location }) => {
  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }
}

// In login page
function LoginPage() {
  const { redirect } = Route.useSearch()
  // After login success: navigate({ to: redirect ?? '/dashboard' })
}
```

## Context

- `beforeLoad` runs before route loading begins
- Throwing `redirect()` prevents route from loading
- Context from `beforeLoad` flows to loader and component
- Child routes inherit parent's `beforeLoad` protection
- Use pathless layout routes (`_authenticated.tsx`) for grouped protection
- Store redirect URL in search params for post-login navigation
