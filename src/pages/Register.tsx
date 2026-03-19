import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import rhemaLogo from "@/assets/rhema-logo.png";
import { getFriendlyAuthError, isEmailRateLimitError } from "@/lib/auth-errors";
import { getRemainingCooldownSeconds, startCooldown } from "@/lib/auth-rate-limit";

const SPECIALIZATIONS = [
  "Mission/Evangelism",
  "Christian Education",
  "Pastoral Care and Counselling",
  "Biblical Studies and Theology",
];

const PROGRAMS_WITH_SPECIALIZATIONS = ["degree", "masters"];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    program: "",
    specialization: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasSpecialization = PROGRAMS_WITH_SPECIALIZATIONS.includes(formData.program);

  useEffect(() => {
    setCooldown(getRemainingCooldownSeconds("signup"));
    const timer = window.setInterval(() => {
      setCooldown(getRemainingCooldownSeconds("signup"));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset specialization when program changes to one without specializations
      if (field === "program" && !PROGRAMS_WITH_SPECIALIZATIONS.includes(value)) {
        updated.specialization = "";
      }
      return updated;
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can try again in ${cooldown}s.`,
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            program: formData.program,
            specialization: formData.specialization || null,
          },
        },
      });

      if (error) throw error;

      // Supabase can return an obfuscated existing user if signup is attempted again.
      const identitiesCount = Array.isArray(data.user?.identities) ? data.user.identities.length : 1;
      if (data.user && identitiesCount === 0) {
        toast({
          title: "Account already exists",
          description: "This email is already registered. Please sign in instead.",
        });
        navigate("/login");
        return;
      }

      // If email confirmation is enabled, Supabase may return no active session at signup.
      // In that case, inserting into a user-scoped table can fail due to RLS.
      if (data.user && data.session) {
        const { error: applicationError } = await supabase.from("admission_applications").insert({
          student_id: data.user.id,
          program: formData.program,
          specialization: formData.specialization || null,
          status: "pending",
        });

        if (applicationError) {
          // Do not block account creation flow if application insert fails.
          toast({
            title: "Account created",
            description:
              "Your account was created, but we could not submit your admission application automatically. Please contact admin.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
      }

      if (data.session) {
        toast({
          title: "Application submitted",
          description: "Registration completed. Your admission is pending admin approval.",
        });
      } else {
        toast({
          title: "Account created",
          description:
            "Check your email to confirm your account first. Then sign in to complete admission setup.",
        });
      }

      navigate("/login");
    } catch (error: any) {
      if (isEmailRateLimitError(error)) {
        startCooldown("signup", 180);
        setCooldown(getRemainingCooldownSeconds("signup"));
      }
      toast({
        title: "Registration failed",
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
          <img src={rhemaLogo} alt="Rhema Fits Logo" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h1 className="text-xl font-serif font-bold text-gold-50">Rhema Fits</h1>
            <p className="text-xs text-gold-200/70">School of Ministry</p>
          </div>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold text-gold-50 mb-4">
            Start Your Ministry Journey
          </h2>
          <p className="text-gold-200/80 text-lg mb-6">
            Join our community of students being transformed for impactful ministry.
          </p>
          <ul className="space-y-3 text-gold-200/70">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              Certificate, Diploma, Degree & Masters Programs
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              Online & Flexible Learning
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              Expert Faculty & Mentorship
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-gold-200/50 text-sm">
          © {new Date().getFullYear()} Rhema Fits Ministries
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={rhemaLogo} alt="Rhema Fits Logo" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h1 className="text-xl font-serif font-bold text-foreground">Rhema Fits</h1>
                <p className="text-xs text-muted-foreground">School of Ministry</p>
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Apply from any country for online or campus study</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Preferred Program</Label>
              <Select value={formData.program} onValueChange={(value) => handleChange("program", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certificate">Certificate Program (6 months)</SelectItem>
                  <SelectItem value="diploma">Diploma Program (2 years)</SelectItem>
                  <SelectItem value="degree">Degree Program (4 years)</SelectItem>
                  <SelectItem value="masters">Masters Program (2 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasSpecialization && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={formData.specialization} onValueChange={(value) => handleChange("specialization", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading || cooldown > 0}>
              {isLoading ? "Creating Account..." : cooldown > 0 ? `Try again in ${cooldown}s` : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign In
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

export default Register;
