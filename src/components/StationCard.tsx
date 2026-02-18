import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, CheckCircle, Clock, XCircle, Fuel, Zap } from "lucide-react";

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
}

interface StationCardProps {
  station: Station;
  onViewMap?: () => void;
  showActions?: boolean;
  onToggleActive?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StationCard: React.FC<StationCardProps> = ({
  station,
  onViewMap,
  showActions,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const verificationBadge = () => {
    switch (station.verification_status) {
      case "verified":
        return (
          <Badge className="bg-green-500/15 text-green-600 border border-green-500/30 gap-1 text-xs">
            <CheckCircle className="w-3 h-3" />
            {t("verified")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/15 text-red-600 border border-red-500/30 gap-1 text-xs">
            <XCircle className="w-3 h-3" />
            {t("rejected")}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-600 border border-amber-500/30 gap-1 text-xs">
            <Clock className="w-3 h-3" />
            {t("pending")}
          </Badge>
        );
    }
  };

  return (
    <div className="station-card rounded-2xl overflow-hidden border border-border bg-card">
      {/* Header bar */}
      <div className={`h-2 w-full ${station.is_active ? "bg-green-500" : "bg-red-500"}`} />

      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-lg leading-tight truncate">
              {station.station_name}
            </h3>
            {station.station_number && (
              <p className="text-xs text-muted-foreground mt-0.5">
                #{station.station_number}
              </p>
            )}
          </div>
          {/* Active status badge */}
          <Badge
            className={`shrink-0 font-semibold text-xs px-3 py-1 ${
              station.is_active
                ? "badge-active text-white"
                : "badge-inactive text-white"
            }`}
          >
            {station.is_active ? t("working") : t("not_working")}
          </Badge>
        </div>

        {/* Info rows */}
        <div className="space-y-2 mb-3">
          {station.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{station.city}</span>
              {station.address && <span className="truncate">- {station.address}</span>}
            </div>
          )}
          {station.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span dir="ltr">{station.phone}</span>
            </div>
          )}
        </div>

        {/* Fuel & Verification */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {verificationBadge()}
          {station.fuel_types && station.fuel_types.length > 0 && (
            <div className="flex gap-1.5">
              {station.fuel_types.map((fuel) => (
                <Badge
                  key={fuel}
                  variant="outline"
                  className="text-xs gap-1 border-primary/30 text-primary"
                >
                  <Fuel className="w-3 h-3" />
                  {fuel === "benzine" ? t("benzine") : fuel === "diesel" ? t("diesel") : fuel}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(onViewMap || showActions) && (
          <div className="flex gap-2 flex-wrap">
            {onViewMap && station.lat && station.lng && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewMap}
                className="gap-1 text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <MapPin className="w-3 h-3" />
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
                      ? "border-red-300 text-red-600 hover:bg-red-50"
                      : "border-green-300 text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  {station.is_active ? t("deactivate") : t("activate")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="gap-1 text-xs"
                >
                  {t("edit_station")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="gap-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                >
                  {t("delete")}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StationCard;
