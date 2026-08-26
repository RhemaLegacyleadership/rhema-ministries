import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  UserPlus,
  DollarSign,
  Calendar,
  Menu,
  X,
  Bell,
  Search,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import rhemaLogo from "@/assets/rhema-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { downloadHtmlDocument } from "@/lib/portal";

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  matricule: string | null;
  program: string | null;
  created_at: string;
};

type CourseRow = {
  id: string;
  code: string;
  title: string;
};

type PaymentRow = {
  id: string;
  student_id: string;
  amount: number;
  method: string;
  paid_to_phone: string;
  transaction_number: string;
  status: "pending" | "verified" | "rejected";
};

type AdminNotification = {
  id: string;
  title: string;
  detail: string;
  section: "applications" | "payments" | "teachers";
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [students, setStudents] = useState<ProfileRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);
  const { toast } = useToast();
  const applicationsRef = useRef<HTMLDivElement | null>(null);
  const paymentsRef = useRef<HTMLDivElement | null>(null);
  const studentsRef = useRef<HTMLDivElement | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const teachersRef = useRef<HTMLDivElement | null>(null);
  const coursesRef = useRef<HTMLDivElement | null>(null);
  const programsRef = useRef<HTMLDivElement | null>(null);
  const paymentsSectionRef = useRef<HTMLDivElement | null>(null);
  const reportsRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.href = "/login";
        return;
      }
      setAdminId(auth.user.id);
      const saved = window.localStorage.getItem(`admin-seen-notifications:${auth.user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setSeenNotificationIds(parsed);
        } catch {
          setSeenNotificationIds([]);
        }
      }
      await fetchAdminData();
    };
    init();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-live-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "fee_payments" }, fetchAdminData)
      .on("postgres_changes", { event: "*", schema: "public", table: "admission_applications" }, fetchAdminData)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, fetchAdminData)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchAdminData)
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const scrollToSection = (section: string) => {
    const refs: Record<string, { current: HTMLDivElement | null }> = {
      dashboard: dashboardRef,
      students: studentsRef,
      teachers: teachersRef,
      courses: coursesRef,
      programs: programsRef,
      payments: paymentsSectionRef,
      reports: reportsRef,
      settings: settingsRef,
    };
    const targetRef = refs[section];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const section = location.hash.replace("#", "");
    if (!section) return;
    setActiveSection(section);
    const timeoutId = window.setTimeout(() => scrollToSection(section), 50);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash]);

  const fetchAdminData = async () => {
    const [{ data: appRows }, { data: paymentRows }, { data: roleRows }, { data: studentRows }, { data: courseRows }] = await Promise.all([
      supabase.from("admission_applications").select("*").order("submitted_at", { ascending: false }),
      supabase.from("fee_payments").select("*").order("submitted_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("profiles").select("id, first_name, last_name, matricule, program, created_at"),
      supabase.from("courses").select("id, code, title"),
    ]);
    setApplications(appRows || []);
    setPayments(paymentRows || []);
    setUserRoles(roleRows || []);
    setStudents((studentRows || []) as ProfileRow[]);
    setCourses((courseRows || []) as CourseRow[]);
  };

  const reviewApplication = async (id: string, status: "accepted" | "rejected") => {
    if (!adminId) return;
    const { error } = await supabase
      .from("admission_applications")
      .update({
        status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Review failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Application ${status}` });
    fetchAdminData();
  };

  const verifyPayment = async (id: string, status: "verified" | "rejected") => {
    if (!adminId) return;
    const { error } = await supabase
      .from("fee_payments")
      .update({
        status,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Payment update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Payment ${status}` });
    fetchAdminData();
  };

  const editPayment = async (payment: PaymentRow) => {
    const amountInput = window.prompt("Payment amount (frs CFA)", String(payment.amount));
    if (amountInput === null) return;
    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid positive number.", variant: "destructive" });
      return;
    }
    const tx = window.prompt("Transaction number", payment.transaction_number);
    if (tx === null || !tx.trim()) return;
    const notes = window.prompt("Admin notes (optional)");
    if (notes === null) return;

    const { error } = await supabase
      .from("fee_payments")
      .update({
        amount: Math.round(amount),
        transaction_number: tx.trim(),
        admin_notes: notes.trim() || null,
      })
      .eq("id", payment.id);
    if (error) {
      toast({ title: "Payment update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Payment updated" });
    fetchAdminData();
  };

  const grantTeacherAccess = async (userId: string, granted: boolean) => {
    const { error } = await supabase
      .from("user_roles")
      .update({
        role: "teacher",
        teacher_access_granted: granted,
      })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Teacher access update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: granted ? "Teacher access granted" : "Teacher access revoked" });
    fetchAdminData();
  };

  const setUserRole = async (userId: string, role: "student" | "teacher" | "admin") => {
    const payload =
      role === "teacher"
        ? { role, teacher_access_granted: false }
        : { role, teacher_access_granted: false };
    const { error } = await supabase.from("user_roles").update(payload).eq("user_id", userId);
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Role set to ${role}` });
    fetchAdminData();
  };

  const assignMatricule = async (studentId: string) => {
    const value = window.prompt("Enter matricule");
    if (!value) return;
    const { error } = await supabase.from("profiles").update({ matricule: value }).eq("id", studentId);
    if (error) {
      toast({ title: "Matricule assignment failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Matricule assigned" });
    fetchAdminData();
  };

  const editStudent = async (student: ProfileRow) => {
    const firstName = window.prompt("First name", student.first_name || "");
    if (firstName === null) return;
    const lastName = window.prompt("Last name", student.last_name || "");
    if (lastName === null) return;
    const program = window.prompt("Program (certificate/diploma/degree/masters)", student.program || "");
    if (program === null) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        program: program.trim().toLowerCase(),
      })
      .eq("id", student.id);
    if (error) {
      toast({ title: "Student update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Student profile updated" });
    fetchAdminData();
  };

  const deleteStudent = async (student: ProfileRow) => {
    const confirmed = window.confirm(
      `Delete student profile for ${student.first_name || ""} ${student.last_name || ""}? This removes profile data only.`,
    );
    if (!confirmed) return;
    const { error } = await supabase.from("profiles").delete().eq("id", student.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Student profile deleted" });
    fetchAdminData();
  };

  const createCourse = async () => {
    const code = window.prompt("Course code (e.g. THE101)");
    if (!code) return;
    const title = window.prompt("Course title");
    if (!title) return;
    const teacherId = window.prompt("Teacher user ID (optional)") || "";
    const { error } = await supabase.from("courses").insert({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      teacher_id: teacherId.trim() ? teacherId.trim() : null,
    });
    if (error) {
      toast({ title: "Course creation failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Course created" });
    fetchAdminData();
  };

  const editCourse = async (course: CourseRow) => {
    const code = window.prompt("Course code", course.code);
    if (code === null) return;
    const title = window.prompt("Course title", course.title);
    if (title === null) return;
    const teacherId = window.prompt("Teacher user ID (empty to clear)") || "";
    const { error } = await supabase
      .from("courses")
      .update({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        teacher_id: teacherId.trim() ? teacherId.trim() : null,
      })
      .eq("id", course.id);
    if (error) {
      toast({ title: "Course update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Course updated" });
    fetchAdminData();
  };

  const deleteCourse = async (course: CourseRow) => {
    const confirmed = window.confirm(`Delete course ${course.code} - ${course.title}?`);
    if (!confirmed) return;
    const { error } = await supabase.from("courses").delete().eq("id", course.id);
    if (error) {
      toast({ title: "Course delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Course deleted" });
    fetchAdminData();
  };

  const exportAdminSnapshot = () => {
    const html = `
      <html>
      <head><title>Admin Snapshot</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>Admin Snapshot</h1>
        <p><strong>Total Students:</strong> ${students.length}</p>
        <p><strong>Total Courses:</strong> ${courses.length}</p>
        <p><strong>Total Applications:</strong> ${applications.length}</p>
        <p><strong>Total Payments:</strong> ${payments.length}</p>
      </body>
      </html>
    `;
    downloadHtmlDocument("admin-snapshot.html", html);
  };

  const downloadStudentReport = async (studentId: string) => {
    const [profileRes, submissionRes, examsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", studentId).maybeSingle(),
      supabase.from("assignment_submissions").select("*").eq("student_id", studentId).eq("status", "graded"),
      supabase.from("exam_results").select("*").eq("student_id", studentId),
    ]);

    const profile = profileRes.data;
    const submissions = submissionRes.data || [];
    const exams = examsRes.data || [];
    const assignmentRows = submissions
      .map((row) => `<tr><td>${row.file_name}</td><td>${row.score ?? "-"}</td></tr>`)
      .join("");
    const examRows = exams
      .map((row) => `<tr><td>${row.assessment_type}</td><td>${row.title}</td><td>${row.score}/${row.max_score}</td></tr>`)
      .join("");

    const html = `
      <html>
      <head><title>Student Result Report</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>Student Report</h1>
        <p><strong>Name:</strong> ${(profile?.first_name || "") + " " + (profile?.last_name || "")}</p>
        <p><strong>Matricule:</strong> ${profile?.matricule || "-"}</p>
        <h2>Assignment Grades</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><th>Submission</th><th>Score</th></tr>
          ${assignmentRows || "<tr><td colspan='2'>No assignment grades</td></tr>"}
        </table>
        <h2 style="margin-top: 20px;">Test and Exam Grades</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><th>Type</th><th>Title</th><th>Score</th></tr>
          ${examRows || "<tr><td colspan='3'>No test/exam grades</td></tr>"}
        </table>
      </body>
      </html>
    `;

    downloadHtmlDocument(`student-report-${studentId.slice(0, 8)}.html`, html);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.href = "/";
  };

  const menuItems = [
    { key: "dashboard", icon: TrendingUp, label: "Dashboard" },
    { key: "students", icon: Users, label: "Students" },
    { key: "teachers", icon: Users, label: "Teachers" },
    { key: "courses", icon: BookOpen, label: "Courses" },
    { key: "programs", icon: Calendar, label: "Programs" },
    { key: "payments", icon: CreditCard, label: "Payments" },
    { key: "reports", icon: FileText, label: "Reports" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });

  const latestApplicationByStudentId = useMemo(() => {
    const map = new Map<string, any>();
    applications.forEach((app) => {
      if (!map.has(app.student_id)) {
        map.set(app.student_id, app);
      }
    });
    return map;
  }, [applications]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => {
      const fullName = `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(query) ||
        (student.matricule || "").toLowerCase().includes(query) ||
        (student.program || "").toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query)
      );
    });
  }, [students, searchTerm]);

  const recentStudents = useMemo(
    () =>
      filteredStudents
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8),
    [filteredStudents],
  );

  const recentPayments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = !query
      ? payments
      : payments.filter((payment) => {
          const tx = String(payment.transaction_number || "").toLowerCase();
          const studentId = String(payment.student_id || "").toLowerCase();
          return tx.includes(query) || studentId.includes(query);
        });
    return filtered.slice(0, 8);
  }, [payments, searchTerm]);

  const revenueThisMonth = useMemo(() => {
    const now = new Date();
    return payments
      .filter((payment) => {
        if (payment.status !== "verified") return false;
        const d = payment.verified_at ? new Date(payment.verified_at) : null;
        return !!d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments]);

  const activeTeachers = useMemo(
    () => userRoles.filter((row) => row.role === "teacher" && row.teacher_access_granted).length,
    [userRoles],
  );

  const programDistribution = useMemo(() => {
    const counts = { certificate: 0, diploma: 0, degree: 0, masters: 0 };
    students.forEach((student) => {
      const key = (student.program || "").toLowerCase() as keyof typeof counts;
      if (key in counts) counts[key] += 1;
    });
    const total = students.length || 1;
    return [
      { key: "certificate", label: "Certificate", count: counts.certificate, percentage: Math.round((counts.certificate / total) * 100) },
      { key: "diploma", label: "Diploma", count: counts.diploma, percentage: Math.round((counts.diploma / total) * 100) },
      { key: "degree", label: "Degree", count: counts.degree, percentage: Math.round((counts.degree / total) * 100) },
      { key: "masters", label: "Masters", count: counts.masters, percentage: Math.round((counts.masters / total) * 100) },
    ];
  }, [students]);

  const notifications = useMemo<AdminNotification[]>(() => {
    const pendingApplications = applications
      .filter((app) => app.status === "pending")
      .slice(0, 6)
      .map((app) => ({
        id: `application:${app.id}`,
        title: "Pending admission application",
        detail: `${app.program} - student ${String(app.student_id).slice(0, 8)}`,
        section: "applications" as const,
      }));

    const pendingPayments = payments
      .filter((payment) => payment.status === "pending")
      .slice(0, 6)
      .map((payment) => ({
        id: `payment:${payment.id}`,
        title: "Pending payment verification",
        detail: `Txn ${payment.transaction_number} - frs CFA ${Number(payment.amount || 0).toLocaleString()}`,
        section: "payments" as const,
      }));

    const teacherRequests = userRoles
      .filter((row) => row.role === "teacher" && !row.teacher_access_granted)
      .slice(0, 6)
      .map((row) => ({
        id: `teacher-access:${row.user_id}`,
        title: "Teacher access pending",
        detail: `User ${String(row.user_id).slice(0, 8)} needs access grant`,
        section: "teachers" as const,
      }));

    return [...pendingApplications, ...pendingPayments, ...teacherRequests];
  }, [applications, payments, userRoles]);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !seenNotificationIds.includes(item.id)),
    [notifications, seenNotificationIds],
  );

  const markAllNotificationsAsRead = () => {
    const allIds = notifications.map((item) => item.id);
    setSeenNotificationIds(allIds);
    if (adminId) {
      window.localStorage.setItem(`admin-seen-notifications:${adminId}`, JSON.stringify(allIds));
    }
  };

  const openNotification = (notification: AdminNotification) => {
    const nextSeen = Array.from(new Set([...seenNotificationIds, notification.id]));
    setSeenNotificationIds(nextSeen);
    if (adminId) {
      window.localStorage.setItem(`admin-seen-notifications:${adminId}`, JSON.stringify(nextSeen));
    }
    const targetSection =
      notification.section === "applications"
        ? "students"
        : notification.section === "payments"
        ? "payments"
        : "teachers";
    const url = `/admin/dashboard#${targetSection}`;
    window.history.replaceState(null, "", url);
    setActiveSection(targetSection);
    scrollToSection(targetSection);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-100 transform transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                <img src={rhemaLogo} alt="Rhema Fits logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-white">Rhema Fits</h1>
                <p className="text-xs text-slate-300">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  const url = `/admin/dashboard#${item.key}`;
                  window.history.replaceState(null, "", url);
                  setActiveSection(item.key);
                  scrollToSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left
                  ${item.key === activeSection
                    ? "bg-amber-400 text-slate-950 font-semibold"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
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
                <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students, ids, payments..." 
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 w-48"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {Math.min(unreadNotifications.length, 99)}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 max-h-[360px] overflow-auto">
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="text-sm text-muted-foreground cursor-default">
                      No admin notifications
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start gap-1"
                        onClick={() => openNotification(notification)}
                      >
                        <span className="text-sm font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">{notification.detail}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  {notifications.length > 0 && (
                    <DropdownMenuItem onClick={markAllNotificationsAsRead}>
                      Mark all as read
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center text-gold-50 font-medium">
                A
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="font-medium">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8" id="dashboard" ref={dashboardRef}>
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-navy-700 to-navy-900 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">Total Students</p>
                    <p className="text-3xl font-extrabold mt-1 text-white">{students.length.toLocaleString()}</p>
                    <p className="text-xs text-slate-100 mt-1">Live from Supabase</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100/70 text-sm">Active Courses</p>
                    <p className="text-3xl font-bold mt-1">{courses.length}</p>
                    <p className="text-xs text-emerald-100/60 mt-1">Live from Supabase</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <BookOpen className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100/70 text-sm">Teachers</p>
                    <p className="text-3xl font-bold mt-1">{activeTeachers}</p>
                    <p className="text-xs text-blue-100/60 mt-1">Teacher access granted</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <UserPlus className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100/70 text-sm">Revenue ({currentMonth})</p>
                    <p className="text-3xl font-bold mt-1">frs CFA {revenueThisMonth.toLocaleString()}</p>
                    <p className="text-xs text-amber-100/60 mt-1">Verified payments only</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <DollarSign className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Students */}
            <Card className="lg:col-span-2" ref={studentsRef} id="students">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif">Recent Students</CardTitle>
                  <CardDescription>Latest enrolled students</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => applicationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStudents.map((student) => {
                      const latestApp = latestApplicationByStudentId.get(student.id);
                      const status =
                        latestApp?.status === "accepted"
                          ? "Active"
                          : latestApp?.status === "pending"
                          ? "Pending"
                          : latestApp?.status === "rejected"
                          ? "Rejected"
                          : "Active";
                      const displayName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || "Unnamed Student";
                      return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{displayName}</p>
                            <p className="text-xs text-muted-foreground">{student.id.slice(0, 8)}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.program || "Not set"}</TableCell>
                        <TableCell>
                          <Badge variant={
                            status === "Active" ? "default" :
                            status === "Pending" ? "secondary" : "outline"
                          }>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast({ title: displayName, description: `Student ID: ${student.id}` })}>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => editStudent(student)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteStudent(student)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card ref={paymentsRef} id="payments-overview">
              <CardHeader>
                <CardTitle className="font-serif">Recent Payments</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPayments.map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{String(payment.student_id || "").slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{payment.transaction_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">frs CFA {Number(payment.amount || 0).toLocaleString()}</p>
                      <Badge variant={payment.status === "verified" ? "default" : "secondary"} className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" onClick={() => paymentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                  View All Payments
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Program Distribution */}
          <Card id="programs" ref={programsRef}>
            <CardHeader>
              <CardTitle className="font-serif">Students by Program</CardTitle>
              <CardDescription>Distribution across all programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-emerald-700">Certificate</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-800">{programDistribution[0].count}</p>
                  <p className="text-sm text-emerald-600">{programDistribution[0].percentage}% of total</p>
                </div>
                
                <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-blue-700">Diploma</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-800">{programDistribution[1].count}</p>
                  <p className="text-sm text-blue-600">{programDistribution[1].percentage}% of total</p>
                </div>
                
                <div className="p-6 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-purple-700">Degree</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-800">{programDistribution[2].count}</p>
                  <p className="text-sm text-purple-600">{programDistribution[2].percentage}% of total</p>
                </div>
                
                <div className="p-6 rounded-xl bg-gold-50 border border-gold-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gold-700">Masters</span>
                  </div>
                  <p className="text-3xl font-bold text-gold-800">{programDistribution[3].count}</p>
                  <p className="text-sm text-gold-600">{programDistribution[3].percentage}% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card ref={applicationsRef}>
              <CardHeader>
                <CardTitle className="font-serif">Admission Applications</CardTitle>
                <CardDescription>Approve students before they proceed with admission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-auto">
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications submitted.</p>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="rounded-lg border p-3">
                      <p className="font-medium text-sm">{app.program}</p>
                      <p className="text-xs text-muted-foreground mb-2">Student: {app.student_id.slice(0, 8)}</p>
                      <div className="flex items-center gap-2">
                        <Badge>{app.status}</Badge>
                        {app.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => reviewApplication(app.id, "accepted")}>
                              Accept
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => reviewApplication(app.id, "rejected")}>
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card id="payments" ref={paymentsSectionRef}>
              <CardHeader>
                <CardTitle className="font-serif">Fee Payment Verification</CardTitle>
                <CardDescription>Review submitted payment proofs and approve or reject in Supabase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-auto">
                {payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments submitted.</p>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.id} className="rounded-lg border p-3">
                      <p className="font-medium text-sm">Txn: {payment.transaction_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.amount.toLocaleString()} frs CFA to {payment.paid_to_phone}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>{payment.status}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => editPayment(payment as PaymentRow)}>
                          Edit
                        </Button>
                        {payment.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => verifyPayment(payment.id, "verified")}>
                              Verify
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => verifyPayment(payment.id, "rejected")}>
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card id="teachers" ref={teachersRef}>
              <CardHeader>
                <CardTitle className="font-serif">Teacher Access Control</CardTitle>
                <CardDescription>Set teacher role and grant/revoke teacher portal access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {userRoles.filter((roleRow) => roleRow.role !== "admin").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teacher accounts created yet.</p>
                ) : (
                  userRoles
                    .filter((roleRow) => roleRow.role !== "admin")
                    .map((teacher) => (
                    <div key={teacher.user_id} className="rounded-lg border p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{teacher.user_id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">Role: {teacher.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {teacher.role !== "teacher" ? (
                          <Button size="sm" variant="outline" onClick={() => setUserRole(teacher.user_id, "teacher")}>
                            Make Teacher
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={teacher.teacher_access_granted ? "destructive" : "outline"}
                            onClick={() => grantTeacherAccess(teacher.user_id, !teacher.teacher_access_granted)}
                          >
                            {teacher.teacher_access_granted ? "Revoke" : "Grant"}
                          </Button>
                        )}
                        {teacher.role === "teacher" && (
                          <Button size="sm" variant="ghost" onClick={() => setUserRole(teacher.user_id, "student")}>
                            Set Student
                          </Button>
                        )}
                      </div>
                    </div>
                    ))
                )}
              </CardContent>
            </Card>

            <Card id="reports" ref={reportsRef}>
              <CardHeader>
                <CardTitle className="font-serif">Matricules & Result Reports</CardTitle>
                <CardDescription>Assign matricules and download student grading reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-auto">
                {students.map((student) => (
                  <div key={student.id} className="rounded-lg border p-3">
                    <p className="font-medium text-sm">{student.first_name} {student.last_name}</p>
                    <p className="text-xs text-muted-foreground mb-2">Matricule: {student.matricule || "Not assigned"}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => assignMatricule(student.id)}>
                        Assign Matricule
                      </Button>
                      <Button size="sm" onClick={() => downloadStudentReport(student.id)}>
                        Download Report
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card id="courses" ref={coursesRef}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif">Course Management</CardTitle>
                  <CardDescription>Create, edit, or delete courses in Supabase</CardDescription>
                </div>
                <Button size="sm" onClick={createCourse}>Add Course</Button>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[360px] overflow-auto">
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No courses available.</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="rounded-lg border p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{course.code} - {course.title}</p>
                        <p className="text-xs text-muted-foreground">ID: {course.id.slice(0, 8)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editCourse(course)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCourse(course)}>Delete</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card id="settings" ref={settingsRef}>
              <CardHeader>
                <CardTitle className="font-serif">Admin Tools</CardTitle>
                <CardDescription>System management controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={() => fetchAdminData()}>
                  Refresh Supabase Data
                </Button>
                <Button variant="outline" onClick={exportAdminSnapshot}>
                  Export Admin Snapshot
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    const userId = window.prompt("User ID to promote as admin");
                    if (!userId?.trim()) return;
                    await setUserRole(userId.trim(), "admin");
                  }}
                >
                  Promote User to Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
