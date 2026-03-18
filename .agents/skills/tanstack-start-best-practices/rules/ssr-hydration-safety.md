# ssr-hydration-safety: Prevent Hydration Mismatches

## Priority: MEDIUM

## Explanation

Hydration errors occur when server-rendered HTML doesn't match what the client expects. Avoid dynamic values, browser APIs, and time-based logic that differ between server and client.

## Bad Example

```tsx
// Dynamic values produce different results on server vs client
function Greeting() {
  return <p>Current time: {Date.now()}</p>  // Different on server and client!
}

// Browser APIs fail during SSR
function UserLocation() {
  const width = window.innerWidth  // window undefined on server
  return <p>Width: {width}</p>
}
```

## Good Example: Pass Data Through Loaders

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    return {
      serverTime: new Date().toISOString(),
      // Compute on server, send to client — consistent
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { serverTime } = Route.useLoaderData()
  return <p>Loaded at: {serverTime}</p>
}
```

## Good Example: Client-Only Code

```tsx
function MapView() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)  // Only true after hydration
  }, [])

  if (!mounted) return <MapSkeleton />

  // Safe to use browser APIs after hydration
  return <InteractiveMap center={[lat, lng]} />
}
```

## Good Example: Lazy Load Client-Only Components

```tsx
const Chart = lazy(() => import('./Chart'))

function DashboardStats() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <Chart data={data} />
    </Suspense>
  )
}
```

## Context

- Never use `Date.now()`, `Math.random()`, or `window`/`document` in render
- Pass dynamic values through loaders for consistency
- Wrap client-only components in `useEffect` or `lazy`/`Suspense`
- Format dates on the server with consistent timezones, or defer to client after hydration
- Use `suppressHydrationWarning` sparingly as a last resort
