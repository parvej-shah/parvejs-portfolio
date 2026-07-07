import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

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
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
