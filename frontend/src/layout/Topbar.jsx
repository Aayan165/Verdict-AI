import { Menu, MoonStar, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/jwt';

export default function Topbar({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(78,34,15,0.08)] bg-[rgba(247,241,222,0.88)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-ink sm:text-2xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-medium text-muted md:flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live backend connected
          </div>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            <MoonStar className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 rounded-full border border-border bg-white/80 px-2 py-2 pr-4 shadow-subtle">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-[#F7F1DE]">
              {getInitials(user?.email)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-ink">{user?.email || 'Authenticated user'}</p>
              <p className="text-xs text-muted">JWT session</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}