# api-routes: Create Server Routes for External Consumers

## Priority: MEDIUM

## Explanation

While server functions are ideal for internal RPC, server routes provide traditional REST endpoints for external consumers, webhooks, and integrations. Use server routes when you need standard HTTP semantics, custom response formats, or third-party compatibility.

## Bad Example

```tsx
// Using server functions for webhook endpoints
export const stripeWebhook = createServerFn({ method: 'POST' })
  .handler(async ({ request }) => {
    // Server functions aren't designed for raw request handling
    // No easy access to raw body for signature verification
  })
```

## Good Example: Webhook Handler

```tsx
// routes/api/webhooks/stripe.ts
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('stripe-signature')
        if (!signature) {
          return new Response('Missing signature', { status: 400 })
        }

        const rawBody = await request.text()
        let event: Stripe.Event
        try {
          event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
        } catch {
          return new Response('Invalid signature', { status: 400 })
        }

        switch (event.type) {
          case 'checkout.session.completed':
            await handleCheckoutComplete(event.data.object)
            break
        }

        return new Response('OK', { status: 200 })
      },
    },
  },
})
```

## Server Functions vs Server Routes

| Feature | Server Functions | Server Routes |
|---------|-----------------|--------------|
| Primary use | Internal RPC | External consumers |
| Type safety | Full end-to-end | Manual |
| Response format | JSON (automatic) | Any (manual) |
| Raw request access | Limited | Full |
| URL structure | Auto-generated | Explicit paths |
| Webhooks | Not ideal | Designed for |

## Context

- Server routes use `createFileRoute` with a `server.handlers` property
- Support all HTTP methods: GET, POST, PUT, PATCH, DELETE
- Use `json()` helper for JSON responses, `Response` for custom formats
- Ideal for: webhooks, public APIs, file downloads, third-party integrations
