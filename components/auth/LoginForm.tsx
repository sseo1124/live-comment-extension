import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginResponse = {
  accessToken: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
};

const isLoginResponse = (value: unknown): value is LoginResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;
  const user = data.user as Record<string, unknown> | undefined;

  return (
    typeof data.accessToken === "string" &&
    user !== undefined &&
    typeof user._id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string"
  );
};

const resolveLoginEndpoint = () => {
  const baseUrl = import.meta.env.WXT_API_URL ?? "http://localhost:8000";
  return `${baseUrl.replace(/\/+$/, "")}/auth/login`;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [authResult, setAuthResult] = useState<LoginResponse | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || status === "loading") {
      return;
    }

    void submitLogin();
  };

  const submitLogin = async () => {
    setStatus("loading");
    setError(null);
    setAuthResult(null);

    try {
      const response = await fetch(resolveLoginEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch (parseError) {
        console.warn("Failed to parse login response JSON", parseError);
      }

      if (!response.ok) {
        const message =
          payload &&
          typeof (payload as { message?: unknown }).message === "string"
            ? (payload as { message: string }).message
            : "로그인에 실패했습니다. 다시 시도해 주세요.";
        throw new Error(message);
      }

      if (!isLoginResponse(payload)) {
        throw new Error("로그인 응답이 예상한 형식과 다릅니다.");
      }

      setStatus("success");
      setAuthResult(payload);
    } catch (err) {
      console.error("Login failed", err);
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "로그인 요청 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>간편하게 로그인 하세요</CardTitle>
          <CardDescription>
            계정의 이메일과 비밀번호를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="live@example.com"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) {
                      setError(null);
                    }
                    if (authResult) {
                      setAuthResult(null);
                    }
                    if (status !== "idle") {
                      setStatus("idle");
                    }
                  }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    비밀번호 잊으셨나요?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) {
                      setError(null);
                    }
                    if (authResult) {
                      setAuthResult(null);
                    }
                    if (status !== "idle") {
                      setStatus("idle");
                    }
                  }}
                />
              </Field>
              {error ? (
                <Field>
                  <FieldDescription className="text-destructive">
                    {error}
                  </FieldDescription>
                </Field>
              ) : null}
              {status === "success" && authResult ? (
                <Field>
                  <FieldDescription className="text-emerald-600">
                    {authResult.user.name}님, 로그인에 성공했어요.
                  </FieldDescription>
                </Field>
              ) : null}
              <Field>
                <Button
                  type="submit"
                  disabled={!canSubmit || status === "loading"}
                >
                  {status === "loading" ? "로그인 중..." : "로그인"}
                </Button>
                <FieldDescription className="text-center">
                  계정이 없으신가요? <a href="#">회원가입</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
