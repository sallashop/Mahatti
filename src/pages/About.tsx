import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Fuel, Users, Shield, MapPin } from "lucide-react";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-foreground mb-6">{t("about_us")}</h1>

        <div className="prose max-w-none space-y-6">
          <p className="text-muted-foreground leading-relaxed text-lg">{t("about_intro")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Fuel className="w-8 h-8" />, title: t("about_feature_1_title"), desc: t("about_feature_1_desc") },
              { icon: <MapPin className="w-8 h-8" />, title: t("about_feature_2_title"), desc: t("about_feature_2_desc") },
              { icon: <Users className="w-8 h-8" />, title: t("about_feature_3_title"), desc: t("about_feature_3_desc") },
              { icon: <Shield className="w-8 h-8" />, title: t("about_feature_4_title"), desc: t("about_feature_4_desc") },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="text-primary mb-3">{item.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
