/**
 * PlaceholderTab Component
 * Clean preview screens for Practice, Leaderboard, Quests, and Profile tabs.
 */

import PropTypes from 'prop-types';
import Mascot from '../components/ui/Mascot.jsx';
import { useUserStore } from '../store/userStore.js';
import { useAuth } from '../hooks/useAuth.js';

export default function PlaceholderTab({ tabId, onStartPractice }) {
  const { user, streak, gems, xpTotal, leagueTier, dailyGoalXp } = useUserStore();
  const { upgradeToGoogle, logout } = useAuth();

  switch (tabId) {
    case 'practice':
      return (
        <div className="flex flex-col items-center max-w-[480px] mx-auto p-4 text-center">
          <div className="my-4">
            <Mascot state="happy" size={130} />
          </div>
          <h2 className="text-2xl font-black text-on-surface">Defense Drills & Practice</h2>
          <p className="text-xs font-semibold text-on-surface-variant max-w-sm mt-1 mb-6">
            Sharpen your incident response reflexes and recover lost hearts through targeted drills.
          </p>
          <div className="w-full space-y-3">
            <button
              onClick={onStartPractice}
              className="btn-tactile btn-primary w-full py-4 text-sm flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">fitness_center</span>
              <span>Start Quick Practice (+1 Heart, +5 XP)</span>
            </button>
          </div>
        </div>
      );

    case 'leaderboard':
      return (
        <div className="flex flex-col items-center max-w-[480px] mx-auto p-4 text-center">
          <div className="my-4">
            <Mascot state="cheer" size={130} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-black text-xs uppercase mb-2">
            <span className="material-symbols-outlined text-sm">emoji_events</span>
            <span>{leagueTier} League</span>
          </div>
          <h2 className="text-2xl font-black text-on-surface">Weekly Cadet Standings</h2>
          <p className="text-xs font-semibold text-on-surface-variant max-w-sm mt-1 mb-4">
            Top 10 promote to the next tier every Monday at 00:00 UTC. Complete lessons to climb!
          </p>
          <div className="w-full bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 text-left space-y-2.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-primary-container/15 border border-primary-container/30">
              <div className="flex items-center gap-3">
                <span className="font-black text-sm text-primary w-5 text-center">#1</span>
                <span className="font-extrabold text-sm text-on-surface">
                  {user?.displayName || 'You (Cadet)'}
                </span>
              </div>
              <span className="font-extrabold text-sm text-primary">{xpTotal} XP</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container opacity-70">
              <div className="flex items-center gap-3">
                <span className="font-black text-sm text-on-surface-variant w-5 text-center">#2</span>
                <span className="font-bold text-sm text-on-surface">ByteSentinel</span>
              </div>
              <span className="font-bold text-sm text-on-surface-variant">45 XP</span>
            </div>
          </div>
        </div>
      );

    case 'quests':
      return (
        <div className="flex flex-col items-center max-w-[480px] mx-auto p-4 text-center">
          <div className="my-4">
            <Mascot state="idle" size={130} />
          </div>
          <h2 className="text-2xl font-black text-on-surface">Daily Defense Directives</h2>
          <p className="text-xs font-semibold text-on-surface-variant max-w-sm mt-1 mb-4">
            Complete daily missions to earn reward gems and maintain your training streak.
          </p>
          <div className="w-full space-y-2.5 text-left">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-on-surface">Earn {dailyGoalXp} XP</span>
                <span className="text-xs text-on-surface-variant font-semibold mt-0.5">
                  Progress: {Math.min(xpTotal, dailyGoalXp)} / {dailyGoalXp} XP
                </span>
              </div>
              <span className="font-black text-xs text-secondary">+15 Gems</span>
            </div>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="flex flex-col items-center max-w-[480px] mx-auto p-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center text-primary text-3xl font-black my-3 ring-4 ring-primary-container/30">
            {user?.displayName?.[0] || 'C'}
          </div>
          <h2 className="text-2xl font-black text-on-surface">{user?.displayName || 'Cadet'}</h2>
          <span className="text-xs font-extrabold text-on-surface-variant uppercase tracking-wider">
            {user?.isAnonymous ? 'Guest Account' : 'Verified Defender'}
          </span>

          {/* Stats Bento */}
          <div className="grid grid-cols-3 gap-2 w-full my-6">
            <div className="p-3 bg-surface-container rounded-xl">
              <span className="font-black text-lg text-tertiary-container block">{streak}</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Streak</span>
            </div>
            <div className="p-3 bg-surface-container rounded-xl">
              <span className="font-black text-lg text-primary block">{xpTotal}</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Total XP</span>
            </div>
            <div className="p-3 bg-surface-container rounded-xl">
              <span className="font-black text-lg text-secondary block">{gems}</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Gems</span>
            </div>
          </div>

          {/* Account Upgrade if Guest */}
          {user?.isAnonymous && (
            <div className="w-full p-4 mb-4 rounded-2xl bg-secondary-fixed/20 border border-secondary/30 text-left">
              <span className="font-extrabold text-xs text-secondary uppercase tracking-wider block mb-1">
                Save Your Cadet Progress
              </span>
              <p className="text-xs font-semibold text-on-surface-variant mb-3">
                Link your guest account with Google to keep your streak, gems, and league standing safe.
              </p>
              <button
                onClick={upgradeToGoogle}
                className="btn-tactile btn-secondary w-full py-2.5 text-xs uppercase"
                type="button"
              >
                Upgrade to Google Account
              </button>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full py-3 text-xs font-extrabold text-error hover:bg-error-container/30 rounded-xl transition-colors uppercase tracking-wider"
            type="button"
          >
            Log Out
          </button>
        </div>
      );

    default:
      return null;
  }
}

PlaceholderTab.propTypes = {
  tabId: PropTypes.string.isRequired,
  onStartPractice: PropTypes.func
};
