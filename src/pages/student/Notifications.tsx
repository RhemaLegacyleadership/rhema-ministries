import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchStudentNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
  type StudentNotification,
} from "@/lib/student-notifications";

const StudentNotifications = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      setStudentId(user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(profileData || null);

      const items = await fetchStudentNotifications(user.id);
      setNotifications(items);
    };
    init();
  }, []);

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ").trim() ||
    "Student";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("") || "S";

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const handleMarkAllRead = () => {
    if (!studentId) return;
    markAllNotificationsAsRead(studentId, notifications);
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleOpenNotification = (item: StudentNotification) => {
    if (!studentId || item.read) return;
    markNotificationsAsRead(studentId, [item.id]);
    setNotifications((prev) => prev.map((row) => (row.id === item.id ? { ...row, read: true } : row)));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-gradient-navy border-b border-navy-600">
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
                <h1 className="text-xl font-serif font-bold text-gold-50">Notifications</h1>
                <p className="text-base font-bold text-gold-50">Track your latest school activity updates</p>
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

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Activity Feed
              </CardTitle>
              <CardDescription>{unreadCount} unread notification(s)</CardDescription>
            </div>
            <Button variant="outline" onClick={handleMarkAllRead} disabled={notifications.length === 0 || unreadCount === 0}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <Link key={item.id} to={item.link} onClick={() => handleOpenNotification(item)}>
                  <div
                    className={`rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      item.read ? "bg-background" : "bg-primary/5 border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium">{item.title}</p>
                      <Badge variant={item.read ? "outline" : "default"}>{item.read ? "Read" : "New"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentNotifications;
