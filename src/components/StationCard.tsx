import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, CheckCircle, Clock, XCircle, Fuel, Zap, Info, Image, Navigation } from "lucide-react";
import LocationPicker from "./LocationPicker";

interface Station {
  id: string;
  station_name: string;
  station_number?: string;
  city?: string;
  address?: string;
  phone?: string;
  fuel_types?: string[];
  is_active: boolean;
  is_verified: boolean;
  verification_status: string;
  lat?: number;
  lng?: number;
  passport_image_url?: string;
  license_image_url?: string;
}

interface StationCardProps {
  station: Station;
  onViewMap?: () => void;
  showActions?: boolean;
  onToggleActive?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VerificationBadge: React.FC<{ status: string; t: (k: string) => string }> = ({ status, t }) => {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            <path d="M9.5 12.5L11 14L14.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("verified")}
        </span>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 gap-1 text-[10px] font-semibold">
          <XCircle className="w-3 h-3" />
          {t("rejected")}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 gap-1 text-[10px] font-semibold">
          <Clock className="w-3 h-3" />
          {t("pending")}
        </Badge>
      );
  }
};

const StationCard: React.FC<StationCardProps> = ({
  station,
  onViewMap,
  showActions,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden bg-card dark:bg-card border border-border/60 dark:border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:-translate-y-1">
        {/* Top gradient bar */}
        <div className={`h-1 w-full ${station.is_active ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" : "bg-gradient-to-r from-red-400 via-red-500 to-rose-500"}`} />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                station.is_active
                  ? "bg-emerald-500/10 dark:bg-emerald-500/15"
                  : "bg-red-500/10 dark:bg-red-500/15"
              }`}>
                <Fuel className={`w-5 h-5 ${station.is_active ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-[15px] leading-tight truncate">
                  {station.station_name}
                </h3>
                {station.station_number && (
                  <span className="text-[11px] text-muted-foreground">#{station.station_number}</span>
                )}
              </div>
            </div>
            <div className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
              station.is_active
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20"
                : "bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-500/20"
            }`}>
              {station.is_active ? t("working") : t("not_working")}
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2">
            {station.city && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{station.city}{station.address ? ` — ${station.address}` : ""}</span>
              </div>
            )}
            {station.phone && (
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                <span dir="ltr">{station.phone}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <VerificationBadge status={station.verification_status} t={t} />
            {station.fuel_types?.map((fuel) => (
              <Badge
                key={fuel}
                variant="outline"
                className="text-[10px] gap-1 border-primary/15 dark:border-primary/25 text-primary font-semibold"
              >
                <Fuel className="w-2.5 h-2.5" />
                {fuel === "benzine" ? t("benzine") : fuel === "diesel" ? t("diesel") : fuel}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap pt-1">
            <Button
              size="sm"
              onClick={() => setShowDetails(true)}
              className="gap-1.5 text-xs h-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
            >
              <Info className="w-3.5 h-3.5" />
              {t("station_details")}
            </Button>

            {station.lat && station.lng && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank')}
                className="gap-1.5 text-xs h-8 rounded-xl border-border text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-muted"
              >
                <Navigation className="w-3.5 h-3.5" />
                {t("navigate")}
              </Button>
            )}

            {showActions && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleActive}
                  className={`gap-1 text-xs h-8 rounded-xl ${
                    station.is_active
                      ? "border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      : "border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {station.is_active ? t("deactivate") : t("activate")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="gap-1 text-xs h-8 rounded-xl text-foreground dark:text-foreground"
                >
                  {t("edit_station")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="gap-1 text-xs h-8 rounded-xl border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                >
                  {t("delete")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${station.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
              {station.station_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`font-semibold text-xs px-3 py-1 ${
                station.is_active
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
              }`}>
                {station.is_active ? t("working") : t("not_working")}
              </Badge>
              <VerificationBadge status={station.verification_status} t={t} />
              {station.fuel_types?.map((fuel) => (
                <Badge key={fuel} variant="outline" className="text-xs gap-1 border-primary/20 text-primary">
                  <Fuel className="w-3 h-3" />
                  {fuel === "benzine" ? t("benzine") : fuel === "diesel" ? t("diesel") : fuel}
                </Badge>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 dark:bg-muted/20 rounded-xl p-4">
              {station.station_number && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("station_number")}</p>
                  <p className="font-semibold text-foreground">#{station.station_number}</p>
                </div>
              )}
              {station.city && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("city")}</p>
                  <p className="font-semibold text-foreground">{station.city}</p>
                </div>
              )}
              {station.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">{t("address")}</p>
                  <p className="font-semibold text-foreground">{station.address}</p>
                </div>
              )}
              {station.phone && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("phone")}</p>
                  <p className="font-semibold text-foreground" dir="ltr">{station.phone}</p>
                </div>
              )}
            </div>

            {/* Map */}
            {station.lat && station.lng && (
              <div>
                <p className="text-sm font-bold text-foreground mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("location")}
                </p>
                <LocationPicker lat={station.lat} lng={station.lng} readOnly label={station.station_name} />
                <Button
                  size="sm"
                  className="mt-2 gap-1.5 text-xs"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank')}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {t("navigate")}
                </Button>
              </div>
            )}

            {/* Station Images */}
            {(station.passport_image_url || station.license_image_url) && (
              <div>
                <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-1">
                  <Image className="w-4 h-4 text-primary" />
                  {t("station_images")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {station.passport_image_url && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t("station_photo")}</p>
                      <a href={station.passport_image_url} target="_blank" rel="noreferrer">
                        <img
                          src={station.passport_image_url}
                          alt={t("station_photo")}
                          className="w-full h-40 object-cover rounded-xl border border-border hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </a>
                    </div>
                  )}
                  {station.license_image_url && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t("station_license")}</p>
                      <a href={station.license_image_url} target="_blank" rel="noreferrer">
                        <img
                          src={station.license_image_url}
                          alt={t("station_license")}
                          className="w-full h-40 object-cover rounded-xl border border-border hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StationCard;
