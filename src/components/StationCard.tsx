import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, CheckCircle, Clock, XCircle, Fuel, Zap, Info, Image } from "lucide-react";
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
        <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30 gap-1 text-xs">
          <CheckCircle className="w-3 h-3" />
          {t("verified")}
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 gap-1 text-xs">
          <XCircle className="w-3 h-3" />
          {t("rejected")}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1 text-xs">
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
      <div className="group relative rounded-2xl overflow-hidden border border-border bg-card dark:bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Status indicator strip */}
        <div className={`h-1.5 w-full ${station.is_active ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-400 to-red-600"}`} />

        <div className="p-5 space-y-4">
          {/* Header: Name + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base leading-tight truncate">
                {station.station_name}
              </h3>
              {station.station_number && (
                <span className="text-xs text-muted-foreground mt-0.5 block">#{station.station_number}</span>
              )}
            </div>
            <Badge
              className={`shrink-0 text-[11px] font-bold px-2.5 py-1 ${
                station.is_active
                  ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
              }`}
            >
              {station.is_active ? t("working") : t("not_working")}
            </Badge>
          </div>

          {/* Info */}
          <div className="space-y-1.5">
            {station.city && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{station.city}{station.address ? ` - ${station.address}` : ""}</span>
              </div>
            )}
            {station.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                className="text-[11px] gap-1 border-primary/20 text-primary dark:text-primary"
              >
                <Fuel className="w-3 h-3" />
                {fuel === "benzine" ? t("benzine") : fuel === "diesel" ? t("diesel") : fuel}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap pt-1">
            <Button
              size="sm"
              onClick={() => setShowDetails(true)}
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Info className="w-3.5 h-3.5" />
              {t("station_details")}
            </Button>

            {onViewMap && station.lat && station.lng && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewMap}
                className="gap-1.5 text-xs border-border text-foreground dark:text-foreground hover:bg-muted"
              >
                <MapPin className="w-3.5 h-3.5" />
                {t("view_map")}
              </Button>
            )}

            {showActions && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleActive}
                  className={`gap-1 text-xs ${
                    station.is_active
                      ? "border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      : "border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {station.is_active ? t("deactivate") : t("activate")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="gap-1 text-xs text-foreground dark:text-foreground"
                >
                  {t("edit_station")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="gap-1 text-xs border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
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
              <div className={`w-3 h-3 rounded-full ${station.is_active ? "bg-green-500" : "bg-red-500"}`} />
              {station.station_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={`font-semibold text-xs px-3 py-1 ${
                station.is_active
                  ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
              }`}>
                {station.is_active ? t("working") : t("not_working")}
              </Badge>
              <VerificationBadge status={station.verification_status} t={t} />
              {station.fuel_types?.map((fuel) => (
                <Badge key={fuel} variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
                  <Fuel className="w-3 h-3" />
                  {fuel === "benzine" ? t("benzine") : fuel === "diesel" ? t("diesel") : fuel}
                </Badge>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 rounded-xl p-4">
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
