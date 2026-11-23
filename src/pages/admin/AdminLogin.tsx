import { useState, type FormEvent } from 'react';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setUnverifiedUser(null);
    setVerificationMessage(null);
    setIsSubmitting(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      if (!user.emailVerified) {
        setUnverifiedUser(user);
        return;
      }
      navigate('/admin', { replace: true });
    } catch {
      setError('Unable to sign in with those credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (!unverifiedUser || currentUser?.uid !== unverifiedUser.uid) {
      setVerificationMessage({
        type: 'error',
        text: 'Your sign-in session is unavailable. Please sign in again.',
      });
      return;
    }

    setVerificationMessage(null);
    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      setVerificationMessage({
        type: 'success',
        text: 'Verification email sent. Check your inbox.',
      });
    } catch {
      setVerificationMessage({
        type: 'error',
        text: 'Unable to send the verification email. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-[65vh] bg-gray-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          Administrator sign in
        </h1>
        <p className="mt-3 text-gray-600">
          Sign-in is restricted to authorized administrators.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="admin-email"
            >
              Email address
            </label>
            <input
              autoComplete="username"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-truckaxic-red"
              id="admin-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="admin-password"
            >
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-truckaxic-red"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {unverifiedUser && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-700">
              Verify your email before continuing to the admin area.
            </p>
            {verificationMessage && (
              <p
                className={
                  verificationMessage.type === 'error'
                    ? 'text-sm text-red-700'
                    : 'text-sm text-green-700'
                }
                role={
                  verificationMessage.type === 'error' ? 'alert' : 'status'
                }
              >
                {verificationMessage.text}
              </p>
            )}
            <button
              className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isResending}
              onClick={handleResendVerification}
              type="button"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <Link className="mt-6 inline-block text-sm text-gray-600 underline" to="/">
          Return to TruckAxic
        </Link>
      </section>
    </main>
  );
}
