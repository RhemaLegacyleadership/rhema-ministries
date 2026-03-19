import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Video, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchStudentNotifications, markAllNotificationsAsRead } from "@/lib/student-notifications";
import { getStudentApprovalState } from "@/lib/student-access";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [canAccessCourseMaterial, setCanAccessCourseMaterial] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, program")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(profileData || null);

      const items = await fetchStudentNotifications(user.id);
      setNotifications(items);
      const approvalState = await getStudentApprovalState(user.id);
      setCanAccessCourseMaterial(approvalState.canAccessCourseMaterial);
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`dashboard-notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fee_payments", filter: `student_id=eq.${user.id}` },
        async () => {
          setNotifications(await fetchStudentNotifications(user.id));
          const approvalState = await getStudentApprovalState(user.id);
          setCanAccessCourseMaterial(approvalState.canAccessCourseMaterial);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admission_applications", filter: `student_id=eq.${user.id}` },
        async () => {
          setNotifications(await fetchStudentNotifications(user.id));
          const approvalState = await getStudentApprovalState(user.id);
          setCanAccessCourseMaterial(approvalState.canAccessCourseMaterial);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignment_submissions", filter: `student_id=eq.${user.id}` },
        async () => setNotifications(await fetchStudentNotifications(user.id)),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "exam_results", filter: `student_id=eq.${user.id}` },
        async () => setNotifications(await fetchStudentNotifications(user.id)),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const menuItems = [
    { icon: BookOpen, label: "Dashboard", href: "/student/dashboard", active: true },
    { icon: Video, label: "My Courses", href: "/student/courses" },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: CreditCard, label: "Payments", href: "/student/payments" },
    { icon: FileText, label: "Transcripts", href: "/student/transcripts" },
    { icon: Bell, label: "Notifications", href: "/student/notifications" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
    { icon: GraduationCap, label: "Profile", href: "/student/profile" },
  ];

  const upcomingClasses = [
    { title: "Introduction to Theology", time: "10:00 AM", instructor: "Dr. Samuel Ndi", status: "live" },
    { title: "Biblical Studies I", time: "2:00 PM", instructor: "Rev. Grace Fomba", status: "upcoming" },
    { title: "Church Leadership", time: "4:00 PM", instructor: "Pastor John Mbah", status: "upcoming" },
  ];

  const enrolledCourses = [
    { title: "Introduction to Theology", progress: 75, lessons: "12/16" },
    { title: "Biblical Studies I", progress: 45, lessons: "7/15" },
    { title: "Christian Ethics", progress: 30, lessons: "4/12" },
    { title: "Church History", progress: 60, lessons: "9/15" },
  ];

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ").trim() ||
    "Student";
  const avatarUrl = profile?.avatar_url || null;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "S";
  const programValue = (profile?.program || user?.user_metadata?.program || "").toString().toLowerCase();
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
  const unreadCount = notifications.filter((item) => !item.read).length;
  const stats = canAccessCourseMaterial
    ? { enrolledCourses: 4, completed: 12, avgProgress: 52, pendingFees: 50000 }
    : { enrolledCourses: 0, completed: 0, avgProgress: 0, pendingFees: 0 };

  const handleOpenNotifications = () => {
    if (!user?.id || notifications.length === 0) return;
    markAllNotificationsAsRead(user.id, notifications);
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 overflow-y-auto overscroll-contain
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-11 h-11">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${item.active 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.user_metadata?.first_name || "Student"}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu onOpenChange={(open) => open && handleOpenNotifications()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>School Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>No new notifications.</DropdownMenuItem>
                  ) : (
                    notifications.slice(0, 5).map((item) => (
                      <DropdownMenuItem key={item.id} onClick={() => navigate(item.link)} className="flex flex-col items-start">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.message}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/student/notifications")}>View all notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Avatar className="w-10 h-10">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-navy-600 to-navy-700 text-gold-50 font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {!canAccessCourseMaterial && (
            <Card className="border-l-4 border-l-warning">
              <CardContent className="p-5">
                <p className="font-semibold text-foreground">Academic access is locked.</p>
                <p className="text-sm text-muted-foreground">
                  Course materials will unlock after admin verifies your registration payment and accepts your admission.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-gold-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.enrolledCourses}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-gold-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-info">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Progress</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.avgProgress}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Fees</p>
                    <p className="text-xs text-muted-foreground mt-1">frs CFA</p>
                    <p className="text-3xl font-bold text-foreground">{stats.pendingFees.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Today's Classes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif">Today's Classes</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingClasses.map((classItem, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          classItem.status === "live" 
                            ? "bg-destructive/10 text-destructive" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{classItem.title}</h4>
                          <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{classItem.time}</p>
                        {classItem.status === "live" ? (
                          <Button variant="gold" size="sm" className="mt-1">
                            Join Now
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Upcoming</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={canAccessCourseMaterial ? "/student/courses" : "/student/payments"}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    {canAccessCourseMaterial ? "Browse Courses" : "Complete Registration"}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student/payments">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Fees
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student/transcripts">
                    <FileText className="w-4 h-4 mr-2" />
                    View Transcripts
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Course Progress</CardTitle>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                {(canAccessCourseMaterial ? enrolledCourses : []).map((course, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{course.title}</h4>
                      <span className="text-sm text-muted-foreground">{course.lessons} lessons</span>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                  </div>
                ))}
                {!canAccessCourseMaterial && (
                  <div className="p-4 rounded-xl bg-muted/50 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Course progress will appear here after your payment is verified and admission is accepted.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
