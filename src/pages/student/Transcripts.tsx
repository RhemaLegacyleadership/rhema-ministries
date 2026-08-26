import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  FileText, 
  Download,
  Printer,
  ArrowLeft,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { downloadHtmlDocument } from "@/lib/portal";

const StudentTranscripts = () => {
  const currentYear = new Date().getFullYear();
  const semesterOneKey = `${currentYear}-1`;
  const semesterTwoKey = `${currentYear - 1}-2`;
  const [selectedSemester, setSelectedSemester] = useState(semesterOneKey);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [assignmentGrades, setAssignmentGrades] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const { toast } = useToast();

  const semesterData = {
    [semesterOneKey]: {
      semester: `First Semester ${currentYear}`,
      gpa: 3.75,
      totalCredits: 18,
      courses: [
        { code: "THE101", name: "Introduction to Theology", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "BIB101", name: "Old Testament Survey", credits: 3, grade: "A-", points: 3.7, status: "Completed" },
        { code: "MIN101", name: "Foundations of Ministry", credits: 3, grade: "B+", points: 3.3, status: "Completed" },
        { code: "ETH101", name: "Christian Ethics", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "HIS101", name: "Church History I", credits: 3, grade: "B+", points: 3.3, status: "Completed" },
        { code: "WOR101", name: "Introduction to Worship", credits: 3, grade: "A-", points: 3.7, status: "Completed" },
      ]
    },
    [semesterTwoKey]: {
      semester: `Second Semester ${currentYear - 1}`,
      gpa: 3.65,
      totalCredits: 15,
      courses: [
        { code: "THE100", name: "Pre-Theology", credits: 3, grade: "A-", points: 3.7, status: "Completed" },
        { code: "ENG100", name: "English for Ministry", credits: 3, grade: "B+", points: 3.3, status: "Completed" },
        { code: "COM100", name: "Communication Skills", credits: 3, grade: "A", points: 4.0, status: "Completed" },
        { code: "CPR100", name: "Computer Literacy", credits: 3, grade: "B", points: 3.0, status: "Completed" },
        { code: "ORI100", name: "Academic Orientation", credits: 3, grade: "A", points: 4.0, status: "Completed" },
      ]
    }
  };

  const currentData = semesterData[selectedSemester as keyof typeof semesterData];

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setUser(auth.user);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", auth.user.id)
        .maybeSingle();
      setProfile(profileData || null);

      const { data: submissionRows } = await supabase
        .from("assignment_submissions")
        .select("*")
        .eq("student_id", auth.user.id)
        .eq("status", "graded")
        .order("graded_at", { ascending: false });
      setAssignmentGrades(submissionRows || []);

      const { data: examRows } = await supabase
        .from("exam_results")
        .select("*")
        .eq("student_id", auth.user.id)
        .order("recorded_at", { ascending: false });
      setExamResults(examRows || []);
    };
    init();
  }, []);

  const averageScore = useMemo(() => {
    const values = [
      ...assignmentGrades.map((item) => Number(item.score)).filter((v) => !Number.isNaN(v)),
      ...examResults.map((item) => Number(item.score)).filter((v) => !Number.isNaN(v)),
    ];
    if (values.length === 0) return null;
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  }, [assignmentGrades, examResults]);
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ").trim() ||
    "Student";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";

  const overallStats = {
    totalCredits: 33,
    cumulativeGPA: 3.70,
    program: "Diploma in Ministry",
    expectedGraduation: `December ${currentYear + 1}`
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const studentName = `${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`.trim() || "Student";
    const assignmentRows = assignmentGrades
      .map(
        (row) =>
          `<tr><td>${row.file_name}</td><td>${row.score ?? "-"}</td><td>${row.graded_at ? new Date(row.graded_at).toLocaleDateString() : "-"}</td></tr>`,
      )
      .join("");
    const examRows = examResults
      .map(
        (row) =>
          `<tr><td>${row.assessment_type}</td><td>${row.title}</td><td>${row.score}/${row.max_score}</td><td>${new Date(row.recorded_at).toLocaleDateString()}</td></tr>`,
      )
      .join("");

    const html = `
      <html>
      <head><title>Academic Result Report</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>Rhema Fits Bible College - Result Report</h1>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${user?.email || "-"}</p>
        <p><strong>Average Score:</strong> ${averageScore ?? "N/A"}</p>
        <h2>Assignment Grades</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><th>Submission</th><th>Score</th><th>Graded Date</th></tr>
          ${assignmentRows || "<tr><td colspan='3'>No assignment grades yet</td></tr>"}
        </table>
        <h2 style="margin-top: 20px;">Test and Exam Results</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><th>Type</th><th>Title</th><th>Score</th><th>Date</th></tr>
          ${examRows || "<tr><td colspan='4'>No test/exam results yet</td></tr>"}
        </table>
      </body>
      </html>
    `;

    downloadHtmlDocument("academic-result-report.html", html);
    toast({ title: "Report downloaded" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-navy border-b border-navy-600 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-white bg-white text-navy-800 hover:bg-gold-50 hover:text-navy-900 font-semibold shadow-sm"
                asChild
              >
                <Link to="/student/dashboard">
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  <span>Back</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-serif font-bold text-gold-50">Transcripts & Reports</h1>
                <p className="text-base font-bold text-gold-50">View and download your academic records</p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-navy-800 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Academic Summary */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="text-2xl font-bold text-foreground">{averageScore ?? overallStats.cumulativeGPA}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-foreground">{overallStats.totalCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="text-lg font-bold text-foreground">{overallStats.program}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Graduation</p>
                  <p className="text-lg font-bold text-foreground">{overallStats.expectedGraduation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester Transcript */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-serif">Academic Transcript</CardTitle>
                <CardDescription>Select a semester to view grades</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={semesterOneKey}>{`First Semester ${currentYear}`}</SelectItem>
                    <SelectItem value={semesterTwoKey}>{`Second Semester ${currentYear - 1}`}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="w-4 h-4" />
                </Button>
                <Button variant="gold" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Printable Transcript Header */}
            <div className="hidden print:block mb-8 text-center">
              <h1 className="text-2xl font-serif font-bold">Rhema Fits School of Ministry</h1>
              <p className="text-sm text-muted-foreground">Official Academic Transcript</p>
              <div className="mt-4 text-sm">
                <p><strong>Student Name:</strong> {`${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`.trim() || "Student"}</p>
                <p><strong>Student ID:</strong> {`RFM${currentYear}${(user?.id || "00000000").slice(0, 4).toUpperCase()}`}</p>
                <p><strong>Program:</strong> {overallStats.program}</p>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Grade Points</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{course.code}</TableCell>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell className="text-center">{course.credits}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={course.grade.startsWith("A") ? "default" : "secondary"}>
                          {course.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{course.points.toFixed(1)}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-emerald-600 text-sm">{course.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Semester Summary */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 flex flex-wrap gap-8">
              <div>
                <p className="text-sm text-muted-foreground">Semester</p>
                <p className="font-semibold">{currentData.semester}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="font-semibold">{currentData.totalCredits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Semester GPA</p>
                <p className="font-semibold text-gold-600">{currentData.gpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                <p className="font-semibold text-gold-600">{averageScore ?? overallStats.cumulativeGPA}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Teacher Grading Summary</CardTitle>
            <CardDescription>Assignment and test/exam marks entered by teachers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Assignment Grades</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Date Graded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignmentGrades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No graded assignments yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignmentGrades.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.file_name}</TableCell>
                          <TableCell className="text-center">{row.score ?? "-"}</TableCell>
                          <TableCell className="text-center">
                            {row.graded_at ? new Date(row.graded_at).toLocaleDateString() : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Test and Exam Results</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Recorded On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No test/exam marks yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      examResults.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="capitalize">{row.assessment_type}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell className="text-center">{row.score}/{row.max_score}</TableCell>
                          <TableCell className="text-center">{new Date(row.recorded_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="font-serif">Download Documents</CardTitle>
            <CardDescription>Get official copies of your academic records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <FileText className="w-6 h-6 mb-2 text-primary" />
                <span className="font-medium">Official Transcript</span>
                <span className="text-xs text-muted-foreground">Complete academic record</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <FileText className="w-6 h-6 mb-2 text-primary" />
                <span className="font-medium">Semester Report</span>
                <span className="text-xs text-muted-foreground">Current semester grades</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col items-start">
                <Award className="w-6 h-6 mb-2 text-gold-500" />
                <span className="font-medium">Enrollment Certificate</span>
                <span className="text-xs text-muted-foreground">Proof of enrollment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentTranscripts;
