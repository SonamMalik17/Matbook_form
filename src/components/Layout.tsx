import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2.5M12 19.5V22M4.22 4.22 6 6M18 18l1.78 1.78M2 12h2.5M19.5 12H22M6 18l-1.78 1.78M18 6l1.78-1.78" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M21 12.79A9 9 0 0 1 11.21 3 7.5 7.5 0 1 0 21 12.79Z" />
  </svg>
);

const Layout = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? theme === 'light'
          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
          : 'bg-slate-200 text-slate-900'
        : theme === 'light'
          ? 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-50'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-5 pb-10 pt-8">
        <header
          className="mb-8 flex flex-col gap-4 rounded-2xl border p-6"
          style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--ink)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">MatBook</p>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--ink)' }}>
                Dynamic Form Builder
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Build, validate, and review onboarding submissions in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                className="flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition hover:scale-105 hover:shadow-md"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--ink)',
                  background: theme === 'light' ? '#eef2fb' : 'var(--panel)'
                }}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <NavLink to="/form" className={navClasses}>
              Dynamic Form
            </NavLink>
            <NavLink to="/submissions" className={navClasses}>
              Submissions
            </NavLink>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
