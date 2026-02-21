import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import StationCard from "@/components/StationCard";
import StationForm from "@/components/StationForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Fuel, CheckCircle, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, isOwner } = useAuth();
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStation, setEditStation] = useState<any>(null);
  const [deleteStation, setDeleteStation] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchStations();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    setProfile(data);
  };

  const fetchStations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("stations")
      .select("*")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false });
    setStations(data || []);
    setLoading(false);
  };

  const handleToggleActive = async (station: any) => {
    const { error } = await supabase
      .from("stations")
      .update({ is_active: !station.is_active })
      .eq("id", station.id);
    if (!error) {
      toast.success(station.is_active ? t("deactivate") + " ✓" : t("activate") + " ✓");
      fetchStations();
    }
  };

  const handleDelete = async () => {
    if (!deleteStation) return;
    const { error } = await supabase.from("stations").delete().eq("id", deleteStation.id);
    if (!error) {
      toast.success(t("delete") + " ✓");
      setDeleteStation(null);
      fetchStations();
    }
  };

  const activeCount = stations.filter((s) => s.is_active).length;
  const verifiedCount = stations.filter((s) => s.verification_status === "verified").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">{t("dashboard")}</h1>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {profile?.full_name || user?.email}
              </p>
            </div>
            <Button
              onClick={() => { setEditStation(null); setShowForm(true); }}
              className="accent-gradient !text-accent-foreground font-bold border-0 shadow-lg hover:opacity-90 gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("add_station")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: t("total_stations"), value: stations.length, icon: <Fuel className="w-4 h-4" /> },
              { label: t("active_stations"), value: activeCount, icon: <CheckCircle className="w-4 h-4" /> },
              { label: t("verified"), value: verifiedCount, icon: <Clock className="w-4 h-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-3 text-center">
                <div className="flex justify-center text-primary-foreground/70 mb-1">{stat.icon}</div>
                <div className="text-xl font-black">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stations */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : stations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Fuel className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg mb-4">{t("no_stations")}</p>
            <Button
              onClick={() => { setEditStation(null); setShowForm(true); }}
              className="accent-gradient !text-accent-foreground font-bold border-0"
            >
              <Plus className="w-4 h-4 me-2" />
              {t("register_station")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                showActions
                onToggleActive={() => handleToggleActive(station)}
                onEdit={() => { setEditStation(station); setShowForm(true); }}
                onDelete={() => setDeleteStation(station)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Station Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">
              {editStation ? t("edit_station") : t("add_station")}
            </DialogTitle>
          </DialogHeader>
          <StationForm
            station={editStation}
            onSuccess={() => { setShowForm(false); fetchStations(); }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteStation} onOpenChange={() => setDeleteStation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirm_delete_desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("delete_confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
