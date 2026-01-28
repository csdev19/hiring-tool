import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@interviews-tool/web-ui";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { clientTreaty } from "@/lib/client-treaty";

import { useSession } from "@/hooks/use-session";
import SignInForm from "@/components/sign-in-form";

function LoginPage() {
  const { session, isPending } = useSession();

  if (session && !isPending) {
    return <Navigate to="/hiring-processes" />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <SignInForm />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <Link to="/auth/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});
