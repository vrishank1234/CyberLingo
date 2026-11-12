/**
 * Learn Tab Component
 * Vertical winding path of lesson nodes grouped by unit with colored unit headers,
 * guidebook button, and sequential unlocking.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import UnitHeader from '../components/path/UnitHeader.jsx';
import LessonNode from '../components/path/LessonNode.jsx';
import PathConnector from '../components/path/PathConnector.jsx';
import StartLessonModal from '../components/modals/StartLessonModal.jsx';
import GuidebookModal from '../components/modals/GuidebookModal.jsx';
import { useLearnPath } from '../hooks/useLearnPath.js';
import { useUserStore } from '../store/userStore.js';

export default function Learn({ onStartLesson }) {
  const { track, getLessonState } = useLearnPath();
  const { completedLessons } = useUserStore();

  const [activeLessonModal, setActiveLessonModal] = useState(null); // { lesson, unit, isCompleted }
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState(null);

  // Alternating horizontal sine-wave pattern for Duolingo winding path nodes
  const nodeOffsets = [0, -48, 48, 0, -48, 48];

  const handleNodeClick = (lesson, unit, isCompleted) => {
    setActiveLessonModal({ lesson, unit, isCompleted });
  };

  return (
    <div className="flex flex-col w-full max-w-[480px] mx-auto pb-28 select-none">
      {track.units?.map((unit, unitIdx) => {
        // Calculate completed count for this unit
        const unitCompletedCount = unit.lessons?.filter((l) =>
          completedLessons.includes(l.lessonId)
        ).length || 0;

        return (
          <div key={unit.unitId} className="flex flex-col w-full mb-8">
            {/* Unit Colored Header Banner */}
            <UnitHeader
              unit={unit}
              unitIndex={unitIdx}
              completedCount={unitCompletedCount}
              totalCount={unit.lessons?.length || 3}
              onOpenGuidebook={(u) => setActiveGuidebookUnit(u)}
            />

            {/* Winding Path Canvas Area */}
            <section className="relative w-full py-6 flex flex-col items-center">
              {/* SVG Connecting Path */}
              <PathConnector
                totalNodes={unit.lessons?.length || 3}
                nodeOffsets={nodeOffsets.slice(0, unit.lessons?.length || 3)}
              />

              {/* Lesson Nodes on Path */}
              {unit.lessons?.map((lesson, lessonIdx) => {
                const nodeState = getLessonState(lesson.lessonId, unitIdx, lessonIdx);
                const offset = nodeOffsets[lessonIdx % nodeOffsets.length];

                return (
                  <LessonNode
                    key={lesson.lessonId}
                    lesson={lesson}
                    state={nodeState}
                    horizontalOffset={offset}
                    onClick={() =>
                      handleNodeClick(lesson, unit, nodeState === 'completed')
                    }
                  />
                );
              })}

              {/* Bonus Cyber Cache Tile after Unit 1 */}
              {unitIdx === 0 && (
                <div className="relative z-10 my-4 flex items-center justify-start pl-8 w-full max-w-[280px]">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_4px_0_0_#d8b056] active:translate-y-1 transition-transform cursor-pointer">
                    <span
                      className="material-symbols-outlined text-3xl text-tertiary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      lock_open
                    </span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-tertiary">
                        Cyber Cache
                      </span>
                      <span className="text-[11px] font-bold text-on-surface-variant">
                        +50 Bonus Gems
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        );
      })}

      {/* Start Lesson Modal Sheet */}
      {activeLessonModal && (
        <StartLessonModal
          isOpen={Boolean(activeLessonModal)}
          lesson={activeLessonModal.lesson}
          unit={activeLessonModal.unit}
          isCompleted={activeLessonModal.isCompleted}
          onClose={() => setActiveLessonModal(null)}
          onStart={(l) => onStartLesson(l, activeLessonModal.unit)}
        />
      )}

      {/* Guidebook Modal Sheet */}
      {activeGuidebookUnit && (
        <GuidebookModal
          isOpen={Boolean(activeGuidebookUnit)}
          unit={activeGuidebookUnit}
          onClose={() => setActiveGuidebookUnit(null)}
        />
      )}
    </div>
  );
}

Learn.propTypes = {
  onStartLesson: PropTypes.func.isRequired
};
