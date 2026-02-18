import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Globe, ShieldCheck, Fuel } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isOwner, signOut } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="nav-glass sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="محطتي" className="w-9 h-9 rounded-full" />
          <span className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
            {t("app_name")}
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:text-amber-400 hover:bg-white/10 gap-1"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold">{language === "ar" ? "EN" : "ع"}</span>
          </Button>

          {user ? (
            <>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="text-white hover:text-amber-400 hover:bg-white/10 gap-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">{t("admin")}</span>
                </Button>
              )}
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="text-white hover:text-amber-400 hover:bg-white/10 gap-1"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">{t("dashboard")}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-red-400 hover:bg-white/10 gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{t("logout")}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-white hover:text-amber-400 hover:bg-white/10"
              >
                {t("login")}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth?tab=register")}
                className="accent-gradient text-primary font-bold hover:opacity-90 shadow-md border-0"
              >
                <Fuel className="w-4 h-4 me-1" />
                {t("station_owner_portal")}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
