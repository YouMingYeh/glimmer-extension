import React from "react";
import { useUser } from "./context/use-user";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, signOut } = useUser();
  return (
    <div className="flex flex-col w-full gap-4">
      <Card className="flex flex-col p-6 pb-3">
        <h3 className="font-semibold leading-none tracking-tight text-base">
          {t("profile")}
        </h3>
        <ul className="text-sm max-w-lg text-balance leading-relaxed list-disc pl-5 space-y-2">
          <li>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </li>
          <li>
            <strong>{t("email")}:</strong> {user?.email}
          </li>
        </ul>
      </Card>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        {t("signOut")}
      </Button>
    </div>
  );
}
