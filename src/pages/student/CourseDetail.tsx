import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, LogOut, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getStudentApprovalState } from "@/lib/student-access";

type CourseInfo = {
  id: string;
  code: string;
  title: string;
  teacher_id: string | null;
};

type ChatMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
};

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [teacherName, setTeacherName] = useState("Assigned Teacher");
  const [assignments, setAssignments] = useState<
    Array<{ id: string; title: string; description: string | null; due_date: string | null; max_score: number }>
  >([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!courseId) {
      navigate("/student/courses");
      return;
    }

    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        navigate("/login");
        return;
      }

      setUserId(auth.user.id);

      const approvalState = await getStudentApprovalState(auth.user.id);
      if (!approvalState.canAccessCourseMaterial) {
        toast({
          title: "Course access locked",
          description: "Wait for admin payment verification and admission approval.",
          variant: "destructive",
        });
        navigate("/student/payments");
        return;
      }

      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("course_id", courseId)
        .eq("student_id", auth.user.id)
        .maybeSingle();

      if (!enrollment) {
        toast({
          title: "Access denied",
          description: "You are not enrolled in this course.",
          variant: "destructive",
        });
        navigate("/student/courses");
        return;
      }

      await Promise.all([loadCourse(courseId), loadAssignments(courseId), loadMessages(courseId)]);
    };

    void init();
  }, [courseId, navigate, toast]);

  useEffect(() => {
    if (!courseId) return;

    const channel = supabase
      .channel(`course-chat-${courseId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "course_messages", filter: `course_id=eq.${courseId}` },
        async () => {
          await loadMessages(courseId);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [courseId]);

  const loadCourse = async (id: string) => {
    const { data } = await supabase.from("courses").select("id, code, title, teacher_id").eq("id", id).maybeSingle();
    if (!data) return;
    setCourse(data as CourseInfo);

    if (data.teacher_id) {
      const { data: teacherProfile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", data.teacher_id)
        .maybeSingle();
      const fullName = [teacherProfile?.first_name, teacherProfile?.last_name].filter(Boolean).join(" ").trim();
      setTeacherName(fullName || "Assigned Teacher");
    }
  };

  const loadAssignments = async (id: string) => {
    const { data } = await supabase
      .from("teacher_assignments")
      .select("id, title, description, due_date, max_score")
      .eq("course_id", id)
      .order("created_at", { ascending: false });
    setAssignments(data || []);
  };

  const loadMessages = async (id: string) => {
    const { data } = await supabase
      .from("course_messages")
      .select("id, sender_id, receiver_id, body, created_at")
      .eq("course_id", id)
      .order("created_at", { ascending: true });
    setMessages((data || []) as ChatMessage[]);
  };

  const sendMessage = async () => {
    const text = messageText.trim();
    if (!text || !userId || !course?.teacher_id || !courseId) return;

    setSending(true);
    const { error } = await supabase.from("course_messages").insert({
      course_id: courseId,
      sender_id: userId,
      receiver_id: course.teacher_id,
      body: text,
    });
    setSending(false);

    if (error) {
      toast({ title: "Message not sent", description: error.message, variant: "destructive" });
      return;
    }

    setMessageText("");
    toast({ title: "Question sent to teacher" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  const title = useMemo(() => {
    if (!course) return "Course";
    return `${course.code} - ${course.title}`;
  }, [course]);

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Teacher: {teacherName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/student/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-muted-foreground">No assignments published yet for this course.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-lg border p-4">
                    <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{assignment.description || "No description provided."}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"} | Max score:{" "}
                      {assignment.max_score}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Ask Your Teacher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72 overflow-auto rounded-lg border p-3 bg-muted/30 space-y-2">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Start the conversation by asking your question.</p>
              ) : (
                messages.map((message) => {
                  const mine = message.sender_id === userId;
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          mine ? "bg-primary text-primary-foreground" : "bg-card border text-foreground"
                        }`}
                      >
                        <p>{message.body}</p>
                        <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Type your question to the teacher..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
              />
              <Button onClick={() => void sendMessage()} disabled={sending || !messageText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default StudentCourseDetail;
