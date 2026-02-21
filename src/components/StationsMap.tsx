import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, Fuel } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const activeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const inactiveIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Station {
  id: string;
  station_name: string;
  city?: string;
  is_active: boolean;
  fuel_types?: string[];
  lat?: number;
  lng?: number;
}

interface StationsMapProps {
  stations: Station[];
}

const StationsMap: React.FC<StationsMapProps> = ({ stations }) => {
  const { t } = useTranslation();
  const mappable = stations.filter((s) => s.lat && s.lng);

  if (mappable.length === 0) return null;

  const center: [number, number] = [
    mappable.reduce((sum, s) => sum + (s.lat || 0), 0) / mappable.length,
    mappable.reduce((sum, s) => sum + (s.lng || 0), 0) / mappable.length,
  ];

  return (
    <section className="container mx-auto px-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <Navigation className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-black text-foreground">{t("stations_map")}</h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
        <MapContainer center={center} zoom={6} style={{ height: "400px", width: "100%" }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mappable.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat!, station.lng!]}
              icon={station.is_active ? activeIcon : inactiveIcon}
            >
              <Popup>
                <div className="text-center space-y-1 min-w-[150px]">
                  <p className="font-bold text-sm">{station.station_name}</p>
                  {station.city && <p className="text-xs text-gray-500">{station.city}</p>}
                  <Badge className={`text-[10px] ${station.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {station.is_active ? t("working") : t("not_working")}
                  </Badge>
                  <div className="pt-1">
                    <Button
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, "_blank")}
                    >
                      {t("navigate")}
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default StationsMap;
