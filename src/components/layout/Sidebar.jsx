/**
 * Sidebar Component
 * Desktop left sidebar navigation (hidden on mobile, visible on md+ screens).
 */

import PropTypes from 'prop-types';
import { useUserStore } from '../../store/userStore.js';

export default function Sidebar({ activeTab, onTabChange }) {
  const { user } = useUserStore();

  const navItems = [
    { id: 'learn', label: 'Learn', icon: 'school' },
    { id: 'practice', label: 'Practice', icon: 'fitness_center' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'emoji_events' },
    { id: 'quests', label: 'Quests', icon: 'military_tech' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' }
  ];

  return (
    <aside
      className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-surface border-r border-outline-variant/30 p-4 select-none z-30"
      aria-label="Desktop Navigation"
    >
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white shadow-btn-primary-sm">
            <span className="material-symbols-outlined text-2xl">security</span>
          </div>
          <span className="font-extrabold text-2xl text-on-surface tracking-tight">
            CyberLingo<span className="text-primary-container">.</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary-container/15 text-primary border-2 border-primary-container/30 shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border-2 border-transparent'
                }`}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tile at Bottom of Sidebar */}
      <div
        onClick={() => onTabChange('profile')}
        className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 cursor-pointer transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary font-bold overflow-hidden ring-2 ring-primary-container/20">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-xl">person</span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-on-surface truncate">
            {user?.displayName || 'Cyber Cadet'}
          </span>
          <span className="text-xs text-on-surface-variant capitalize">
            {user?.isAnonymous ? 'Guest Account' : 'Defender'}
          </span>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

