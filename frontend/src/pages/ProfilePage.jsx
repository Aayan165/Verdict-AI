// import Button from '../components/Button';
// import Card from '../components/Card';
// import { useAuth } from '../hooks/useAuth';
// import { formatDateTime } from '../utils/formatters';

// export default function ProfilePage() {
//   const { user, logout } = useAuth();

//   return (
//     <Card title="Account profile" description="JWT session details resolved from the authenticated token.">
//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//         {[
//           ['Email', user?.email || '—'],
//           ['User ID', user?.id || '—'],
//           ['Account Created', formatDateTime(user?.createdAt)],
//         ].map(([label, value]) => (
//           <div key={label} className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
//             <p className="mt-2 break-all text-sm font-semibold text-ink">{value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 flex flex-wrap gap-3">
//         <Button variant="danger" onClick={() => {
//           logout();
//           window.location.assign('/login');
//         }}>
//           Logout
//         </Button>
//       </div>
//     </Card>
//   );
// }

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Loader from '../components/Loader';

import { useAuth } from '../hooks/useAuth';

import { updateProfile } from '../features/profile/profile.service';
import { formatDateTime } from '../utils/formatters';

export default function ProfilePage() {
  const { logout, profile, profileLoading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || '');
  }, [profile?.full_name]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await updateProfile({ full_name: fullName.trim() || null });
      await refreshProfile();
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading && !profile) {
    return (
      <Card>
        <Loader label="Loading profile..." />
      </Card>
    );
  }

  return (
    <Card
      title="Account Profile"
      description="Your Verdict AI account information."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          {[
            ['Email', profile?.email || '—'],
            ['User ID', profile?.id || '—'],
            ['Account Created', formatDateTime(profile?.created_at)],
            ['Evaluations', profile?.total_evaluations ?? 0],
            ['Experiments', profile?.total_experiments ?? 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {label}
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-ink">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader label="Saving..." /> : 'Save changes'}
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              logout();
              window.location.assign('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </form>
    </Card>
  );
}