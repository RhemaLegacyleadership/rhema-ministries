import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import rhemaLogo from "@/assets/rhema-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { getAccessContext } from "@/lib/portal";
import { getFriendlyAuthError } from "@/lib/auth-errors";

const ensureAdmissionApplication = async (user: any) => {
  const { data: existing, error: selectError } = await supabase
    .from("admission_applications")
    .select("id")
    .eq("student_id", user.id)
    .limit(1);

  if (selectError || (existing && existing.length > 0)) return;

  const program = user.user_metadata?.program || "certificate";
  const specialization = user.user_metadata?.specialization || null;

  await supabase.from("admission_applications").insert({
    student_id: user.id,
    program,
    specialization,
    status: "pending",
  });
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error(
          "Authentication is not configured for this deployment. Ask the site admin to set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Login succeeded but user session is missing.");
      }

      const access = await getAccessContext(userId, data.user?.app_metadata?.role);

      if (access.role === "teacher" && !access.teacherAccessGranted) {
        await supabase.auth.signOut();
        toast({
          title: "Access pending",
          description: "Your teacher account is waiting for admin approval.",
          variant: "destructive",
        });
        return;
      }

      if (access.role === "student" && data.user) {
        await ensureAdmissionApplication(data.user);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      if (access.role === "admin") {
        navigate("/admin/dashboard");
      } else if (access.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: getFriendlyAuthError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/50 to-transparent" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={rhemaLogo} alt="Rhema Fits Bible College" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-gold-50">Rhema Fits</h1>
            <p className="text-xs text-gold-200/70">School of Ministry</p>
          </div>
        </Link>

        <div className="relative z-10">
          <blockquote className="text-2xl font-serif text-gold-50 italic mb-4">
            "Taking you from where you are to where you should be"
          </blockquote>
          <p className="text-gold-200/70">- Rhema Fits Ministries</p>
        </div>

        <div className="relative z-10 text-gold-200/50 text-sm">
          © {new Date().getFullYear()} Rhema Fits Ministries
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={rhemaLogo} alt="Rhema Fits Bible College" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-foreground">Rhema Fits</h1>
                <p className="text-xs text-muted-foreground">School of Ministry</p>
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Apply Now
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
