# OpenTelemetry Changelog

This is the source repository for [changelog.opentelemetry.io](https://changelog.opentelemetry.io), a website that tracks changes across OpenTelemetry repositories.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Testing

This project uses Playwright for end-to-end and visual regression testing.

To run tests:

```bash
# Install Playwright browsers and dependencies
npx playwright install --with-deps

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run only visual regression tests
npm run test:visual
```

Tests are located in the `tests` directory and are organized by feature. Visual regression tests automatically capture screenshots for comparison against baselines.

## License

Apache-2.0 - See [LICENSE](./LICENSE) for more information.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

### Maintainers

- [Austin Parker](https://github.com/austinlparker), Honeycomb
- [Trask Stalnaker](https://github.com/trask), Microsoft

For more information about the maintainer role, see the [community repository](https://github.com/open-telemetry/community/blob/main/guides/contributor/membership.md#maintainer).

### Approvers

- [Adriel Perkins](https://github.com/adrielp), Latrio

For more information about the approver role, see the [community repository](https://github.com/open-telemetry/community/blob/main/guides/contributor/membership.md#approver).
