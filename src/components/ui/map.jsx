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
import { LocateFixed, Loader2, Search } from "lucide-react";

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

// Flies the map to a target position (used when the user picks their
// current location, so the map recenters even if it was already positioned
// elsewhere).
function MapFlyTo({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target && target.length === 2) {
      map.flyTo(target, Math.max(map.getZoom(), 15), { duration: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return null;
}

// Search addresses using Nominatim (OpenStreetMap)
async function searchLocations(query) {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "5",
    addressdetails: "1",
    countrycodes: "az",
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "Accept-Language": "az,en" } }
  );
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  return response.json();
}

// Reverse geocode coordinates into an address using Nominatim (OpenStreetMap)
async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    const address = data.address || {};
    const components = [];
    if (address.house_number) components.push(address.house_number);
    if (address.road) components.push(address.road);
    if (address.street) components.push(address.street);
    if (address.pedestrian) components.push(address.pedestrian);
    if (address.neighbourhood) components.push(address.neighbourhood);

    const addressLine1 =
      components.join(" ") ||
      data.display_name?.split(",")[0] ||
      `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    return {
      lat: lat.toString(),
      lng: lng.toString(),
      address: addressLine1,
      fullAddress: data.display_name || "",
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {
      lat: lat.toString(),
      lng: lng.toString(),
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    };
  }
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
      const result = await reverseGeocode(lat, lng);
      onLocationSelect(result);
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
  // Site translations are loaded dynamically from the backend; fall back to
  // a sensible default until a key has been added there.
  const tf = (key, fallback) => {
    const value = t(key);
    return value === `{${key}}` ? fallback : value;
  };
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState([
    parseFloat(latitude),
    parseFloat(longitude),
  ]);
  const [recenterTarget, setRecenterTarget] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const locationWatchdogRef = useRef(null);
  const geolocationWatchIdRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const searchRequestIdRef = useRef(0);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Some browsers (notably Chrome on macOS when system Location Services
  // are disabled) never invoke either the success or the error callback of
  // getCurrentPosition and silently ignore the `timeout` option, leaving
  // the UI stuck in a loading state forever. Guard against that with our
  // own JS-level watchdog timer.
  useEffect(() => {
    return () => {
      if (locationWatchdogRef.current) {
        clearTimeout(locationWatchdogRef.current);
      }
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      if (
        geolocationWatchIdRef.current != null &&
        typeof navigator !== "undefined" &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const query = searchQuery.trim();
    if (query.length < 3) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(async () => {
      const requestId = ++searchRequestIdRef.current;
      setIsSearching(true);
      setSearchError("");

      try {
        const results = await searchLocations(query);
        if (requestId !== searchRequestIdRef.current) {
          return;
        }
        if (results.length === 0) {
          setSearchResults([]);
          setSearchError(
            tf("no_search_results", "No locations found for this search.")
          );
        } else {
          setSearchResults(results);
          setSearchError("");
        }
      } catch (error) {
        if (requestId !== searchRequestIdRef.current) {
          return;
        }
        console.error("Location search error:", error);
        setSearchResults([]);
        setSearchError(
          tf(
            "search_failed",
            "Could not search for this address. Please try again."
          )
        );
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, t]);

  useEffect(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  const clearLocationWatchdog = () => {
    if (locationWatchdogRef.current) {
      clearTimeout(locationWatchdogRef.current);
      locationWatchdogRef.current = null;
    }
  };

  const stopGeolocationWatch = () => {
    if (
      geolocationWatchIdRef.current != null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
      geolocationWatchIdRef.current = null;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        tf(
          "geolocation_not_supported",
          "Your browser does not support geolocation."
        )
      );
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.isSecureContext === false
    ) {
      setLocationError(
        tf(
          "geolocation_requires_https",
          "Detecting your location requires a secure (HTTPS) connection."
        )
      );
      return;
    }

    stopGeolocationWatch();
    clearLocationWatchdog();

    setIsLocating(true);
    setLocationError("");

    let settled = false;
    let sawPermissionDenied = false;

    const finishSuccess = async (pos) => {
      if (settled) {
        return;
      }
      settled = true;
      stopGeolocationWatch();
      clearLocationWatchdog();
      setLocationError("");

      const { latitude: lat, longitude: lng } = pos.coords;
      const coords = [lat, lng];
      setPosition(coords);
      setRecenterTarget(coords);

      if (onLocationSelect) {
        const result = await reverseGeocode(lat, lng);
        onLocationSelect(result);
      }

      setIsLocating(false);
    };

    const finishError = (error) => {
      if (settled) {
        return;
      }
      settled = true;
      stopGeolocationWatch();
      clearLocationWatchdog();
      setIsLocating(false);

      if (error.code === 1) {
        setLocationError(
          tf(
            "location_permission_denied",
            "Location access was denied. Please allow location access in your browser settings and try again."
          )
        );
        return;
      }

      if (error.code !== 3) {
        console.error("Geolocation error:", error);
      }

      setLocationError(
        error.code === 3
          ? tf(
              "location_timeout",
              "Couldn't get your location. Make sure Location Services are enabled for your browser in your system settings, then try again."
            )
          : tf(
              "location_unavailable",
              "Unable to determine your current location. Make sure Location Services are enabled on your device."
            )
      );
    };

    // Safety net when the browser never resolves the request (common on
    // macOS when system Location Services are disabled for the browser).
    locationWatchdogRef.current = setTimeout(() => {
      locationWatchdogRef.current = null;
      finishError({ code: sawPermissionDenied ? 1 : 3 });
    }, 30000);

    // watchPosition keeps trying after transient PERMISSION_DENIED errors
    // that Chrome on macOS emits while the permission dialog is open.
    geolocationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        finishSuccess(pos);
      },
      (error) => {
        if (error.code === 1) {
          sawPermissionDenied = true;
          return;
        }
        finishError(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    // Triggers the permission prompt; success is handled by watchPosition above.
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        finishSuccess(pos);
      },
      (error) => {
        if (error.code === 1) {
          sawPermissionDenied = true;
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSelectSearchResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    skipSearchRef.current = true;
    searchRequestIdRef.current += 1;

    const coords = [lat, lng];
    setPosition(coords);
    setRecenterTarget(coords);
    setSearchResults([]);
    setSearchQuery(result.display_name?.split(",")[0] || searchQuery);
    setSearchError("");
    setIsSearching(false);

    if (onLocationSelect) {
      onLocationSelect({
        lat: lat.toString(),
        lng: lng.toString(),
        address: result.display_name?.split(",")[0] || result.display_name || "",
        fullAddress: result.display_name || "",
      });
    }
  };

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
    <div className={className}>
      <div
        className="relative z-0 rounded-md border border-gray-200"
        style={{ height }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-md">
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
            <MapFlyTo target={recenterTarget} />
            <Marker position={position} />

            {onLocationSelect && (
              <MapClickHandler onLocationSelect={onLocationSelect} />
            )}
          </MapContainer>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="absolute left-2 top-2 right-12 z-1001"
        >
          <div className="flex overflow-hidden rounded-md border border-gray-200 bg-white shadow-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tf("search_location", "Search address...")}
              autoComplete="off"
              className="min-w-0 flex-1 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            <div className="flex items-center justify-center border-l border-gray-200 px-2.5 text-gray-600">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          </div>

          {(searchResults.length > 0 || (isSearching && searchQuery.trim().length >= 3)) && (
            <ul className="mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {isSearching && searchResults.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-500">
                  {tf("searching", "Searching...")}
                </li>
              ) : (
                searchResults.map((result) => (
                  <li key={result.place_id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {result.display_name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </form>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          title={tf("use_current_location", "Use my current location")}
          className="absolute right-2 top-2 z-1001 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 shadow-md transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <LocateFixed className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {locationError && (
        <p className="mt-2 text-sm text-red-500">{locationError}</p>
      )}

      {searchError && (
        <p className="mt-2 text-sm text-red-500">{searchError}</p>
      )}
    </div>
  );
}
