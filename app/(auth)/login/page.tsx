import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/LoginForm";

// Only same-origin paths are accepted, so a crafted ?callbackUrl cannot turn the
// login screen into an open redirect.
function safeCallbackUrl(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl);
  const session = await auth();
  if (session) redirect(callbackUrl);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="">
          <CardTitle className="">Admin sign in</CardTitle>
          <CardDescription className="">
            Sign in to manage projects, posts, and site content.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
