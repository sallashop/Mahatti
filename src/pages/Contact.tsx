import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-foreground mb-6">{t("contact_us")}</h1>
        <p className="text-muted-foreground leading-relaxed text-lg mb-8">{t("contact_intro")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Mail className="w-8 h-8" />, title: t("contact_email_title"), value: "support@mahatati.com" },
            { icon: <Phone className="w-8 h-8" />, title: t("contact_phone_title"), value: "+218 XX XXX XXXX" },
            { icon: <MapPin className="w-8 h-8" />, title: t("contact_address_title"), value: t("contact_address_value") },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="text-primary mb-3 flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground" dir="ltr">{item.value}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
