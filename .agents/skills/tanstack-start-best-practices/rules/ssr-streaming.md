# ssr-streaming: Implement Streaming SSR for Faster TTFB

## Priority: MEDIUM

## Explanation

Streaming SSR sends HTML chunks progressively instead of waiting for all data. Await only critical above-the-fold content in loaders; prefetch non-critical data and stream it with Suspense boundaries.

## Bad Example

```tsx
// Blocking on all data - slow TTFB
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const [user, stats, recentActivity, recommendations] = await Promise.all([
      getUser(),           // ~200ms - critical
      getStats(),          // ~500ms - secondary
      getRecentActivity(), // ~300ms - secondary
      getRecommendations() // ~800ms - not visible initially
    ])
    // Waits 800ms before sending ANY HTML
    return { user, stats, recentActivity, recommendations }
  },
})
```

## Good Example: Streaming with Suspense

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    // Await only critical, above-the-fold data
    const user = await getUser(context.userId)

    // Prefetch secondary data without blocking
    context.queryClient.prefetchQuery(statsQueryOptions(context.userId))
    context.queryClient.prefetchQuery(activityQueryOptions(context.userId))

    return { user }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useLoaderData()

  return (
    <div>
      {/* Critical content renders immediately */}
      <WelcomeBanner user={user} />

      {/* Secondary content streams in */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats userId={user.id} />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity userId={user.id} />
      </Suspense>
    </div>
  )
}
```

## Context

- Suspense boundaries define streaming chunks
- Await only critical data in loaders
- Use `prefetchQuery` for non-blocking secondary data
- Works with React 18's streaming SSR
- Monitor TTFB to verify effectiveness
- Nest ErrorBoundary with Suspense for independent error management
