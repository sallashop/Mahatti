import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-foreground mb-6">{t("terms_of_use")}</h1>
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          {["terms_section_1", "terms_section_2", "terms_section_3", "terms_section_4"].map((key) => (
            <div key={key}>
              <h2 className="font-bold text-foreground text-lg mb-2">{t(`${key}_title`)}</h2>
              <p className="text-muted-foreground leading-relaxed">{t(`${key}_desc`)}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
