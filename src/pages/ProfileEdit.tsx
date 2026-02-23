import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";

const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "" });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user!.id);
    if (error) toast.error(error.message);
    else toast.success(t("save") + " ✓");
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error(t("passwords_not_match"));
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error(t("password_min_length"));
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPass });
    if (error) toast.error(error.message);
    else {
      toast.success(t("password_updated"));
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    }
    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-lg">
        <h1 className="text-2xl font-black text-foreground mb-6">{t("edit_profile")}</h1>

        {/* Profile Info */}
        <form onSubmit={handleSaveProfile} className="bg-card rounded-2xl p-6 border border-border/50 space-y-4 mb-6">
          <h2 className="font-bold text-foreground">{t("profile")}</h2>
          <div className="space-y-1.5">
            <Label className="font-semibold">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={user?.email || ""} disabled className="ps-10 bg-muted/50" dir="ltr" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold">{t("full_name")}</Label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                className="ps-10 bg-background"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold">{t("phone")}</Label>
            <div className="relative">
              <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={profile.phone}
                onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                className="ps-10 bg-background"
                dir="ltr"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full accent-gradient !text-accent-foreground font-bold border-0 h-11 hover:opacity-90">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("save")}
          </Button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h2 className="font-bold text-foreground">{t("change_password")}</h2>
          <div className="space-y-1.5">
            <Label className="font-semibold">{t("new_password")}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                className="ps-10 pe-10 bg-background"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold">{t("confirm_password")}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                className="ps-10 bg-background"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" disabled={passwordLoading} className="w-full font-bold h-11">
            {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("change_password")}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
