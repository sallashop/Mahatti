import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, MapPin, Loader2 } from "lucide-react";
import LocationPicker from "./LocationPicker";

interface StationFormProps {
  station?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const StationForm: React.FC<StationFormProps> = ({ station, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);

  const [formData, setFormData] = useState({
    station_name: station?.station_name || "",
    station_number: station?.station_number || "",
    city: station?.city || "",
    address: station?.address || "",
    phone: station?.phone || "",
    lat: station?.lat || 0,
    lng: station?.lng || 0,
    fuel_types: station?.fuel_types || [] as string[],
    passport_image_url: station?.passport_image_url || "",
    license_image_url: station?.license_image_url || "",
  });

  const handleFuelTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      fuel_types: checked
        ? [...prev.fuel_types, type]
        : prev.fuel_types.filter((f: string) => f !== type),
    }));
  };

  const handleFileUpload = async (
    file: File,
    field: "passport_image_url" | "license_image_url",
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/${field}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("station-documents")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from("station-documents").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, [field]: data.publicUrl }));
      toast.success(t("upload_image") + " ✓");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const payload = { ...formData, owner_id: user.id };

      if (station?.id) {
        const { error } = await supabase.from("stations").update(payload).eq("id", station.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("stations").insert(payload);
        if (error) throw error;
      }

      toast.success(station?.id ? t("edit_station") + " ✓" : t("add_station") + " ✓");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-semibold">{t("station_name")} *</Label>
          <Input
            required
            value={formData.station_name}
            onChange={(e) => setFormData((p) => ({ ...p, station_name: e.target.value }))}
            placeholder={t("station_name")}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-semibold">{t("station_number")}</Label>
          <Input
            value={formData.station_number}
            onChange={(e) => setFormData((p) => ({ ...p, station_number: e.target.value }))}
            placeholder={t("station_number")}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-semibold">{t("city")} *</Label>
          <Input
            required
            value={formData.city}
            onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
            placeholder={t("city")}
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-semibold">{t("phone")}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+966 5xx xxx xxxx"
            dir="ltr"
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="font-semibold">{t("address")}</Label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
            placeholder={t("address")}
            className="bg-background"
          />
        </div>
      </div>

      {/* Fuel types */}
      <div className="space-y-2">
        <Label className="font-semibold">{t("fuel_type")} *</Label>
        <div className="flex gap-6">
          {["benzine", "diesel"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.fuel_types.includes(type)}
                onCheckedChange={(c) => handleFuelTypeChange(type, c as boolean)}
              />
              <span className="font-medium text-foreground">{t(type)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="font-semibold flex items-center gap-1">
          <MapPin className="w-4 h-4 text-primary" />
          {t("location")}
        </Label>
        <p className="text-xs text-muted-foreground">{t("select_location")}</p>
        <LocationPicker
          lat={formData.lat || 24.7136}
          lng={formData.lng || 46.6753}
          onLocationChange={(lat, lng) => setFormData((p) => ({ ...p, lat, lng }))}
          label={formData.station_name}
        />
        {formData.lat !== 0 && (
          <p className="text-xs text-muted-foreground" dir="ltr">
            {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* File uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["passport_image_url", "license_image_url"] as const).map((field) => {
          const isPassport = field === "passport_image_url";
          const isUploading = isPassport ? uploadingPassport : uploadingLicense;
          const setUploading = isPassport ? setUploadingPassport : setUploadingLicense;

          return (
            <div key={field} className="space-y-2">
              <Label className="font-semibold">{t(isPassport ? "passport_image" : "license_image")}</Label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                {formData[field] ? (
                  <img src={formData[field]} alt="" className="h-24 w-full object-contain rounded-xl" />
                ) : isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">{t("upload_image")}</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, field, setUploading);
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 accent-gradient text-primary font-bold border-0 hover:opacity-90"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("save")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
};

export default StationForm;
