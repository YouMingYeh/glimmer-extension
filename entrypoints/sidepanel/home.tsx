// HomePage.js
import React from "react";
import { Card } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[90vh] overflow-auto">
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {t("introduce")}
          </h3>
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            {t("description")}
          </p>
          {/* contact, terms, privacy */}
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            <a href="mailto:ym911216@gmail.com" className="text-primary hover:underline">
              {t("other.contactUs")}
            </a>{" "}
            |{" "}
            <a href="https://glimmer.adastra.tw/privacy" className="text-primary hover:underline">
              {t("other.privacyPolicy")}
            </a>{" "}
            |{" "}
            <a href="https://glimmer.adastra.tw/terms" className="text-primary hover:underline">
              {t("other.termsOfService")}
            </a>
          </p>
        </div>
      </Card>
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3 prose">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {t("features.title")}
          </h3>
          <ul className="text-sm max-w-lg text-balance leading-relaxed list-disc pl-5 space-y-2">
            <li>
              <strong>{t("features.quickActions")}:</strong>{" "}
              {t("features.quickActionsDescription")}
            </li>
            <li>
              <strong>{t("features.floatingMenu")}:</strong>{" "}
              {t("features.floatingMenuDescription")}
            </li>
            <li>
              <strong>{t("features.i18n")}:</strong>{" "}
              {t("features.i18nDescription")}
            </li>
            <li>
              <strong>{t("features.theme")}:</strong>{" "}
              {t("features.themeDescription")}
            </li>
          </ul>
        </div>
      </Card>
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            Feedback
          </h3>
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            We are always looking for feedback to improve our product. Please
            let us know if you have any suggestions.
          </p>
        </div>
      </Card>
    </div>
  );
}
