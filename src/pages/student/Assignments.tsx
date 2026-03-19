import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen, CreditCard, FileText, Video,
  Settings, LogOut, Menu, X, Upload, Trash2, User, File, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { downloadHtmlDocument } from "@/lib/portal";
import { getStudentApprovalState } from "@/lib/student-access";

const StudentAssignments = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<any[]>([]);
  const [canAccessCourseMaterial, setCanAccessCourseMaterial] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUser(user);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, program")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(profileData || null);
      const approvalState = await getStudentApprovalState(user.id);
      setCanAccessCourseMaterial(approvalState.canAccessCourseMaterial);
      if (!approvalState.canAccessCourseMaterial) return;
      await Promise.all([fetchSubmissions(user.id), fetchTeacherAssignments(user.id)]);
    };
    init();
  }, [navigate]);

  const fetchSubmissions = async (userId: string) => {
    const { data } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false });
    if (data) setSubmissions(data);
  };

  const fetchTeacherAssignments = async (userId: string) => {
    const { data: enrollments } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .eq("student_id", userId);

    const courseIds = (enrollments || []).map((e) => e.course_id);
    if (courseIds.length === 0) {
      setTeacherAssignments([]);
      return;
    }

    const { data } = await supabase
      .from("teacher_assignments")
      .select("*")
      .in("course_id", courseIds)
      .order("created_at", { ascending: false });
    setTeacherAssignments(data || []);
  };

  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const getAssignmentFilename = (title: string) =>
    `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "assignment"}-brief.html`;

  const handleDownloadTeacherAssignment = (assignment: any) => {
    const title = assignment?.title ? String(assignment.title) : "Untitled Assignment";
    const description = assignment?.description ? String(assignment.description) : "No description provided.";
    const dueDate = assignment?.due_date
      ? new Date(assignment.due_date).toLocaleDateString()
      : "No due date";
    const maxScore = Number(assignment?.max_score) || 100;
    const createdAt = assignment?.created_at
      ? new Date(assignment.created_at).toLocaleDateString()
      : "Unknown";

    const html = `
      <html>
      <head><title>${escapeHtml(title)}</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.5;">
        <h1>Teacher Assignment Brief</h1>
        <p><strong>Title:</strong> ${escapeHtml(title)}</p>
        <p><strong>Description:</strong> ${escapeHtml(description)}</p>
        <p><strong>Due Date:</strong> ${escapeHtml(dueDate)}</p>
        <p><strong>Maximum Score:</strong> ${maxScore}</p>
        <p><strong>Published On:</strong> ${escapeHtml(createdAt)}</p>
      </body>
      </html>
    `;

    downloadHtmlDocument(getAssignmentFilename(title), html);
    toast({ title: "Assignment downloaded" });
  };

  const handleSubmit = async () => {
    if (!canAccessCourseMaterial) {
      toast({
        title: "Assignments locked",
        description: "Wait for admin payment verification and admission approval.",
        variant: "destructive",
      });
      return;
    }
    if (!user || !selectedFile || !selectedAssignmentId) {
      toast({ title: "Missing fields", description: "Please select an assignment and file.", variant: "destructive" });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 10MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("assignments")
      .upload(filePath, selectedFile);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from("assignment_submissions").insert({
      assignment_id: selectedAssignmentId,
      student_id: user.id,
      file_url: filePath,
      file_name: selectedFile.name,
    });

    if (insertError) {
      toast({ title: "Submission failed", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Assignment submitted successfully!" });
      setSelectedAssignmentId(""); setSelectedFile(null);
      fetchSubmissions(user.id);
    }
    setUploading(false);
  };

  const handleDelete = async (assignment: any) => {
    await supabase.storage.from("assignments").remove([assignment.file_url]);
    await supabase.from("assignment_submissions").delete().eq("id", assignment.id);
    toast({ title: "Assignment deleted" });
    if (user) fetchSubmissions(user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: BookOpen, label: "Dashboard", href: "/student/dashboard" },
    { icon: Video, label: "My Courses", href: "/student/courses" },
    { icon: FileText, label: "Assignments", href: "/student/assignments", active: true },
    { icon: CreditCard, label: "Payments", href: "/student/payments" },
    { icon: FileText, label: "Transcripts", href: "/student/transcripts" },
    { icon: Settings, label: "Settings", href: "/student/settings" },
    { icon: User, label: "Profile", href: "/student/profile" },
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

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 overflow-y-auto overscroll-contain lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
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
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all">
              <LogOut className="w-5 h-5" /><span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Assignments</h1>
                <p className="text-sm text-muted-foreground">Submit and manage your assignments</p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-navy-600 to-navy-700 text-gold-50 font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {!canAccessCourseMaterial && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Assignments Locked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You can submit and download assignments only after admin verifies your registration payment and accepts your admission.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Teacher Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {!canAccessCourseMaterial ? (
                <p className="text-muted-foreground text-center py-8">No access to course assignments yet.</p>
              ) : teacherAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assignments published by your teachers yet.</p>
              ) : (
                <div className="space-y-3">
                  {teacherAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.description || "No description provided."}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"} | Max score: {assignment.max_score ?? 100}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTeacherAssignment(assignment)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Teacher Assignment *</Label>
                <Select value={selectedAssignmentId} onValueChange={setSelectedAssignmentId}>
                  <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
                  <SelectContent>
                    {teacherAssignments.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File *</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <File className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to select file (PDF, DOC, DOCX — max 10MB)</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.pptx" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleSubmit} disabled={uploading || !canAccessCourseMaterial}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Submitting..." : "Submit Assignment"}
              </Button>
            </CardContent>
          </Card>

          {/* Submitted Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Submitted Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assignments submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{a.file_name}</h4>
                          <p className="text-xs text-muted-foreground">Status: {a.status}</p>
                          <p className="text-xs text-muted-foreground">{new Date(a.submitted_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentAssignments;
