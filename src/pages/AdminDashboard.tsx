import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StationCard from "@/components/StationCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ShieldCheck, Users, Fuel, Activity, CheckCircle, Clock, Search, XCircle, Mail, Lock, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-2xl scale-150" />
            <img src={logo} alt={t("app_name")} className="w-16 h-16 rounded-full relative z-10 shadow-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white">{t("admin")}</h1>
          <p className="text-blue-200 text-sm mt-1">{t("dashboard")}</p>
        </div>
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">{t("login")}</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-semibold">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10 bg-background" placeholder="admin@email.com" dir="ltr" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="ps-10 bg-background" placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit" className="w-full accent-gradient !text-accent-foreground font-bold border-0 h-11 hover:opacity-90" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [deleteStation, setDeleteStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // If logged in but not admin, redirect home
  useEffect(() => {
    if (authLoading) return;
    if (user && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [stationsRes, profilesRes] = await Promise.all([
      supabase.from("stations").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    setStations(stationsRes.data || []);
    setProfiles(profilesRes.data || []);
    setLoading(false);
  };

  const handleVerify = async (stationId: string, status: "verified" | "rejected") => {
    const { error } = await supabase
      .from("stations")
      .update({ verification_status: status, is_verified: status === "verified" })
      .eq("id", stationId);
    if (!error) {
      toast.success(status === "verified" ? t("mark_verified") + " ✓" : t("mark_rejected") + " ✓");
      fetchAll();
    }
  };

  const handleDelete = async () => {
    if (!deleteStation) return;
    const { error } = await supabase.from("stations").delete().eq("id", deleteStation.id);
    if (!error) {
      toast.success(t("delete") + " ✓");
      setDeleteStation(null);
      fetchAll();
    }
  };

  const filtered = stations.filter((s) => {
    const matchSearch =
      !search ||
      s.station_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.verification_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: t("total_stations"), value: stations.length, icon: <Fuel className="w-5 h-5" />, color: "text-primary" },
    { label: t("active_stations"), value: stations.filter((s) => s.is_active).length, icon: <Activity className="w-5 h-5" />, color: "text-green-600" },
    { label: t("pending_verification"), value: stations.filter((s) => s.verification_status === "pending").length, icon: <Clock className="w-5 h-5" />, color: "text-amber-600" },
    { label: t("total_owners"), value: profiles.length, icon: <Users className="w-5 h-5" />, color: "text-blue-600" },
  ];

  if (authLoading) return null;

  // Show admin login if not logged in
  if (!user) {
    return <AdminLogin onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black">{t("admin")}</h1>
              <p className="text-primary-foreground/60 text-sm">{t("dashboard")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-primary-foreground/60 mb-1">{stat.icon}</div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="ps-10 bg-background"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "verified", "rejected"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filterStatus === f ? "default" : "outline"}
                onClick={() => setFilterStatus(f)}
                className="text-xs font-semibold"
              >
                {t(f === "all" ? "all" : f)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stations */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t("no_stations")}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((station) => (
              <div key={station.id} className="space-y-2">
                <StationCard
                  station={station}
                  onDelete={() => setDeleteStation(station)}
                />
                {/* Verification Actions */}
                {station.verification_status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-1 text-xs font-bold"
                      onClick={() => handleVerify(station.id, "verified")}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {t("mark_verified")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white gap-1 text-xs font-bold"
                      onClick={() => handleVerify(station.id, "rejected")}
                    >
                      <XCircle className="w-3 h-3" />
                      {t("mark_rejected")}
                    </Button>
                  </div>
                )}
                {station.verification_status !== "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1"
                    onClick={() =>
                      handleVerify(
                        station.id,
                        station.verification_status === "verified" ? "rejected" : "verified"
                      )
                    }
                  >
                    {station.verification_status === "verified" ? t("mark_rejected") : t("mark_verified")}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteStation} onOpenChange={() => setDeleteStation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirm_delete_desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t("delete_confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
