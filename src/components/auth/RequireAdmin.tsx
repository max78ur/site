import { useEffect, useState } from 'react';
import { getIdTokenResult, onIdTokenChanged, signOut } from 'firebase/auth';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { auth } from '@/lib/firebase';

type AdminStatus =
  | 'checking'
  | 'signed-out'
  | 'not-admin'
  | 'authorized'
  | 'verification-error';

export default function RequireAdmin() {
  const [status, setStatus] = useState<AdminStatus>('checking');

  useEffect(() => {
    let active = true;
    let forceInitialRefresh = true;
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!user) {
        setStatus('signed-out');
        return;
      }

      setStatus('checking');
      const forceRefresh = forceInitialRefresh;
      forceInitialRefresh = false;
      void getIdTokenResult(user, forceRefresh)
        .then(({ claims }) => {
          if (!active || auth.currentUser?.uid !== user.uid) return;
          setStatus(claims.admin === true ? 'authorized' : 'not-admin');
        })
        .catch(() => {
          if (active && auth.currentUser?.uid === user.uid) {
            setStatus('verification-error');
          }
        });
    }, () => {
      if (active) setStatus('verification-error');
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (status === 'checking') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center text-white">
        <p>Verifying administrator access...</p>
      </main>
    );
  }

  if (status === 'signed-out') {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === 'verification-error') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center text-white">
        <p role="alert">
          Administrator access could not be verified. Please try signing in
          again.
        </p>
        <Link className="mt-6 inline-block underline" to="/admin/login">
          Return to sign in
        </Link>
      </main>
    );
  }

  if (status === 'not-admin') {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Administrator access required</h1>
        <p className="mt-4 text-white/70">
          This account has not been authorized for the admin area.
        </p>
        <button
          className="btn-primary mt-8"
          onClick={() => {
            void signOut(auth).catch(() => setStatus('verification-error'));
          }}
          type="button"
        >
          Sign out
        </button>
      </main>
    );
  }

  return <Outlet />;
}
