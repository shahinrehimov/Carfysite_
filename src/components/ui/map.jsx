"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to update map center when position changes
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && position.length === 2) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);

  return null;
}

// Recalculate map size once the container has its final dimensions.
// Needed because the map is rendered inside an animated modal, so tiles
// misalign if the size is computed before the animation settles.
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize();

    // Run after mount and after the modal open animation (~300ms).
    invalidate();
    const timers = [
      setTimeout(invalidate, 100),
      setTimeout(invalidate, 400),
    ];

    window.addEventListener("resize", invalidate);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      // Reverse geocoding using Nominatim (OpenStreetMap)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();

        // Extract address components
        const address = data.address || {};
        let addressLine1 = "";

        // Build address line 1 from various components
        const components = [];
        if (address.house_number) components.push(address.house_number);
        if (address.road) components.push(address.road);
        if (address.street) components.push(address.street);
        if (address.pedestrian) components.push(address.pedestrian);
        if (address.neighbourhood) components.push(address.neighbourhood);

        addressLine1 =
          components.join(" ") ||
          data.display_name?.split(",")[0] ||
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        onLocationSelect({
          lat: lat.toString(),
          lng: lng.toString(),
          address: addressLine1,
          fullAddress: data.display_name || "",
        });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        // Fallback to coordinates if geocoding fails
        onLocationSelect({
          lat: lat.toString(),
          lng: lng.toString(),
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      }
    },
  });

  return null;
}

export default function Map({
  latitude = "41.7151",
  longitude = "44.8271",
  onLocationSelect,
  height = "300px",
  className = "",
}) {
  const t = useTranslations();
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState([
    parseFloat(latitude),
    parseFloat(longitude),
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  if (!isClient) {
    return (
      <div
        className={`bg-gray-100 rounded-md flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-500">{t("loading_map")}</div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md overflow-hidden border border-gray-200 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResizer />
        <MapUpdater position={position} />
        <Marker position={position} />

        {onLocationSelect && (
          <MapClickHandler onLocationSelect={onLocationSelect} />
        )}
      </MapContainer>
    </div>
  );
}
