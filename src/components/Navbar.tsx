import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  LogOut,
  LayoutDashboard,
  Globe,
  ShieldCheck,
  Fuel,
  Menu,
  Moon,
  Sun,
  Home,
  UserCog,
} from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isOwner, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    navigate("/");
  };

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <nav className="nav-glass sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt={t("app_name")} className="w-8 h-8 rounded-full" />
          <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            {t("app_name")}
          </span>
        </Link>

        {/* Right side: Language + Dark mode + Menu */}
        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:text-amber-400 hover:bg-white/10 h-8 px-2 gap-1"
            title={language === "ar" ? "English" : "عربي"}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap">
              {language === "ar" ? "EN" : "عربي"}
            </span>
          </Button>

          {/* Dark mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white hover:text-amber-400 hover:bg-white/10 w-8 h-8"
            title={isDark ? t("light_mode") : t("dark_mode")}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Hamburger Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-amber-400 hover:bg-white/10 w-8 h-8"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-border p-0">
              {/* Drawer Header */}
              <div className="hero-gradient p-6 pb-4">
                <div className="flex items-center gap-3">
                  <img src={logo} alt={t("app_name")} className="w-10 h-10 rounded-full shadow-lg" />
                  <div>
                    <p className="font-black text-white text-lg">{t("app_name")}</p>
                    {user && (
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-1">
                <SheetClose asChild>
                  <button
                    onClick={() => handleNav("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-sm font-semibold"
                  >
                    <Home className="w-4 h-4 text-primary" />
                    {t("home")}
                  </button>
                </SheetClose>

                {user ? (
                  <>
                    {isOwner && (
                      <SheetClose asChild>
                        <button
                          onClick={() => handleNav("/dashboard")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-sm font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          {t("dashboard")}
                        </button>
                      </SheetClose>
                    )}
                    {isAdmin && (
                      <SheetClose asChild>
                        <button
                          onClick={() => handleNav("/admin")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-sm font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          {t("admin")}
                        </button>
                      </SheetClose>
                    )}

                    <SheetClose asChild>
                      <button
                        onClick={() => handleNav("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-sm font-semibold"
                      >
                        <UserCog className="w-4 h-4 text-primary" />
                        {t("edit_profile")}
                      </button>
                    </SheetClose>

                    <div className="border-t border-border my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-border my-2" />
                    <SheetClose asChild>
                      <button
                        onClick={() => handleNav("/auth")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors text-sm font-semibold"
                      >
                        <Fuel className="w-4 h-4 text-primary" />
                        {t("login")}
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => handleNav("/auth?tab=register")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl accent-gradient !text-accent-foreground font-bold transition-colors text-sm mt-1"
                      >
                        <Fuel className="w-4 h-4" />
                        {t("station_owner_portal")}
                      </button>
                    </SheetClose>
                  </>
                )}
              </div>

              {/* Footer in drawer */}
              <div className="absolute bottom-6 start-4 end-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <button
                    onClick={toggleLanguage}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold"
                  >
                    {language === "ar" ? "Switch to English" : "التحويل للعربية"}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
