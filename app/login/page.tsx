import { LoginForm } from "@/components/login-form";
import { ThemeLogo } from "@/components/theme-logo";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm ">
        <div className="flex h-16 items-center justify-center gap-16 mb-6">
          <ThemeLogo src="ucn-logo" alt="UCN Logo" />
          <ThemeLogo src="eic-logo" alt="EIC Logo" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
