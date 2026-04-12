"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Smartphone, LogOut } from "lucide-react";
import { api } from "@/lib/axios/api";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

function getDeviceIcon(deviceName) {
  const name = (deviceName || "").toLowerCase();
  if (name.includes("iphone") || name.includes("android") || name.includes("mobile")) {
    return <Smartphone className="w-5 h-5 text-gray-500" />;
  }
  return <Monitor className="w-5 h-5 text-gray-500" />;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  return date.toLocaleString("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SessionCard({ session, onLogout, isLoggingOut }) {
  const t = useTranslations();
  const deviceLabel =
    session.device_name
      ? session.device_name.charAt(0).toUpperCase() + session.device_name.slice(1)
      : "Unknown";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">{getDeviceIcon(session.device_name)}</div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{deviceLabel}</p>
          {session.location && (
            <p className="text-gray-500 text-sm truncate">{session.location}</p>
          )}
          <p className="text-gray-400 text-sm">{formatDate(session.created_at)}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onLogout(session.id)}
        disabled={isLoggingOut}
        className="shrink-0 text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-full px-4"
      >
        {isLoggingOut ? t("loading") || "..." : t("logout") || "Çıxış et"}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(null);
  const [otherSessions, setOtherSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState({});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/sessions/load");
      setCurrentSession(response.data.current_session);
      setOtherSessions(response.data.other_sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (sessionId) => {
    try {
      setLoggingOut((prev) => ({ ...prev, [sessionId]: true }));
      await api.post(`/profile/sessions/${sessionId}/logout`);
      setOtherSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error("Error logging out session:", error);
    } finally {
      setLoggingOut((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-7 bg-gray-200 rounded w-40 animate-pulse" />
          <div className="h-9 bg-gray-200 rounded-full w-20 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-56 animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-36" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="h-9 bg-gray-200 rounded-full w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {t("active_sessions") || "Aktiv Seanslar"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("current_device_description") || "Hal hazırda daxil olduğunuz cihaz"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full px-4"
        >
          {t("back") || "Geriyə"}
        </Button>
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="flex flex-col gap-3">
          <SessionCard
            session={currentSession}
            onLogout={handleLogout}
            isLoggingOut={!!loggingOut[currentSession.id]}
          />
        </div>
      )}

      {/* Other Sessions */}
      {otherSessions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-gray-700">
            {t("other_devices") || "Digər cihazlar"}
          </h2>
          <div className="flex flex-col gap-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onLogout={handleLogout}
                isLoggingOut={!!loggingOut[session.id]}
              />
            ))}
          </div>
        </div>
      )}

      {otherSessions.length === 0 && !loading && (
        <p className="text-sm text-gray-400">
          {t("no_other_sessions") || "Digər aktiv seans yoxdur."}
        </p>
      )}
    </div>
  );
}
