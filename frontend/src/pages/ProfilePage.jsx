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
import Loader from '../components/Loader';

import { useAuth } from '../hooks/useAuth';

import { getProfile } from '../features/profile/profile.service';

import { extractApiError } from '../api/client';
import { formatDateTime } from '../utils/formatters';

export default function ProfilePage() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        toast.error(extractApiError(error));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ['Full Name', profile?.full_name || 'Not Set'],
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

      <div className="mt-6 flex flex-wrap gap-3">
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
    </Card>
  );
}