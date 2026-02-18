import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  label?: string;
}

const ClickHandler: React.FC<{ onLocationChange: (lat: number, lng: number) => void }> = ({
  onLocationChange,
}) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  lat,
  lng,
  onLocationChange,
  readOnly = false,
  label,
}) => {
  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-border shadow-sm">
      <MapContainer
        center={[lat || 24.7136, lng || 46.6753]}
        zoom={lat ? 13 : 6}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && onLocationChange && (
          <ClickHandler onLocationChange={onLocationChange} />
        )}
        {lat && lng && (
          <Marker position={[lat, lng]}>
            {label && <Popup>{label}</Popup>}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
