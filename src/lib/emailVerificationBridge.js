/**
 * Module-level bridge that lets the Axios response interceptor
 * (which runs outside React) trigger the global email-verification modal
 * (which lives inside the React tree) and await its result.
 *
 * Usage:
 *   - EmailVerificationProvider sets `emailVerificationBridge.trigger`
 *     to a function that opens the modal and returns a Promise<boolean>.
 *   - Axios interceptors call `promptEmailVerification()` and await `true`
 *     (verified) or `false` (dismissed / provider not mounted yet).
 */
export const emailVerificationBridge = {
  /** @type {((resolve: (verified: boolean) => void) => void) | null} */
  trigger: null,
};

/**
 * Ask the user to verify their email via the global modal.
 * Resolves to `true` when OTP is accepted, `false` when the modal is
 * closed/cancelled or when the provider is not yet mounted.
 *
 * @returns {Promise<boolean>}
 */
export function promptEmailVerification() {
  if (typeof emailVerificationBridge.trigger !== "function") {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    emailVerificationBridge.trigger(resolve);
  });
}
