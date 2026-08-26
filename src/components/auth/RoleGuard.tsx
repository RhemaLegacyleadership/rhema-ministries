import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, getAccessContext } from "@/lib/portal";

type GuardState = "loading" | "allowed" | "unauthenticated" | "forbidden" | "teacher-pending";

type RoleGuardProps = {
  requiredRole: AppRole;
  children: ReactNode;
};

const roleHomePath: Record<AppRole, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
};

const RoleGuard = ({ requiredRole, children }: RoleGuardProps) => {
  const [state, setState] = useState<GuardState>("loading");
  const [redirectPath, setRedirectPath] = useState("/login");

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      if (!user) {
        setState("unauthenticated");
        return;
      }

      const access = await getAccessContext(user.id, user.app_metadata?.role);
      if (!mounted) return;

      if (access.role !== requiredRole) {
        setRedirectPath(roleHomePath[access.role] ?? "/login");
        setState("forbidden");
        return;
      }

      if (requiredRole === "teacher" && !access.teacherAccessGranted) {
        await supabase.auth.signOut();
        if (!mounted) return;
        setState("teacher-pending");
        return;
      }

      setState("allowed");
    };

    checkAccess();
    return () => {
      mounted = false;
    };
  }, [requiredRole]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking portal access...</p>
      </div>
    );
  }

  if (state === "allowed") return <>{children}</>;
  if (state === "forbidden") return <Navigate to={redirectPath} replace />;
  return <Navigate to="/login" replace />;
};

export default RoleGuard;
