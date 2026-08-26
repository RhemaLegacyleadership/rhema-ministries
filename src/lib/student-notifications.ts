import { supabase } from "@/integrations/supabase/client";

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  category: "payment" | "admission" | "assignment" | "exam";
  link: string;
  read: boolean;
};

const getReadKey = (studentId: string) => `student-notifications-read-${studentId}`;

const readSeenIds = (studentId: string): Set<string> => {
  try {
    const raw = localStorage.getItem(getReadKey(studentId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((item) => typeof item === "string"));
  } catch {
    return new Set();
  }
};

const writeSeenIds = (studentId: string, ids: string[]) => {
  localStorage.setItem(getReadKey(studentId), JSON.stringify(ids));
};

export const markNotificationsAsRead = (studentId: string, ids: string[]) => {
  if (!studentId || ids.length === 0) return;
  const seen = readSeenIds(studentId);
  ids.forEach((id) => seen.add(id));
  writeSeenIds(studentId, Array.from(seen));
};

export const markAllNotificationsAsRead = (studentId: string, notifications: StudentNotification[]) => {
  markNotificationsAsRead(
    studentId,
    notifications.map((item) => item.id),
  );
};

export const fetchStudentNotifications = async (studentId: string): Promise<StudentNotification[]> => {
  const [paymentsRes, applicationsRes, submissionsRes, examsRes] = await Promise.all([
    supabase
      .from("fee_payments")
      .select("id, status, amount, submitted_at, verified_at")
      .eq("student_id", studentId)
      .in("status", ["verified", "rejected"])
      .order("submitted_at", { ascending: false })
      .limit(20),
    supabase
      .from("admission_applications")
      .select("id, status, submitted_at, reviewed_at")
      .eq("student_id", studentId)
      .in("status", ["accepted", "rejected"])
      .order("submitted_at", { ascending: false })
      .limit(20),
    supabase
      .from("assignment_submissions")
      .select("id, status, file_name, graded_at, submitted_at, score")
      .eq("student_id", studentId)
      .eq("status", "graded")
      .order("graded_at", { ascending: false })
      .limit(20),
    supabase
      .from("exam_results")
      .select("id, title, assessment_type, score, max_score, recorded_at")
      .eq("student_id", studentId)
      .order("recorded_at", { ascending: false })
      .limit(20),
  ]);

  const seen = readSeenIds(studentId);
  const notifications: StudentNotification[] = [];

  for (const payment of paymentsRes.data || []) {
    const createdAt = payment.verified_at || payment.submitted_at;
    const id = `payment-${payment.id}-${payment.status}`;
    notifications.push({
      id,
      title: payment.status === "verified" ? "School fee verified" : "School fee rejected",
      message:
        payment.status === "verified"
          ? `Your payment of frs CFA ${Number(payment.amount || 0).toLocaleString()} has been confirmed.`
          : `Your payment verification request for frs CFA ${Number(payment.amount || 0).toLocaleString()} was rejected. Please contact admin.`,
      createdAt,
      category: "payment",
      link: "/student/payments",
      read: seen.has(id),
    });
  }

  for (const app of applicationsRes.data || []) {
    const createdAt = app.reviewed_at || app.submitted_at;
    const id = `application-${app.id}-${app.status}`;
    notifications.push({
      id,
      title: app.status === "accepted" ? "Admission accepted" : "Admission update",
      message:
        app.status === "accepted"
          ? "Your admission application was accepted. You can continue with your onboarding."
          : "Your admission application was reviewed and needs follow-up from admin.",
      createdAt,
      category: "admission",
      link: "/student/dashboard",
      read: seen.has(id),
    });
  }

  for (const submission of submissionsRes.data || []) {
    const createdAt = submission.graded_at || submission.submitted_at;
    const id = `submission-${submission.id}-${submission.status}`;
    notifications.push({
      id,
      title: "Assignment graded",
      message: `${submission.file_name} was graded${submission.score != null ? ` (${submission.score})` : ""}.`,
      createdAt,
      category: "assignment",
      link: "/student/assignments",
      read: seen.has(id),
    });
  }

  for (const exam of examsRes.data || []) {
    const id = `exam-${exam.id}`;
    notifications.push({
      id,
      title: "New test/exam result",
      message: `${exam.title} (${exam.assessment_type}) scored ${exam.score}/${exam.max_score}.`,
      createdAt: exam.recorded_at,
      category: "exam",
      link: "/student/transcripts",
      read: seen.has(id),
    });
  }

  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
