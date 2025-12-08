import { LoginForm } from "@/components/login-form";
import { ThemeLogo } from "@/components/theme-logo";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-sky-50 to-sky-200 dark:from-zinc-950 dark:to-slate-950">
      <div className="w-full max-w-sm ">
        <h1 className="text-center mb-12 font-mono font-semibold text-4xl bg-gradient-to-r from-zinc-600 dark:from-zinc-400 to-zinc-900 dark:to-zinc-100 text-transparent bg-clip-text">
          PICHIDANGUI
        </h1>
        <div className="flex h-16 items-center justify-center gap-16 mb-6">
          <ThemeLogo src="ucn-logo" alt="UCN Logo" />
          <ThemeLogo src="eic-logo" alt="EIC Logo" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
