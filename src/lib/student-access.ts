import { supabase } from "@/integrations/supabase/client";

export type StudentApprovalState = {
  admissionAccepted: boolean;
  paymentVerified: boolean;
  canAccessCourseMaterial: boolean;
};

export const getStudentApprovalState = async (userId: string): Promise<StudentApprovalState> => {
  const [{ data: admissions }, { data: payments }] = await Promise.all([
    supabase
      .from("admission_applications")
      .select("status")
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(1),
    supabase
      .from("fee_payments")
      .select("status")
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false }),
  ]);

  const admissionAccepted = (admissions || []).some((row) => row.status === "accepted");
  const paymentVerified = (payments || []).some((row) => row.status === "verified");

  return {
    admissionAccepted,
    paymentVerified,
    canAccessCourseMaterial: admissionAccepted && paymentVerified,
  };
};
