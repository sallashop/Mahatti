import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import logo from "@/assets/logo.png";
import DonationDialog from "./DonationDialog";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [showDonation, setShowDonation] = useState(false);

  return (
    <footer className="bg-primary dark:bg-[hsl(220,50%,8%)] text-primary-foreground dark:text-slate-300 mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt={t("app_name")} className="w-8 h-8 rounded-full" />
              <span className="text-lg font-black text-primary-foreground">{t("app_name")}</span>
            </div>
            <p className="text-sm text-primary-foreground/60 dark:text-slate-400 leading-relaxed">{t("footer_desc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wide">
              {t("footer_links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("station_owner_portal")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("about_us")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("contact_us")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wide">
              {t("footer_legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-primary-foreground/70 dark:text-slate-400 hover:text-primary-foreground dark:hover:text-white transition-colors">
                  {t("terms_of_use")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Donate Button */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 dark:border-slate-700 flex flex-col items-center gap-3">
          <button
            onClick={() => setShowDonation(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-sm text-primary-foreground font-semibold"
          >
            <Heart className="w-4 h-4 text-red-400" />
            {t("donate_btn")}
          </button>
          <p className="text-xs text-primary-foreground/50 dark:text-slate-500">
            © {year} {t("app_name")}. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
      <DonationDialog open={showDonation} onOpenChange={setShowDonation} />
    </footer>
  );
};

export default Footer;
