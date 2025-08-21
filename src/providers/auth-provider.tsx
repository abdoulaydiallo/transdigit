"use client";
import Link from "next/link";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      Link={Link}
      navigate={(url) => router.push(url)}
      replace={(url) => router.replace(url)}
      onSessionChange={() => router.refresh()}
      social={{ providers: ["google"] }}
      credentials={{ confirmPassword: true, forgotPassword: true }}
      settings={{ url: "/auth/settings" }}
      emailOTP={true}
    >
      {children}
    </AuthUIProvider>
  );
}
