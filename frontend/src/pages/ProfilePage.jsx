import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/formatters';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <Card title="Account profile" description="JWT session details resolved from the authenticated token.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['Email', user?.email || '—'],
          ['User ID', user?.id || '—'],
          ['Account Created', formatDateTime(user?.createdAt)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-2 break-all text-sm font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="danger" onClick={() => {
          logout();
          window.location.assign('/login');
        }}>
          Logout
        </Button>
      </div>
    </Card>
  );
}