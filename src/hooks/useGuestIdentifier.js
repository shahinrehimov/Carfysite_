import { useGuest } from '@/providers/GuestProvider';

/**
 * Hook to access guest identifier and related functions
 * @returns {Object} Guest identifier state and functions
 */
export function useGuestIdentifier() {
  const { guestIdentifier, isLoading, initializeGuest } = useGuest();

  return {
    guestIdentifier,
    isLoading,
    initializeGuest,
    hasIdentifier: !!guestIdentifier,
  };
}

export default useGuestIdentifier;

