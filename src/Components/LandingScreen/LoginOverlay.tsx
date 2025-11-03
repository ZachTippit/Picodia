import { FormEvent, useState } from 'react';
import { cn } from '../../lib/cn';
import { useSupabase } from '../../SupabaseProvider';
import LoginGoogle from './LoginGoogle';
import LoginApple from './LoginApple';

interface LoginOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginOverlay = ({ isOpen, onClose }: LoginOverlayProps) => {
  const supabase = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess('Signed in successfully.');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 600);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (authError) {
        throw authError;
      }

      setSuccess('Redirecting to Google…');
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Unable to start Google sign-in.';
      setError(message);
      setSuccess(null);
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setAppleLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (authError) {
        throw authError;
      }

      setSuccess('Redirecting to Apple…');
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Unable to start Apple sign-in.';
      setError(message);
      setSuccess(null);
      setAppleLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 flex justify-center bg-gray-900/70 px-4 transition-transform duration-500 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="mt-16 flex w-full max-w-md flex-col bg-white text-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold uppercase tracking-wide">Picodia</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <div className="px-6 pt-8 pb-6">
            <h3 className="mb-6 text-center text-xl font-semibold">Log in or create an account</h3>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                <span>Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading || googleLoading || appleLoading}
                  className="rounded border border-gray-400 px-3 py-2 text-base text-gray-900 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
                <span>Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading || googleLoading || appleLoading}
                  className="rounded border border-gray-400 px-3 py-2 text-base text-gray-900 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
              <button
                type="submit"
                disabled={loading || googleLoading || appleLoading}
                className={cn(
                  'mt-2 w-full rounded-sm bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition',
                  loading || googleLoading || appleLoading ? 'opacity-70' : 'hover:bg-black'
                )}
              >
                {loading ? 'Signing in…' : 'Continue'}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
              <span className="h-px flex-1 bg-gray-300" />
              <span>or</span>
              <span className="h-px flex-1 bg-gray-300" />
            </div>

            <div className="mt-6 space-y-3 text-xs text-gray-500">
              <LoginGoogle onClick={handleGoogleSignIn} disabled={googleLoading || appleLoading } googleLoading={googleLoading} />
              <LoginApple onClick={handleAppleSignIn} disabled={appleLoading || googleLoading } appleLoading={appleLoading} />
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-500">
            <p className="mt-4 text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline hover:text-gray-700">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;
