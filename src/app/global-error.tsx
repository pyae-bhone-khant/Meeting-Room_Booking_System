// app/global-error.tsx
'use client'

import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-slate-200/50 bg-white/80 p-10 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/10">
              <AlertTriangle className="h-10 w-10 text-rose-600 dark:text-rose-400" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 text-center">
            <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
              Error 500
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Something went wrong
            </h1>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              We're sorry, but an unexpected error occurred while processing
              your request.
            </p>

            <p className="mt-2 text-slate-500 dark:text-slate-500">
              Please try again in a few moments or return to the homepage.
            </p>
          </div>

          {/* Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8">
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-950">
                <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Developer Error Details
                </p>
                <pre className="overflow-auto text-xs text-rose-600 dark:text-rose-400">
                  {error?.message || 'Unknown Runtime Error'}
                </pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <RefreshCcw size={18} />
              Try Again
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Home size={18} />
              Go Home
            </a>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
