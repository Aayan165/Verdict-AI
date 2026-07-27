import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, FileText, Gauge, LogOut, PanelsTopLeft, PlaySquare, Shapes, UserCircle2, X } from 'lucide-react';
import { cn } from '../utils/classNames';
import { getInitials } from '../utils/jwt';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import logo from '../assets/logo.png';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/evaluate', label: 'Evaluate', icon: PlaySquare },
  { to: '/evaluations', label: 'Evaluations', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/model-comparison', label: 'Model Comparison', icon: PanelsTopLeft },
  { to: '/experiments', label: 'Experiments', icon: Shapes },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const userBadge = useMemo(() => getInitials(user?.email), [user?.email]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-[rgba(35,21,15,0.42)] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-[rgba(78,34,15,0.10)] bg-[rgba(255,255,255,0.62)] p-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            {/* <div className="brand-orb flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-[#F7F1DE] shadow-soft">
              <div className="h-4 w-4 rounded-full bg-[#F7F1DE]" />
            </div> */}
              <img
                src={logo}
                alt="LLM Arbitrator Logo"
                className="flex h-12 w-12 items-center justify-center"
              />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">LLM</p>
              <p className="text-lg font-semibold leading-tight text-ink">Arbitrator</p>
            </div>
          </NavLink>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 thin-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-primary text-[#F7F1DE] shadow-subtle' : 'text-ink hover:bg-white/70 hover:text-primary',
                  )
                }
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 rounded-xl border border-border bg-white/70 p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(78,34,15,0.08)] font-semibold text-primary">
              {userBadge}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user?.email || 'Signed in user'}</p>
              <p className="truncate text-xs text-muted">JWT session active</p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            className="mt-4 w-full"
            onClick={() => {
              logout();
              window.location.assign('/login');
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}