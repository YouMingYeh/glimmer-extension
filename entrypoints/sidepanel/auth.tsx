import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SignInPage({
  signIn,
  loading,
}: {
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: Error | null;
  }>;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const handleSignIn = async () => {
    const { data, error } = await signIn(email, password);
    if (error) {
      setError(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-96">
        <Card>
          <div className="flex flex-col space-y-4 p-6">
            <h3 className="font-semibold leading-none tracking-tight text-base">
              {t("signIn")}
            </h3>
            <Label>{t("email")}</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Label>{t("password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-red-500 text-sm">
                {t("invalidCredentials")}
              </div>
            )}
            <Button onClick={handleSignIn} loading={loading} disabled={loading}>
              {t("signIn")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function SignUpPage({
  signUp,
  loading,
}: {
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: Error | null;
  }>;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation();

  const handleSignUp = async () => {
    const { data, error } = await signUp(email, password);
    if (error) {
      setError(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-96">
        <Card>
          <div className="flex flex-col space-y-4 p-6">
            <h3 className="font-semibold leading-none tracking-tight text-base">
              {t("signUp")}
            </h3>
            <Label>{t("email")}</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Label>{t("password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-red-500 text-sm">
                {t("invalidCredentials")}
              </div>
            )}
            <Button onClick={handleSignUp} loading={loading} disabled={loading}>
              {t("signUp")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AuthPage({
  signIn,
  signUp,
  loading,
}: {
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: Error | null;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    data: any;
    error: Error | null;
  }>;
  loading: boolean;
}) {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-96">
        {isSignIn ? (
          <SignInPage signIn={signIn} loading={loading} />
        ) : (
          <SignUpPage signUp={signUp} loading={loading} />
        )}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setIsSignIn(!isSignIn)}
            size="sm"
            variant="link"
            loading={loading}
          >
            {isSignIn
              ? t("needAnAccount") + " " + t("signUp")
              : t("haveAnAccount") + " " + t("signIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
