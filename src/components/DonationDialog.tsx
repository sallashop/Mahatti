import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCOUNT_NUMBER = "LY38005101101012893830015";

const maskAccount = (acc: string) => {
  return acc.slice(0, 4) + " •••• •••• •••• •••• " + acc.slice(-4);
};

const DonationDialog: React.FC<DonationDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black text-lg">
            <Heart className="w-5 h-5 text-red-500" />
            {t("donate_title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("donate_desc")}
          </p>
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-muted-foreground font-semibold">{t("donate_account")}</p>
            <p className="font-mono text-sm text-foreground tracking-wide" dir="ltr">
              {maskAccount(ACCOUNT_NUMBER)}
            </p>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t("copied") : t("copy_account")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationDialog;
