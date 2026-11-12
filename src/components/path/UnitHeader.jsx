/**
 * UnitHeader Component
 * Colored banner atop each unit containing unit number, title, guidebook button,
 * and mastery progress bar.
 */

import PropTypes from 'prop-types';

export default function UnitHeader({
  unit,
  unitIndex,
  completedCount,
  totalCount,
  onOpenGuidebook
}) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const unitColor = unit.color || '#58CC02';

  return (
    <section className="sticky top-16 z-30 pt-2 pb-3 w-full">
      <div
        className="relative overflow-hidden rounded-2xl text-white p-4 shadow-[0_5px_0_0_rgba(0,0,0,0.2)] transition-transform"
        style={{ backgroundColor: unitColor }}
      >
        {/* Decorative Background Circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-12 -top-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-1/3 -bottom-4 w-12 h-12 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-extrabold text-xs text-white/90 uppercase tracking-wider">
                UNIT {unitIndex + 1} · {unit.title}
              </span>
            </div>
            <h2 className="font-extrabold text-lg text-white tracking-tight mt-0.5 truncate">
              {unit.title}
            </h2>
          </div>

          {/* Guidebook Button */}
          <button
            onClick={() => onOpenGuidebook(unit)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 active:translate-y-0.5 text-white font-extrabold text-xs transition-all backdrop-blur-sm cursor-pointer shadow-[0_2px_0_0_rgba(0,0,0,0.15)]"
            type="button"
          >
            <span className="material-symbols-outlined text-base leading-none">menu_book</span>
            <span className="uppercase tracking-wide">Guide</span>
          </button>
        </div>

        {/* Unit Completion Progress Strip */}
        <div className="relative z-10 mt-3 flex items-center gap-2">
          <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs text-white/90 shrink-0 font-extrabold">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>
    </section>
  );
}

UnitHeader.propTypes = {
  unit: PropTypes.shape({
    unitId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    guidebook: PropTypes.string
  }).isRequired,
  unitIndex: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onOpenGuidebook: PropTypes.func.isRequired
};

