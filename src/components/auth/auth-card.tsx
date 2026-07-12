"use client";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "@/lib/nav";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
  KeyRound,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loginClient,
  signupClient,
  type AuthState,
} from "@/lib/auth-client";

export type AuthMode = "login" | "signup";

interface AuthCardProps {
  mode: AuthMode;
}

const initialState: AuthState = { status: "idle" };

export function AuthCard({ mode }: AuthCardProps) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const action = isLogin ? loginClient : signupClient;
  const [state, formAction] = useActionState<AuthState, FormData>(
    action,
    initialState
  );

  // Redirect on success
  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md relative">
      {/* Animated mesh background */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -left-20 -right-20 -bottom-20 pointer-events-none -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-500/30 blur-3xl animate-float" />
        <div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-yellow-400/20 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div
        className="bg-white/10 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 border border-white/30 dark:border-white/10 shadow-2xl shadow-primary-500/20 dark:shadow-none auth-card-anim"
        style={{
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/40 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1.5">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {isLogin
              ? "Sign in to keep shopping where you left off"
              : "Join 12,400+ happy members in 30 seconds"}
          </p>
        </div>

        {/* Social row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 h-12 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 h-12 px-3 rounded-xl bg-[#1877F2] text-white text-sm font-medium hover:bg-[#1864D9] transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300/60 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white/0 text-neutral-500 dark:text-neutral-400 backdrop-blur-sm">
              or continue with email
            </span>
          </div>
        </div>

        {/* Form — uses the server action */}
        <form action={formAction} className="space-y-4">
          {!isLogin && (
            <Input
              name="name"
              type="text"
              icon={User}
              label="Full name"
              autoComplete="name"
              placeholder="John Doe"
            />
          )}
          <Input
            name="email"
            type="email"
            icon={Mail}
            label="Email address"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                label="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="At least 6 characters"
                minLength={6}
                required
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="inline-flex items-center justify-center w-10 h-10 min-w-[40px] rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-0.5 w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600 text-primary-500 focus:ring-2 focus:ring-primary-500/20 accent-primary-500 cursor-pointer"
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 leading-snug">
                I agree to the{" "}
                <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Privacy
                </a>
              </span>
            </div>
          )}

          {state.status === "error" && state.message && (
            <div
              className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium error-fade-in"
            >
              {state.message}
            </div>
          )}

          <SubmitButton isLogin={isLogin} />
        </form>

        <p className="mt-7 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {isLogin ? (
            <>
              New here?{" "}
              <a
                href="/signup"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Create an account
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Sign in
              </a>
            </>
          )}
        </p>

        {isLogin && (
          <details className="mt-5 text-xs">
            <summary className="cursor-pointer text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium select-none">
              Demo accounts
            </summary>
            <div className="mt-3 space-y-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 p-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono">
                  <div className="text-neutral-900 dark:text-white">admin@printwearx.com</div>
                  <div className="text-neutral-500">admin123</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <div className="border-t border-neutral-200/70 dark:border-neutral-700/50 pt-2 flex items-center justify-between gap-2">
                <div className="font-mono">
                  <div className="text-neutral-900 dark:text-white">demo@printwearx.com</div>
                  <div className="text-neutral-500">demo123</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                  Customer
                </span>
              </div>
            </div>
          </details>
        )}
      </div>

      <div
        className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-500 dark:text-neutral-400 trust-row-fade"
      >
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>256-bit SSL</span>
        </div>
        <span className="opacity-30">·</span>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>End-to-end secure</span>
        </div>
        <span className="opacity-30 hidden sm:inline">·</span>
        <span className="hidden sm:inline">GDPR compliant</span>
      </div>
    </div>
  );
}

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary-500/40 active:scale-[0.98] transition-all min-h-[56px] disabled:opacity-50 disabled:pointer-events-none"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Signing in…
        </>
      ) : isLogin ? (
        <>
          Sign in
          <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          Create account
          <Check className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

function Input({
  icon: Icon,
  label,
  rightSlot,
  ...rest
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  rightSlot?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const floating = focused || val.length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex items-center rounded-2xl border transition-all duration-200",
          "bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm",
          focused
            ? "border-primary-500 shadow-lg shadow-primary-500/10"
            : "border-neutral-300/70 dark:border-white/10"
        )}
      >
        <div className="pl-4">
          <Icon
            className={cn(
              "w-4 h-4 transition-colors",
              focused
                ? "text-primary-500"
                : "text-neutral-400 dark:text-neutral-500"
            )}
          />
        </div>
        <input
          {...rest}
          value={val}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setVal(e.target.value)}
          className="peer flex-1 h-14 bg-transparent px-3.5 pt-4 pb-1 text-sm sm:text-base text-neutral-900 dark:text-white placeholder-transparent focus:outline-none"
          placeholder=" "
        />
        <label
          className={cn(
            "absolute left-11 pointer-events-none transition-all duration-200 origin-left",
            floating
              ? "top-2 text-[10px] font-semibold uppercase tracking-wider"
              : "top-1/2 -translate-y-1/2 text-sm",
            focused
              ? "text-primary-600 dark:text-primary-400"
              : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          {label}
        </label>
        {rightSlot && <div className="pr-2">{rightSlot}</div>}
      </div>
    </div>
  );
}
