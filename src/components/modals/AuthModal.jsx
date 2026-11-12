/**
 * AuthModal Component
 * Sign in / Sign up popup for existing cadets or returning users.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth.js';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  const { signInWithGoogle, loginWithEmail, registerWithEmail, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegister) {
        await registerWithEmail(email, password, displayName || 'Defender');
      } else {
        await loginWithEmail(email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleGoogle = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err) {
      setAuthError(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-[2px]">
      <div
        className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-[slideUp_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-xl text-on-surface">
            {isRegister ? 'Join CyberLingo' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-error-container text-error text-xs font-bold leading-tight">
            {authError}
          </div>
        )}

        {/* Google One-Click CTA */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="btn-tactile btn-white w-full py-3.5 text-xs flex items-center justify-center gap-3"
          type="button"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span className="uppercase font-extrabold tracking-wider">Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-outline-variant/40" />
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">or with email</span>
          <div className="flex-1 h-px bg-outline-variant/40" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <div>
              <label className="text-xs font-extrabold text-on-surface uppercase block mb-1">
                Your Cadet Callsign
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. CyberFox"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-outline-variant/50 focus:border-primary-container outline-none text-sm font-semibold text-on-surface bg-surface"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-extrabold text-on-surface uppercase block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cadet@cyberlingo.app"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-outline-variant/50 focus:border-primary-container outline-none text-sm font-semibold text-on-surface bg-surface"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-on-surface uppercase block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-outline-variant/50 focus:border-primary-container outline-none text-sm font-semibold text-on-surface bg-surface"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-tactile btn-primary w-full py-3.5 text-sm uppercase mt-2"
          >
            {loading ? 'Validating...' : isRegister ? 'Create Cadet Account' : 'Log In'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setAuthError('');
            }}
            className="text-xs font-extrabold text-secondary hover:underline cursor-pointer"
          >
            {isRegister
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};
