import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Video,
  Calendar,
  Clock,
  CheckCircle,
  Menu,
  X,
  Bell,
  Plus,
  Play,
  Eye,
  Edit,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    maxScore: "100",
  });
  const [newResult, setNewResult] = useState({
    courseId: "",
    studentId: "",
    assessmentType: "test",
    title: "",
    score: "",
    maxScore: "100",
  });
  const [activeSection, setActiveSection] = useState("dashboard");
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const classesRef = useRef<HTMLDivElement | null>(null);
  const studentsRef = useRef<HTMLDivElement | null>(null);
  const assignmentsRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLDivElement | null>(null);
  const gradesRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.href = "/login";
        return;
      }
      setUser(auth.user);
      await fetchTeacherData(auth.user.id);
    };
    init();
  }, []);

  const scrollToSection = (section: string) => {
    const refs: Record<string, { current: HTMLDivElement | null }> = {
      dashboard: dashboardRef,
      classes: classesRef,
      students: studentsRef,
      assignments: assignmentsRef,
      schedule: scheduleRef,
      grades: gradesRef,
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
    const timer = window.setTimeout(() => scrollToSection(section), 50);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const fetchTeacherData = async (teacherId: string) => {
    const { data: teacherCourses } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", teacherId);
    const courseRows = teacherCourses || [];
    setCourses(courseRows);

    const courseIds = courseRows.map((c) => c.id);
    if (courseIds.length === 0) {
      setSubmissions([]);
      setEnrollments([]);
      return;
    }

    const { data: enrollmentRows } = await supabase
      .from("course_enrollments")
      .select("course_id, student_id")
      .in("course_id", courseIds);
    setEnrollments(enrollmentRows || []);

    const { data: assignments } = await supabase
      .from("teacher_assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    const assignmentIds = (assignments || []).map((a) => a.id);
    if (assignmentIds.length > 0) {
      const { data: rows } = await supabase
        .from("assignment_submissions")
        .select("*")
        .in("assignment_id", assignmentIds)
        .order("submitted_at", { ascending: false });
      setSubmissions(rows || []);
    } else {
      setSubmissions([]);
    }

    const { data: resultRows } = await supabase
      .from("exam_results")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("recorded_at", { ascending: false });
    setExamResults(resultRows || []);
  };

  const handleCreateAssignment = async () => {
    if (!user || !newAssignment.courseId || !newAssignment.title) {
      toast({
        title: "Missing details",
        description: "Course and title are required.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("teacher_assignments").insert({
      course_id: newAssignment.courseId,
      teacher_id: user.id,
      title: newAssignment.title,
      description: newAssignment.description || null,
      due_date: newAssignment.dueDate || null,
      max_score: Number(newAssignment.maxScore) || 100,
    });

    if (error) {
      toast({ title: "Could not create assignment", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Assignment published" });
    setNewAssignment({ courseId: "", title: "", description: "", dueDate: "", maxScore: "100" });
    await fetchTeacherData(user.id);
  };

  const handleGradeSubmission = async (submissionId: string, score: number) => {
    if (!user || Number.isNaN(score)) return;
    const { error } = await supabase
      .from("assignment_submissions")
      .update({
        status: "graded",
        score,
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq("id", submissionId);

    if (error) {
      toast({ title: "Grading failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Submission graded" });
    await fetchTeacherData(user.id);
  };

  const handleAddResult = async () => {
    if (!user || !newResult.courseId || !newResult.studentId || !newResult.title || !newResult.score) {
      toast({ title: "Missing details", description: "Fill all test/exam fields.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("exam_results").insert({
      course_id: newResult.courseId,
      student_id: newResult.studentId,
      teacher_id: user.id,
      assessment_type: newResult.assessmentType,
      title: newResult.title,
      score: Number(newResult.score),
      max_score: Number(newResult.maxScore) || 100,
    });

    if (error) {
      toast({ title: "Could not save result", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Result recorded" });
    setNewResult({
      courseId: "",
      studentId: "",
      assessmentType: "test",
      title: "",
      score: "",
      maxScore: "100",
    });
    await fetchTeacherData(user.id);
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
    { key: "dashboard", icon: BookOpen, label: "Dashboard" },
    { key: "classes", icon: Video, label: "My Classes" },
    { key: "students", icon: Users, label: "Students" },
    { key: "assignments", icon: FileText, label: "Assignments" },
    { key: "schedule", icon: Calendar, label: "Schedule" },
    { key: "grades", icon: FileText, label: "Grades" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  const makeDateLabel = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const studentCountByCourse = useMemo(() => {
    const map = new Map<string, number>();
    enrollments.forEach((row) => {
      map.set(row.course_id, (map.get(row.course_id) || 0) + 1);
    });
    return map;
  }, [enrollments]);

  const uniqueStudentCount = useMemo(() => {
    return new Set(enrollments.map((row) => row.student_id)).size;
  }, [enrollments]);

  const pendingGrades = useMemo(() => {
    return submissions.filter((submission) => submission.status !== "graded").length;
  }, [submissions]);

  const myCourses = useMemo(() => {
    return courses.map((course, index) => {
      const courseSubmissions = submissions.filter((submission) => submission.course_id === course.id);
      const gradedCount = courseSubmissions.filter((submission) => submission.status === "graded").length;
      const progress = courseSubmissions.length === 0 ? 0 : Math.round((gradedCount / courseSubmissions.length) * 100);
      const time = index % 2 === 0 ? "10:00 AM" : "2:00 PM";
      return {
        id: course.id,
        name: `${course.code} - ${course.title}`,
        students: studentCountByCourse.get(course.id) || 0,
        progress,
        nextClass: `${makeDateLabel(index)}, ${time}`,
      };
    });
  }, [courses, studentCountByCourse, submissions]);

  const upcomingClasses = useMemo(() => {
    return courses.slice(0, 6).map((course, index) => ({
      course: `${course.code} - ${course.title}`,
      time: index % 2 === 0 ? "10:00 AM" : "2:00 PM",
      dateLabel: makeDateLabel(index),
      isToday: index === 0,
      students: studentCountByCourse.get(course.id) || 0,
      topic: "Planned teaching session",
    }));
  }, [courses, studentCountByCourse]);

  const teacherNotifications = useMemo(() => {
    return submissions
      .filter((submission) => submission.status !== "graded")
      .slice(0, 8)
      .map((submission) => ({
        id: submission.id,
        title: `Ungraded submission: ${submission.file_name}`,
        date: new Date(submission.submitted_at).toLocaleString(),
      }));
  }, [submissions]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-navy-800 transform transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-navy-800" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-gold-50">Rhema Fits</h1>
                <p className="text-xs text-gold-200/60">Teacher Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  const url = `/teacher/dashboard#${item.key}`;
                  window.history.replaceState(null, "", url);
                  setActiveSection(item.key);
                  scrollToSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left
                  ${item.key === activeSection
                    ? "bg-gold-500 text-navy-800" 
                    : "text-gold-100/70 hover:bg-navy-700 hover:text-gold-50"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-navy-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gold-100/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
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
                <h1 className="text-2xl font-serif font-bold text-foreground">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.user_metadata?.first_name || "Teacher"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="gold"
                onClick={() => {
                  window.history.replaceState(null, "", "/teacher/dashboard#schedule");
                  setActiveSection("schedule");
                  scrollToSection("schedule");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Class
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {teacherNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                        {Math.min(teacherNotifications.length, 99)}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-[320px] overflow-auto">
                  {teacherNotifications.length === 0 ? (
                    <DropdownMenuItem className="cursor-default text-muted-foreground">
                      No pending grading notifications
                    </DropdownMenuItem>
                  ) : (
                    teacherNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => {
                          window.history.replaceState(null, "", "/teacher/dashboard#grades");
                          setActiveSection("grades");
                          scrollToSection("grades");
                        }}
                        className="flex flex-col items-start gap-1"
                      >
                        <span className="text-sm font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">{notification.date}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center text-gold-50 font-medium">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8" id="dashboard" ref={dashboardRef}>
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-gold-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">My Courses</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{courses.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-gold-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{uniqueStudentCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Classes Today</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{upcomingClasses.filter((item) => item.isToday).length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Video className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Grades</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{pendingGrades}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Courses */}
            <div className="lg:col-span-2 space-y-6">
              <Card id="classes" ref={classesRef}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">My Courses</CardTitle>
                    <CardDescription>Courses you're currently teaching</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => scrollToSection("students")}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{course.name}</h4>
                        <Badge variant="outline">{course.students} students</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.nextClass}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Course Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => toast({ title: "Class ready", description: `Open class tools for ${course.name}.` })}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Class
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Submissions */}
              <Card id="students" ref={studentsRef}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Recent Submissions</CardTitle>
                    <CardDescription>Assignments awaiting review</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.slice(0, 10).map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <p className="font-medium">{String(submission.student_id).slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(submission.submitted_at).toLocaleString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{submission.file_name}</p>
                            <p className="text-xs text-muted-foreground">Assignment ID: {String(submission.assignment_id).slice(0, 8)}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={submission.status === "graded" ? "default" : "secondary"}>
                              {submission.status === "graded" ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Graded</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" /> Pending</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (submission.file_url) {
                                  window.open(submission.file_url, "_blank");
                                  return;
                                }
                                window.history.replaceState(null, "", "/teacher/dashboard#grades");
                                setActiveSection("grades");
                                scrollToSection("grades");
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Classes */}
            <Card id="schedule" ref={scheduleRef}>
              <CardHeader>
                <CardTitle className="font-serif">Upcoming Classes</CardTitle>
                <CardDescription>Your scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={classItem.isToday ? "default" : "outline"}>
                        {classItem.dateLabel}
                      </Badge>
                      <span className="text-sm font-medium">{classItem.time}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{classItem.course}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{classItem.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        <Users className="w-3 h-3 inline mr-1" />
                        {classItem.students} students
                      </span>
                      {classItem.isToday && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => toast({ title: "Class session", description: `Join ${classItem.course}.` })}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card id="assignments" ref={assignmentsRef}>
              <CardHeader>
                <CardTitle className="font-serif">Create Assignment</CardTitle>
                <CardDescription>Publish coursework for your assigned students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select
                    value={newAssignment.courseId}
                    onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, courseId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Assignment title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Instructions for students"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Due date</Label>
                    <Input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max score</Label>
                    <Input
                      type="number"
                      value={newAssignment.maxScore}
                      onChange={(e) => setNewAssignment((prev) => ({ ...prev, maxScore: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateAssignment}>Publish Assignment</Button>
              </CardContent>
            </Card>

            <Card id="grades" ref={gradesRef}>
              <CardHeader>
                <CardTitle className="font-serif">Grade Submissions</CardTitle>
                <CardDescription>Score assignments submitted by students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[450px] overflow-auto">
                {submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No submissions yet.</p>
                ) : (
                  submissions.map((submission) => (
                    <div key={submission.id} className="rounded-lg border p-3 space-y-2">
                      <p className="text-sm font-medium">Submission: {submission.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue={submission.score ?? ""}
                          placeholder="Score"
                          className="w-28"
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (!Number.isNaN(value)) {
                              handleGradeSubmission(submission.id, value);
                            }
                          }}
                        />
                        <Badge variant={submission.status === "graded" ? "default" : "secondary"}>
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card id="settings" ref={settingsRef}>
            <CardHeader>
              <CardTitle className="font-serif">Record Test/Exam Grades</CardTitle>
              <CardDescription>Enter student grades after tests and exams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <Select
                  value={newResult.courseId}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, courseId: value, studentId: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newResult.studentId}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, studentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollments
                      .filter((row) => row.course_id === newResult.courseId)
                      .map((row) => (
                        <SelectItem key={row.student_id} value={row.student_id}>
                          {row.student_id.slice(0, 8)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newResult.assessmentType}
                  onValueChange={(value) => setNewResult((prev) => ({ ...prev, assessmentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <Input
                  placeholder="Title (e.g. Midterm)"
                  value={newResult.title}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Score"
                  value={newResult.score}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, score: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max score"
                  value={newResult.maxScore}
                  onChange={(e) => setNewResult((prev) => ({ ...prev, maxScore: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddResult}>Save Grade</Button>

              <div className="space-y-2">
                {examResults.slice(0, 8).map((result) => (
                  <div key={result.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-muted-foreground">
                        {result.assessment_type} • {result.score}/{result.max_score}
                      </p>
                    </div>
                    <Badge>{new Date(result.recorded_at).toLocaleDateString()}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-center"
                  onClick={() => scrollToSection("schedule")}
                >
                  <Video className="w-6 h-6 mb-2 text-primary" />
                  <span className="font-medium">Start Live Class</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-center"
                  onClick={() => scrollToSection("classes")}
                >
                  <Upload className="w-6 h-6 mb-2 text-primary" />
                  <span className="font-medium">Upload Materials</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-center"
                  onClick={() => scrollToSection("assignments")}
                >
                  <FileText className="w-6 h-6 mb-2 text-primary" />
                  <span className="font-medium">Create Assignment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-center"
                  onClick={() => scrollToSection("grades")}
                >
                  <Edit className="w-6 h-6 mb-2 text-primary" />
                  <span className="font-medium">Enter Grades</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
