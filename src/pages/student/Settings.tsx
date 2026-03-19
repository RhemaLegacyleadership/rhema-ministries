import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, BookOpen, CreditCard, FileText, Lock, LogOut, Moon, Save, Settings, Sun, User, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const PREF_KEY = "student_portal_preferences";

type Preferences = {
  emailNotifications: boolean;
  dashboardNotifications: boolean;
  darkMode: boolean;
};

const StudentSettings = () => {
  const [user, setUser] = useState<{ id: string; user_metadata?: Record<string, unknown>; email?: string } | null>(null);
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; avatar_url: string | null; program: string | null } | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    dashboardNotifications: true,
    darkMode: false,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        navigate("/login");
        return;
      }
      setUser(auth.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, program")
        .eq("id", auth.user.id)
        .maybeSingle();
      setProfile(profileData || null);

      try {
        const saved = localStorage.getItem(PREF_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Preferences;
          setPreferences(parsed);
          document.documentElement.classList.toggle("dark", parsed.darkMode);
        }
      } catch {
        // Ignore invalid local storage data and keep defaults.
      }
    };

    void init();
  }, [navigate]);

  const displayName = useMemo(() => {
    const fullFromProfile = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
    const metadata = user?.user_metadata || {};
    const fullFromMeta = [String(metadata.first_name || ""), String(metadata.last_name || "")].filter(Boolean).join(" ").trim();
    return fullFromProfile || fullFromMeta || "Student";
  }, [profile, user?.user_metadata]);

  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "S",
    [displayName],
  );

  const programValue = (profile?.program || "").toLowerCase();
  const programLabel =
    programValue === "certificate"
      ? "Certificate Program"
      : programValue === "diploma"
      ? "Diploma Program"
      : programValue === "degree"
      ? "Bachelor's Degree Program"
      : programValue === "masters"
      ? "Masters Program"
      : "Student Account";

  const menuItems = [
    { icon: BookOpen, label: "Dashboard", href: "/student/dashboard" },
    { icon: Video, label: "My Courses", href: "/student/courses" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: CreditCard, label: "Payments", href: "/student/payments" },
    { icon: FileText, label: "Transcripts", href: "/student/transcripts" },
    { icon: Bell, label: "Notifications", href: "/student/notifications" },
    { icon: Settings, label: "Settings", href: "/student/settings", active: true },
    { icon: User, label: "Profile", href: "/student/profile" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  const savePreferences = (next: Preferences) => {
    setPreferences(next);
    localStorage.setItem(PREF_KEY, JSON.stringify(next));
    document.documentElement.classList.toggle("dark", next.darkMode);
    toast({ title: "Settings saved" });
  };

  const handleUpdatePassword = async () => {
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast({ title: "Password update failed", description: error.message, variant: "destructive" });
      return;
    }

    setPassword("");
    setConfirmPassword("");
    toast({ title: "Password updated" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-11 h-11">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-navy-800 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base font-serif font-bold text-sidebar-foreground leading-tight">{displayName}</h1>
                <p className="text-xs text-sidebar-foreground/60">{programLabel}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account preferences and security.</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Preferences</CardTitle>
            <CardDescription>Control how your student portal behaves.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates by email.</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => savePreferences({ ...preferences, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium">Dashboard Notifications</p>
                <p className="text-sm text-muted-foreground">Show in-app alerts in your portal.</p>
              </div>
              <Switch
                checked={preferences.dashboardNotifications}
                onCheckedChange={(checked) => savePreferences({ ...preferences, dashboardNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium flex items-center gap-2">
                  {preferences.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </p>
                <p className="text-sm text-muted-foreground">Switch between light and dark display.</p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => savePreferences({ ...preferences, darkMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Security</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button onClick={handleUpdatePassword} disabled={savingPassword}>
              <Lock className="w-4 h-4 mr-2" />
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Account</CardTitle>
            <CardDescription>Current signed-in account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Name: <span className="text-foreground font-medium">{displayName}</span></p>
            <p className="text-sm text-muted-foreground">Email: <span className="text-foreground font-medium">{user?.email || "-"}</span></p>
            <Button variant="outline" onClick={() => savePreferences(preferences)}>
              <Save className="w-4 h-4 mr-2" />
              Save Current Settings
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentSettings;
