/**
 * BottomNav Component
 * Mobile navigation bar with chunky tactile icons for the 5 main tabs:
 * Learn, Practice, Leaderboard, Quests, Profile.
 */

import PropTypes from 'prop-types';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'learn', label: 'Learn', icon: 'school' },
    { id: 'practice', label: 'Practice', icon: 'fitness_center' },
    { id: 'leaderboard', label: 'Leagues', icon: 'emoji_events' },
    { id: 'quests', label: 'Quests', icon: 'military_tech' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' }
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 pb-safe md:hidden"
      aria-label="Main Navigation"
    >
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all rounded-xl select-none ${
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`w-10 h-7 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-primary-container/20' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
              </div>
              <span
                className={`text-[11px] font-extrabold uppercase tracking-tight mt-0.5 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

BottomNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

