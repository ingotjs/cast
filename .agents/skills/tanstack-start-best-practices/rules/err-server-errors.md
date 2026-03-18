# err-server-errors: Handle Server Function Errors

## Priority: MEDIUM

## Explanation

Server function errors cross the network boundary. Handle them gracefully with appropriate error types, status codes, and user-friendly messages. Avoid exposing internal details in production.

## Bad Example

```tsx
// Throwing raw errors - exposes internals
export const createUser = createServerFn({ method: 'POST' })
  .validator(createUserSchema)
  .handler(async ({ data }) => {
    const user = await db.users.create({ data })  // May throw DB error
    return user
    // DB error with stack trace sent to client
  })
```

## Good Example: Structured Error Handling

```tsx
export const getPost = createServerFn()
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const post = await db.posts.findUnique({ where: { id: data.id } })

    if (!post) {
      // Use built-in notFound for 404s
      throw notFound()
    }

    return post
  })

export const createPost = createServerFn({ method: 'POST' })
  .validator(createPostSchema)
  .handler(async ({ data }) => {
    try {
      return await db.posts.create({ data })
    } catch (error) {
      // Log full error server-side
      console.error('Failed to create post:', error)
      // Return sanitized error to client
      setResponseStatus(500)
      throw new AppError('Failed to create post', 'INTERNAL_ERROR', 500)
    }
  })
```

## Error Response Best Practices

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Validation failed | 400 | Field-specific errors |
| Not authenticated | 401 | Redirect to login |
| Not authorized | 403 | Generic forbidden message |
| Resource not found | 404 | Use `notFound()` |
| Conflict (duplicate) | 409 | Specific conflict message |
| Server error | 500 | Generic message, log details |

## Context

- Use `notFound()` for 404 errors - integrates with router
- Use `redirect()` for auth-related errors
- Set status codes with `setResponseStatus()`
- Log full errors server-side, sanitize for client
- Validation errors from `.validator()` are automatic
