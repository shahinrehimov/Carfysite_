import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default async function AccountPage() {
  const t = await getTranslations("account");

  const user = {
    firstName: "Gunay",
    fullName: "Gunay Hasanbayli Aliyeva",
    email: "gunay@gmail.com",
    phone: "+99450555555",
    bonusPoints: 4321,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative h-[160px] lg:h-[200px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-2xl lg:rounded-3xl overflow-hidden">
        <Image
          src="/images/account-banner.png"
          alt="Banner"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-8">
          <h1 className="text-white text-2xl lg:text-3xl font-semibold mb-2">
            {t("greeting")}, {user.firstName}
          </h1>
          <p className="text-white/90 text-sm lg:text-base">
            {t("welcome_message")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("personal_info")}
            </h2>
            <Link
              href="/account/profile"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                {user.fullName}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            <Link
              href="/account/change-password"
              className="inline-flex items-center text-sm text-[#00569C] hover:text-[#004580] font-medium transition-colors"
            >
              {t("change_password")}
            </Link>
          </div>
        </div>

        {/* Bonus Card */}
        <div className="bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-2xl p-6 text-white relative overflow-hidden">
          <div
            className="relative z-10 flex flex-col items-center justify-center
          gap-6"
          >
            <h2 className="text-sm lg:text-base font-medium mb-2 opacity-90">
              {t("bonuses").toUpperCase()}
            </h2>
            <p className="text-4xl lg:text-5xl font-bold mb-4">
              {user.bonusPoints.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
