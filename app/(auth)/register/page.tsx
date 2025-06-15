import { AuthForm } from "@/components/form/auth-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-8 bg-muted">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center">Register Page</h1>
        <AuthForm type="register" />
      </Card>
    </div>
  );
}
