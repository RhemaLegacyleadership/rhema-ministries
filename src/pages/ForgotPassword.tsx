import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getFriendlyAuthError, isEmailRateLimitError } from "@/lib/auth-errors";
import { getRemainingCooldownSeconds, startCooldown } from "@/lib/auth-rate-limit";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setCooldown(getRemainingCooldownSeconds("forgot-password"));
    const timer = window.setInterval(() => {
      setCooldown(getRemainingCooldownSeconds("forgot-password"));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can request another reset email in ${cooldown}s.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      startCooldown("forgot-password", 60);
      setCooldown(getRemainingCooldownSeconds("forgot-password"));
      toast({
        title: "Email sent!",
        description: "Check your inbox for a password reset link.",
      });
    } catch (error: any) {
      if (isEmailRateLimitError(error)) {
        startCooldown("forgot-password", 180);
        setCooldown(getRemainingCooldownSeconds("forgot-password"));
      }
      toast({
        title: "Error",
        description: getFriendlyAuthError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-navy-800" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Rhema Fits</h1>
              <p className="text-xs text-muted-foreground">School of Ministry</p>
            </div>
          </Link>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Check Your Email</h2>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Forgot Password?</h2>
              <p className="text-muted-foreground">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || cooldown > 0}>
                {isLoading ? "Sending..." : cooldown > 0 ? `Try again in ${cooldown}s` : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
