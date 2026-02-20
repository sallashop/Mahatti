import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Fuel, Mail, Lock, User, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "login";
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(loginForm);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("مرحباً بك! 👋");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: { full_name: registerForm.full_name, phone: registerForm.phone },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("تم إرسال رسالة التأكيد على بريدك الإلكتروني ✉️");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-2xl scale-150" />
            <img src={logo} alt="محطتي" className="w-16 h-16 rounded-full relative z-10 shadow-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white">{t("app_name")}</h1>
          <p className="text-blue-200 text-sm mt-1">{t("station_owner_portal")}</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="w-full rounded-none bg-muted h-12">
              <TabsTrigger value="login" className="flex-1 font-bold text-sm">
                {t("login")}
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 font-bold text-sm">
                {t("register")}
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="p-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full accent-gradient !text-accent-foreground font-bold border-0 h-11 hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("login")}
                </Button>
              </form>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register" className="p-6 space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("full_name")}</Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      required
                      value={registerForm.full_name}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, full_name: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="الاسم الثلاثي الكامل"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("email")}</Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("phone")}</Label>
                  <div className="relative">
                    <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="+966 5xx xxx xxxx"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-semibold">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      minLength={6}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                      className="ps-10 bg-background"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full accent-gradient !text-accent-foreground font-bold border-0 h-11 hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("register")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
