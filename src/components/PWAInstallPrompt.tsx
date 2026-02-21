import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem("pwa-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Check if already installed as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as any).standalone === true;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show the prompt after 3 seconds regardless (for iOS & browsers that don't fire the event)
    const timer = setTimeout(() => setShowPrompt(true), 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    } else {
      // For iOS / browsers without native install - just dismiss with info
      setShowPrompt(false);
      setDismissed(true);
      localStorage.setItem("pwa-dismissed", "true");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 start-4 end-4 sm:start-auto sm:end-4 sm:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm">{t("pwa_install_title")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("pwa_install_desc")}</p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex-1 accent-gradient !text-accent-foreground font-bold border-0 hover:opacity-90 gap-1 text-xs"
              >
                <Download className="w-3 h-3" />
                {t("pwa_install_btn")}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss} className="text-xs">
                {t("pwa_later")}
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
