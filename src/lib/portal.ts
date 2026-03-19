import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "teacher" | "admin";

export type AccessContext = {
  role: AppRole;
  teacherAccessGranted: boolean;
};

const toAppRole = (value: unknown): AppRole | null => {
  if (value === "student" || value === "teacher" || value === "admin") return value;
  return null;
};

export const getAccessContext = async (userId: string, roleHint?: unknown): Promise<AccessContext> => {
  const hintedRole = toAppRole(roleHint);

  const { data, error } = await supabase.rpc("get_my_access_context");
  const row = data?.[0];

  if (row) {
    return {
      role: row.role,
      teacherAccessGranted: row.teacher_access_granted,
    };
  }

  if (error) {
    console.error("Failed to resolve access context:", error.message);
  }

  if (hintedRole) {
    return { role: hintedRole, teacherAccessGranted: hintedRole === "teacher" };
  }

  return { role: "student", teacherAccessGranted: false };
};

export const downloadHtmlDocument = (filename: string, html: string) => {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
