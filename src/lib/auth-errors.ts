type AuthLikeError = {
  message?: string;
  status?: number;
  code?: string;
  name?: string;
};

export const isEmailRateLimitError = (error: AuthLikeError | null | undefined): boolean => {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  const code = (error.code || "").toLowerCase();

  return (
    message.includes("email rate limit exceeded") ||
    message.includes("email rate exceeded") ||
    message.includes("over_email_send_rate_limit") ||
    code.includes("over_email_send_rate_limit")
  );
};

export const getFriendlyAuthError = (error: AuthLikeError | null | undefined): string => {
  if (!error) return "Something went wrong. Please try again.";

  const message = (error.message || "").toLowerCase();

  if (isEmailRateLimitError(error)) {
    return "Too many email requests were sent recently. Please wait a few minutes and try again.";
  }

  if (message.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (message.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Please check your inbox for the confirmation link.";
  }

  if (message.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (message.includes("password should be at least")) {
    return "Password is too weak. Please choose a stronger password.";
  }

  if (message.includes("network") || error.status === 0) {
    return "Network issue detected. Please check your internet connection and try again.";
  }

  return error.message || "Something went wrong. Please try again.";
};
