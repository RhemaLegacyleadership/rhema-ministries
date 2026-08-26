import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bell, BookOpen, CreditCard, FileText, LogOut, Settings, User, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentApprovalState } from "@/lib/student-access";

type CourseRow = {
  id: string;
  code: string;
  title: string;
  teacher_id: string | null;
};

const StudentCourses = () => {
  const [user, setUser] = useState<{ id: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; avatar_url: string | null; program: string | null } | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [canAccessCourseMaterial, setCanAccessCourseMaterial] = useState(false);
  const navigate = useNavigate();

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

      const approvalState = await getStudentApprovalState(auth.user.id);
      setCanAccessCourseMaterial(approvalState.canAccessCourseMaterial);
      if (!approvalState.canAccessCourseMaterial) {
        setCourses([]);
        setTeacherNames({});
        setLoading(false);
        return;
      }

      const { data: enrollmentRows } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("student_id", auth.user.id);

      const courseIds = (enrollmentRows || []).map((row) => row.course_id);
      if (courseIds.length === 0) {
        setCourses([]);
        setTeacherNames({});
        setLoading(false);
        return;
      }

      const { data: courseRows } = await supabase
        .from("courses")
        .select("id, code, title, teacher_id")
        .in("id", courseIds)
        .order("title", { ascending: true });

      const nextCourses = (courseRows || []) as CourseRow[];
      setCourses(nextCourses);

      const teacherIds = [...new Set(nextCourses.map((row) => row.teacher_id).filter(Boolean))] as string[];
      if (teacherIds.length > 0) {
        const { data: teacherProfiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", teacherIds);

        const lookup: Record<string, string> = {};
        (teacherProfiles || []).forEach((row) => {
          const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
          lookup[row.id] = fullName || "Assigned Teacher";
        });
        setTeacherNames(lookup);
      } else {
        setTeacherNames({});
      }

      setLoading(false);
    };

    void init();
  }, [navigate]);

  const displayName = useMemo(() => {
    const fromProfile = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
    const metadata = user?.user_metadata || {};
    const fromMeta = [String(metadata.first_name || ""), String(metadata.last_name || "")].filter(Boolean).join(" ").trim();
    return fromProfile || fromMeta || "Student";
  }, [profile, user?.user_metadata]);

  const initials = useMemo(
    () =>
      displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0]?.toUpperCase())
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
    { icon: Video, label: "My Courses", href: "/student/courses", active: true },
    { icon: FileText, label: "Assignments", href: "/student/assignments" },
    { icon: CreditCard, label: "Payments", href: "/student/payments" },
    { icon: FileText, label: "Transcripts", href: "/student/transcripts" },
    { icon: Bell, label: "Notifications", href: "/student/notifications" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
            <h1 className="text-2xl font-serif font-bold text-foreground">My Courses</h1>
            <p className="text-sm text-muted-foreground">Open any course page to see class details and ask your teacher questions in chat.</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Courses Taught In Your Program</CardTitle>
          </CardHeader>
          <CardContent>
            {!canAccessCourseMaterial ? (
              <p className="text-muted-foreground">
                Courses are locked. They will appear after admin verifies your registration payment and accepts your admission.
              </p>
            ) : loading ? (
              <p className="text-muted-foreground">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-muted-foreground">No courses assigned to your account yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="rounded-xl border p-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {course.code} - {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Teacher: {course.teacher_id ? teacherNames[course.teacher_id] || "Assigned Teacher" : "Not assigned"}
                      </p>
                    </div>
                    <Button asChild>
                      <Link to={`/student/courses/${course.id}`}>
                        Open Course
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentCourses;
