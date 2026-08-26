import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Phone,
  ArrowLeft,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const PROGRAM_PRICING: Record<
  string,
  { label: string; registrationFee: number; schoolFees: number; pricePerCredit: number }
> = {
  certificate: {
    label: "Certificate Program",
    registrationFee: 5000,
    schoolFees: 60000,
    pricePerCredit: 2000,
  },
  diploma: {
    label: "Diploma Program",
    registrationFee: 7500,
    schoolFees: 288000,
    pricePerCredit: 6000,
  },
  degree: {
    label: "Bachelor's Degree Program",
    registrationFee: 10000,
    schoolFees: 600000,
    pricePerCredit: 5000,
  },
  masters: {
    label: "Masters Program",
    registrationFee: 10000,
    schoolFees: 640000,
    pricePerCredit: 10000,
  },
};

const StudentPayments = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [admissionApproved, setAdmissionApproved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setUser(auth.user);
      setUserId(auth.user.id);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, program")
        .eq("id", auth.user.id)
        .maybeSingle();
      setProfile(profileData || null);
      const { data } = await supabase
        .from("fee_payments")
        .select("*")
        .eq("student_id", auth.user.id)
        .order("submitted_at", { ascending: false });
      setPayments(data || []);
      const { data: applications } = await supabase
        .from("admission_applications")
        .select("status")
        .eq("student_id", auth.user.id)
        .order("submitted_at", { ascending: false })
        .limit(1);
      setAdmissionApproved((applications || []).some((row) => row.status === "accepted"));
    };
    init();
  }, []);

  const handlePaymentVerificationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Login required",
        description: "Please log in to submit payment details.",
        variant: "destructive",
      });
      return;
    }
    if (!transactionNumber.trim()) {
      toast({
        title: "Transaction number required",
        description: "Please provide your payment transaction number.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);

    const { error } = await supabase.from("fee_payments").insert({
      student_id: userId,
      amount: Number(amount),
      method: "mtn_mobile_money",
      paid_to_phone: "+237679286428",
      transaction_number: transactionNumber.trim(),
      status: "pending",
    });

    setIsProcessing(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment submitted",
      description: "Your payment proof was submitted for admin verification.",
    });
    setAmount("");
    setPhoneNumber("");
    setTransactionNumber("");

    const { data } = await supabase
      .from("fee_payments")
      .select("*")
      .eq("student_id", userId)
      .order("submitted_at", { ascending: false });
    setPayments(data || []);
  };

  const programKey = (profile?.program || user?.user_metadata?.program || "").toString().toLowerCase();
  const pricing = PROGRAM_PRICING[programKey] || PROGRAM_PRICING.degree;
  const hasAnySubmission = payments.length > 0;
  const hasVerifiedSubmission = payments.some((payment) => payment.status === "verified");

  const feeStructure = [
    {
      item: "Registration Fee",
      amount: pricing.registrationFee,
      stage: "Pay during application process",
      status: hasVerifiedSubmission ? "verified" : hasAnySubmission ? "pending" : "required",
    },
    {
      item: "School Fees",
      amount: pricing.schoolFees,
      stage: admissionApproved ? "Pay after admission approval" : "Locked until admission is approved",
      status: admissionApproved ? "required" : "locked",
    },
    {
      item: "Price Per Credit",
      amount: pricing.pricePerCredit,
      stage: `Applies to ${pricing.label}`,
      status: "info",
    },
  ];

  const paymentHistory = payments.map((payment) => ({
    id: payment.transaction_number,
    date: payment.submitted_at,
    amount: payment.amount,
    method: "MTN MoMo",
    status: payment.status,
  }));

  const totalPaid = payments
    .filter((payment) => payment.status === "verified")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalPending = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingRequests = useMemo(
    () => payments.filter((payment) => payment.status === "pending").length,
    [payments],
  );
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

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`student-fee-payments-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fee_payments", filter: `student_id=eq.${userId}` },
        async () => {
          const { data } = await supabase
            .from("fee_payments")
            .select("*")
            .eq("student_id", userId)
            .order("submitted_at", { ascending: false });
          setPayments(data || []);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admission_applications", filter: `student_id=eq.${userId}` },
        async () => {
          const { data: applications } = await supabase
            .from("admission_applications")
            .select("status")
            .eq("student_id", userId)
            .order("submitted_at", { ascending: false })
            .limit(1);
          setAdmissionApproved((applications || []).some((row) => row.status === "accepted"));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <h1 className="text-xl font-serif font-bold text-gold-50">Payments & Fees</h1>
                <p className="text-base font-bold text-gold-50">Manage your school fees</p>
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
        {!admissionApproved && (
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-5">
              <p className="font-semibold text-foreground">Admissions Documents Reminder</p>
              <p className="text-sm text-muted-foreground mt-1">
                All admission documents listed should be sent to <span className="font-semibold">Admission@rhemafitsministries.com</span>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-foreground">frs CFA {totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">frs CFA {totalPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold text-foreground">frs CFA {(totalPaid + totalPending).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Fee Structure */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Fee Structure</CardTitle>
                <CardDescription>Program-specific fees and payment stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeStructure.map((fee, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{fee.item}</h4>
                        <p className="text-sm text-muted-foreground">{fee.stage}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className="font-semibold text-foreground">frs CFA {fee.amount.toLocaleString()}</p>
                        <Badge variant={fee.status === "verified" ? "default" : "secondary"}>
                          {fee.status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {fee.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {fee.status === "locked" && <AlertCircle className="w-3 h-3 mr-1" />}
                          {fee.status === "required" && <Clock className="w-3 h-3 mr-1" />}
                          {fee.status === "verified"
                            ? "Verified"
                            : fee.status === "pending"
                            ? "Pending"
                            : fee.status === "locked"
                            ? "Locked"
                            : fee.status === "required"
                            ? "Required"
                            : "Info"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Payment History</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div 
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === "verified"
                            ? "bg-emerald-100 text-emerald-600"
                            : payment.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {payment.status === "verified" ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : payment.status === "pending" ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <AlertCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{payment.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {payment.method} • {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className="font-semibold text-foreground">frs CFA {payment.amount.toLocaleString()}</p>
                        {payment.status === "verified" && (
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Verification Request */}
          <Card className="h-fit sticky top-24">
            <CardHeader className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-navy-800">Verify Payment</CardTitle>
                  <CardDescription className="text-navy-700/70">
                    Submit your payment proof for admin approval
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePaymentVerificationRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Payer Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txn">Transaction Number</Label>
                  <Input
                    id="txn"
                    placeholder="e.g. 23891087654"
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (frs CFA)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  <p className="text-muted-foreground">Verification target account:</p>
                  <p className="text-lg font-bold text-foreground mb-2">MTN MoMo +237 679 286 428</p>
                  <p className="text-muted-foreground">Program:</p>
                  <p className="text-lg font-bold text-foreground mb-2">{pricing.label}</p>
                  <p className="text-muted-foreground">Suggested amount for this stage:</p>
                  <p className="text-lg font-bold text-foreground mb-2">
                    frs CFA {(admissionApproved ? pricing.schoolFees : pricing.registrationFee).toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">Pending Balance:</p>
                  <p className="text-lg font-bold text-foreground">frs CFA {totalPending.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-2">Open verification requests: {pendingRequests}</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-navy-800 font-semibold"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Verify Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  This form does not process payment online. It submits your transaction details for admin verification.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentPayments;
