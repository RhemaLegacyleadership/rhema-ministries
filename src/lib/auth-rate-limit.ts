const KEY_PREFIX = "auth_email_cooldown_until_";

const nowSeconds = () => Math.floor(Date.now() / 1000);

export const getRemainingCooldownSeconds = (action: string): number => {
  const raw = localStorage.getItem(`${KEY_PREFIX}${action}`);
  if (!raw) return 0;
  const until = Number(raw);
  if (!Number.isFinite(until) || until <= nowSeconds()) {
    localStorage.removeItem(`${KEY_PREFIX}${action}`);
    return 0;
  }
  return until - nowSeconds();
};

export const startCooldown = (action: string, seconds: number) => {
  const until = nowSeconds() + seconds;
  localStorage.setItem(`${KEY_PREFIX}${action}`, String(until));
};
