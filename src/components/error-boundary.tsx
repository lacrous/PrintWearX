"use client";
import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RotateCw, Home, MessageCircle } from "lucide-react";
import { Link } from "@/lib/nav";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, ship to Sentry / LogRocket / PostHog here
    // console.error('ErrorBoundary caught:', error, errorInfo);
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Something broke
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
              We hit an unexpected error rendering this page. The team has been
              notified. Try again, or head back home.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 select-none">
                  Show technical details
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs overflow-auto max-h-40 text-error">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.reset}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors min-h-[44px]"
              >
                <RotateCw className="w-4 h-4" />
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                Back home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
