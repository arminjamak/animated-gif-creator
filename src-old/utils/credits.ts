const FREE_CREDITS = 3;
const CREDITS_KEY = 'gif_creator_credits';
const USED_FREE_KEY = 'gif_creator_used_free';

export type CreditsInfo = {
  total: number;
  free: number;
  paid: number;
  isFree: boolean;
};

// Initialize credits on first load
export function initializeCredits(): void {
  const existing = localStorage.getItem(CREDITS_KEY);
  if (!existing) {
    const initialCredits = {
      free: FREE_CREDITS,
      paid: 0,
    };
    localStorage.setItem(CREDITS_KEY, JSON.stringify(initialCredits));
  }
}

// Get current credits
export function getCredits(): CreditsInfo {
  initializeCredits();
  
  const data = JSON.parse(localStorage.getItem(CREDITS_KEY) || '{"free":3,"paid":0}');
  const total = data.free + data.paid;
  
  return {
    total,
    free: data.free,
    paid: data.paid,
    isFree: data.paid === 0 && data.free > 0,
  };
}

// Use one credit
export function useCredit(): boolean {
  const credits = getCredits();
  
  if (credits.total <= 0) {
    return false; // No credits available
  }
  
  const data = JSON.parse(localStorage.getItem(CREDITS_KEY) || '{"free":3,"paid":0}');
  
  // Use free credits first
  if (data.free > 0) {
    data.free -= 1;
  } else if (data.paid > 0) {
    data.paid -= 1;
  }
  
  localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  return true;
}

// Add paid credits
export function addPaidCredits(amount: number): void {
  const data = JSON.parse(localStorage.getItem(CREDITS_KEY) || '{"free":3,"paid":0}');
  data.paid += amount;
  localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
}

// Get credits display text
export function getCreditsText(): string {
  const credits = getCredits();
  
  if (credits.total === 0) {
    return 'No generations left';
  }
  
  if (credits.isFree) {
    return `You have ${credits.free} free generation${credits.free === 1 ? '' : 's'} left`;
  }
  
  return `You have ${credits.total} generation${credits.total === 1 ? '' : 's'} left`;
}

// Check if user has credits
export function hasCredits(): boolean {
  return getCredits().total > 0;
}
