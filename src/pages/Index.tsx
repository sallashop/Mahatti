import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import StationCard from "@/components/StationCard";
import LocationPicker from "@/components/LocationPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Fuel, MapPin, Activity, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const [stations, setStations] = useState<any[]>([]);
  const [filteredStations, setFilteredStations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterFuel, setFilterFuel] = useState<"all" | "benzine" | "diesel">("all");
  const [mapStation, setMapStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    const { data } = await supabase
      .from("stations")
      .select("*")
      .order("created_at", { ascending: false });
    setStations(data || []);
    setFilteredStations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    let result = [...stations];

    if (search) {
      result = result.filter(
        (s) =>
          s.station_name?.toLowerCase().includes(search.toLowerCase()) ||
          s.city?.toLowerCase().includes(search.toLowerCase()) ||
          s.station_number?.includes(search)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((s) => (filterStatus === "active" ? s.is_active : !s.is_active));
    }

    if (filterFuel !== "all") {
      result = result.filter((s) => s.fuel_types?.includes(filterFuel));
    }

    setFilteredStations(result);
  }, [search, filterStatus, filterFuel, stations]);

  const totalActive = stations.filter((s) => s.is_active).length;
  const totalVerified = stations.filter((s) => s.verification_status === "verified").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 start-8 w-40 h-40 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-0 end-16 w-60 h-60 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl scale-150" />
              <img src={logo} alt="محطتي" className="w-20 h-20 rounded-full relative z-10 shadow-2xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
              {t("welcome")}
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md">{t("welcome_desc")}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-lg">
              {[
                { label: t("total_stations"), value: stations.length, icon: <Fuel className="w-5 h-5" /> },
                { label: t("active_stations"), value: totalActive, icon: <Activity className="w-5 h-5" /> },
                { label: t("verified"), value: totalVerified, icon: <MapPin className="w-5 h-5" /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-amber-400 mb-1 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs text-blue-100 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-background" style={{ borderRadius: "100% 100% 0 0" }} />
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("find_station")}
              className="ps-10 bg-background"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Status filter */}
            {(["all", "active", "inactive"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filterStatus === f ? "default" : "outline"}
                onClick={() => setFilterStatus(f)}
                className={`text-xs font-semibold ${
                  filterStatus === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {t(f === "all" ? "all" : f === "active" ? "active" : "inactive")}
              </Button>
            ))}
            <div className="w-px bg-border" />
            {/* Fuel filter */}
            {(["all", "benzine", "diesel"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filterFuel === f ? "default" : "outline"}
                onClick={() => setFilterFuel(f)}
                className={`text-xs font-semibold ${
                  filterFuel === f
                    ? "accent-gradient text-primary border-0"
                    : "text-muted-foreground"
                }`}
              >
                {t(f === "all" ? "all" : f)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filteredStations.length}</span>{" "}
            {t("stations_count")}
          </p>
        </div>

        {/* Stations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredStations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Fuel className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground text-lg">{t("no_stations")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onViewMap={() => setMapStation(station)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Map Dialog */}
      <Dialog open={!!mapStation} onOpenChange={() => setMapStation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold">{mapStation?.station_name}</DialogTitle>
          </DialogHeader>
          {mapStation && (
            <LocationPicker
              lat={mapStation.lat}
              lng={mapStation.lng}
              readOnly
              label={mapStation.station_name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
