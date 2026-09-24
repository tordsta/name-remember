// Integrations without credentials run mocked (see src/lib/mocks), so the app
// works end to end without third-party accounts. A mock is never used when
// its key is set.
//
// Only `slack` is reliable in the browser: NEXT_PUBLIC_ vars are inlined into
// client bundles, the other keys only exist on the server.
export const mocked = {
  postmark: !process.env.POSTMARK_API_KEY,
  stripe: !process.env.STRIPE_SECRET_KEY,
  slack: !process.env.NEXT_PUBLIC_SLACK_ID,
};

export function logMockedIntegrations() {
  const names = Object.entries(mocked)
    .filter(([, isMocked]) => isMocked)
    .map(([name]) => name);
  console.log(
    names.length > 0
      ? `[mock] ${names.join(", ")}`
      : "[mock] none, all integrations are live"
  );
}
