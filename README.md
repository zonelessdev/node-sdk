# Zoneless Node.js SDK

The official Node.js SDK for the [Zoneless](https://zoneless.com) API — an open-source Stripe Connect Express alternative that uses USDC on Solana for payouts.

## Installation

```bash
npm install @zoneless/node
```

## Usage

```typescript
import { Zoneless } from '@zoneless/node';

const zoneless = new Zoneless('sk_live_z_YOUR_API_KEY', 'https://api.yourdomain.com');

// Create a connected account
const account = await zoneless.accounts.create({
  country: 'US',
  email: 'seller@example.com',
  controller: {
    fees: { payer: 'application' },
    losses: { payments: 'application' },
    zoneless_dashboard: { type: 'express' },
  },
});

console.log(account.id); // acct_...
```

## Documentation

Full API documentation is available at [zoneless.com/docs](https://zoneless.com/docs).

## License

[MIT](LICENSE)
