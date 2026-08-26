import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/Dashboard";
import StudentPayments from "./pages/student/Payments";
import StudentTranscripts from "./pages/student/Transcripts";
import StudentProfile from "./pages/student/Profile";
import StudentAssignments from "./pages/student/Assignments";
import StudentNotifications from "./pages/student/Notifications";
import StudentCourses from "./pages/student/Courses";
import StudentCourseDetail from "./pages/student/CourseDetail";
import StudentSettings from "./pages/student/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CertificateProgram from "./pages/programs/Certificate";
import DiplomaProgram from "./pages/programs/Diploma";
import DegreeProgram from "./pages/programs/Degree";
import MastersProgram from "./pages/programs/Masters";
import NotFound from "./pages/NotFound";
import RoleGuard from "./components/auth/RoleGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          
          {/* Program Pages */}
          <Route path="/programs/certificate" element={<CertificateProgram />} />
          <Route path="/programs/diploma" element={<DiplomaProgram />} />
          <Route path="/programs/degree" element={<DegreeProgram />} />
          <Route path="/programs/masters" element={<MastersProgram />} />
          
          {/* Student Routes */}
          <Route path="/students/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/students/*" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<RoleGuard requiredRole="student"><StudentDashboard /></RoleGuard>} />
          <Route path="/student/payments" element={<RoleGuard requiredRole="student"><StudentPayments /></RoleGuard>} />
          <Route path="/student/transcripts" element={<RoleGuard requiredRole="student"><StudentTranscripts /></RoleGuard>} />
          <Route path="/student/profile" element={<RoleGuard requiredRole="student"><StudentProfile /></RoleGuard>} />
          <Route path="/student/assignments" element={<RoleGuard requiredRole="student"><StudentAssignments /></RoleGuard>} />
          <Route
            path="/student/courses"
            element={
              <RoleGuard requiredRole="student">
                <StudentCourses />
              </RoleGuard>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <RoleGuard requiredRole="student">
                <StudentCourseDetail />
              </RoleGuard>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <RoleGuard requiredRole="student"><StudentNotifications /></RoleGuard>
            }
          />
          <Route
            path="/student/settings"
            element={
              <RoleGuard requiredRole="student">
                <StudentSettings />
              </RoleGuard>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<RoleGuard requiredRole="admin"><AdminDashboard /></RoleGuard>} />
          <Route path="/admin/students" element={<Navigate to="/admin/dashboard#students" replace />} />
          <Route path="/admin/teachers" element={<Navigate to="/admin/dashboard#teachers" replace />} />
          <Route path="/admin/courses" element={<Navigate to="/admin/dashboard#courses" replace />} />
          <Route path="/admin/programs" element={<Navigate to="/admin/dashboard#programs" replace />} />
          <Route path="/admin/payments" element={<Navigate to="/admin/dashboard#payments" replace />} />
          <Route path="/admin/reports" element={<Navigate to="/admin/dashboard#reports" replace />} />
          <Route path="/admin/settings" element={<Navigate to="/admin/dashboard#settings" replace />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<RoleGuard requiredRole="teacher"><TeacherDashboard /></RoleGuard>} />
          <Route path="/teacher/classes" element={<Navigate to="/teacher/dashboard#classes" replace />} />
          <Route path="/teacher/students" element={<Navigate to="/teacher/dashboard#students" replace />} />
          <Route path="/teacher/assignments" element={<Navigate to="/teacher/dashboard#assignments" replace />} />
          <Route path="/teacher/schedule" element={<Navigate to="/teacher/dashboard#schedule" replace />} />
          <Route path="/teacher/grades" element={<Navigate to="/teacher/dashboard#grades" replace />} />
          <Route path="/teacher/settings" element={<Navigate to="/teacher/dashboard#settings" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
