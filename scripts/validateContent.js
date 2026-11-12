/**
 * Content Validation Script
 * Validates all course content JSON files in /content against the CyberLingo schema,
 * ensuring unique IDs, valid answer indexes, valid exercise types, and 8-15 exercises per lesson.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '../content');

const VALID_EXERCISE_TYPES = [
  'multiple_choice',
  'multi_select',
  'true_false',
  'fill_blank',
  'match_pairs',
  'order_steps',
  'scenario',
  'spot_the_threat',
  'command_complete',
  'info_card'
];

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

let totalErrors = 0;
let totalWarnings = 0;

function logError(file, message) {
  console.error(`❌ [ERROR] ${file}: ${message}`);
  totalErrors++;
}

function logWarning(file, message) {
  console.warn(`⚠️ [WARN] ${file}: ${message}`);
  totalWarnings++;
}

function validateExercise(exercise, file, lessonId, exerciseIds) {
  const prefix = `Lesson '${lessonId}' Exercise '${exercise.id || 'UNKNOWN'}'`;

  if (!exercise.id || typeof exercise.id !== 'string') {
    logError(file, `${prefix}: Missing or invalid 'id' string`);
  } else {
    if (exerciseIds.has(exercise.id)) {
      logError(file, `${prefix}: Duplicate exercise ID '${exercise.id}' found in track`);
    }
    exerciseIds.add(exercise.id);
  }

  if (!exercise.type || !VALID_EXERCISE_TYPES.includes(exercise.type)) {
    logError(file, `${prefix}: Invalid exercise type '${exercise.type}'. Supported: ${VALID_EXERCISE_TYPES.join(', ')}`);
    return;
  }

  switch (exercise.type) {
    case 'multiple_choice':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
        logError(file, `${prefix}: 'options' must be an array of at least 2 items`);
      }
      if (typeof exercise.answer !== 'number' || exercise.answer < 0 || exercise.answer >= (exercise.options?.length || 0)) {
        logError(file, `${prefix}: 'answer' index ${exercise.answer} is out of bounds for options length ${exercise.options?.length}`);
      }
      if (!exercise.explanation) {
        logWarning(file, `${prefix}: Missing 'explanation' for educational feedback`);
      }
      break;

    case 'multi_select':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
        logError(file, `${prefix}: 'options' must be an array of at least 2 items`);
      }
      if (!Array.isArray(exercise.answer) || exercise.answer.length === 0) {
        logError(file, `${prefix}: 'answer' must be a non-empty array of option indices`);
      } else {
        for (const idx of exercise.answer) {
          if (typeof idx !== 'number' || idx < 0 || idx >= (exercise.options?.length || 0)) {
            logError(file, `${prefix}: Answer index ${idx} is out of bounds`);
          }
        }
      }
      break;

    case 'true_false':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (typeof exercise.answer !== 'boolean') {
        logError(file, `${prefix}: 'answer' must be a boolean true or false`);
      }
      break;

    case 'fill_blank':
      if (!exercise.sentence || typeof exercise.sentence !== 'string' || !exercise.sentence.includes('___')) {
        logError(file, `${prefix}: 'sentence' must contain the blank placeholder '___'`);
      }
      if (!Array.isArray(exercise.wordBank) || exercise.wordBank.length < 2) {
        logError(file, `${prefix}: 'wordBank' must contain at least 2 choices`);
      }
      if (!Array.isArray(exercise.answer) || exercise.answer.length === 0) {
        logError(file, `${prefix}: 'answer' must be an array of tokens`);
      } else {
        for (const word of exercise.answer) {
          if (!exercise.wordBank?.includes(word)) {
            logError(file, `${prefix}: Word bank is missing answer token '${word}'`);
          }
        }
      }
      break;

    case 'match_pairs':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!Array.isArray(exercise.pairs) || exercise.pairs.length < 2) {
        logError(file, `${prefix}: 'pairs' must be an array of at least 2 [left, right] tuples`);
      } else {
        for (const pair of exercise.pairs) {
          if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || typeof pair[1] !== 'string') {
            logError(file, `${prefix}: Pair must be a 2-element tuple of strings`);
          }
        }
      }
      break;

    case 'order_steps':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!Array.isArray(exercise.steps) || exercise.steps.length < 3) {
        logError(file, `${prefix}: 'steps' must be an array of at least 3 items in correct order`);
      }
      break;

    case 'scenario':
      if (!exercise.context || typeof exercise.context !== 'string') {
        logError(file, `${prefix}: Missing 'context' story narrative`);
      }
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
        logError(file, `${prefix}: 'options' must be an array of at least 2 items`);
      }
      if (typeof exercise.answer !== 'number' || exercise.answer < 0 || exercise.answer >= (exercise.options?.length || 0)) {
        logError(file, `${prefix}: 'answer' index ${exercise.answer} is out of bounds`);
      }
      break;

    case 'spot_the_threat':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!exercise.threatData || !Array.isArray(exercise.threatData.targets) || exercise.threatData.targets.length < 2) {
        logError(file, `${prefix}: 'threatData.targets' must be an array of at least 2 targets`);
      }
      if (!exercise.answer || typeof exercise.answer !== 'string') {
        logError(file, `${prefix}: 'answer' must match the target ID of the threat`);
      } else {
        const found = exercise.threatData?.targets?.some(t => t.id === exercise.answer);
        if (!found) {
          logError(file, `${prefix}: Target answer ID '${exercise.answer}' not found in threatData.targets`);
        }
      }
      break;

    case 'command_complete':
      if (!exercise.prompt || typeof exercise.prompt !== 'string') {
        logError(file, `${prefix}: Missing 'prompt'`);
      }
      if (!exercise.targetCommand || typeof exercise.targetCommand !== 'string') {
        logError(file, `${prefix}: Missing 'targetCommand' string`);
      }
      if (!Array.isArray(exercise.wordBank) || exercise.wordBank.length < 2) {
        logError(file, `${prefix}: 'wordBank' must contain at least 2 tokens`);
      }
      if (!Array.isArray(exercise.answer) || exercise.answer.length === 0) {
        logError(file, `${prefix}: 'answer' must be an array of ordered command tokens`);
      }
      break;

    case 'info_card':
      if (!exercise.title || typeof exercise.title !== 'string') {
        logError(file, `${prefix}: 'info_card' requires a 'title'`);
      }
      if (!exercise.content || typeof exercise.content !== 'string') {
        logError(file, `${prefix}: 'info_card' requires 'content' text`);
      }
      break;

    default:
      logError(file, `${prefix}: Unrecognized type '${exercise.type}'`);
  }
}

function validateFile(filename) {
  const filePath = path.join(CONTENT_DIR, filename);
  console.log(`\n🔍 Validating ${filename}...`);

  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    logError(filename, `Failed to parse JSON: ${err.message}`);
    return;
  }

  // Track validation
  if (!data.trackId || typeof data.trackId !== 'string') {
    logError(filename, "Track missing valid 'trackId'");
  }
  if (!data.title || typeof data.title !== 'string') {
    logError(filename, "Track missing valid 'title'");
  }
  if (typeof data.version !== 'number') {
    logError(filename, "Track missing numeric 'version'");
  }
  if (!Array.isArray(data.units) || data.units.length === 0) {
    logError(filename, "Track must contain a non-empty 'units' array");
    return;
  }

  const unitIds = new Set();
  const lessonIds = new Set();
  const exerciseIds = new Set();

  for (const unit of data.units) {
    const unitPrefix = `Unit '${unit.unitId || 'UNKNOWN'}'`;

    if (!unit.unitId || typeof unit.unitId !== 'string') {
      logError(filename, `${unitPrefix}: Missing valid 'unitId'`);
    } else {
      if (unitIds.has(unit.unitId)) {
        logError(filename, `Duplicate unitId '${unit.unitId}'`);
      }
      unitIds.add(unit.unitId);
    }

    if (!unit.color || !HEX_COLOR_REGEX.test(unit.color)) {
      logError(filename, `${unitPrefix}: Invalid or missing hex color (e.g. '#58CC02')`);
    }

    if (!unit.guidebook || typeof unit.guidebook !== 'string' || unit.guidebook.length < 20) {
      logWarning(filename, `${unitPrefix}: 'guidebook' text is missing or shorter than 20 chars`);
    }

    if (!Array.isArray(unit.lessons) || unit.lessons.length === 0) {
      logError(filename, `${unitPrefix}: Must contain a non-empty 'lessons' array`);
      continue;
    }

    for (const lesson of unit.lessons) {
      const lessonPrefix = `${unitPrefix} -> Lesson '${lesson.lessonId || 'UNKNOWN'}'`;

      if (!lesson.lessonId || typeof lesson.lessonId !== 'string') {
        logError(filename, `${lessonPrefix}: Missing valid 'lessonId'`);
      } else {
        if (lessonIds.has(lesson.lessonId)) {
          logError(filename, `Duplicate lessonId '${lesson.lessonId}'`);
        }
        lessonIds.add(lesson.lessonId);
      }

      if (!lesson.title || typeof lesson.title !== 'string') {
        logError(filename, `${lessonPrefix}: Missing valid 'title'`);
      }

      if (!Array.isArray(lesson.exercises)) {
        logError(filename, `${lessonPrefix}: Missing 'exercises' array`);
        continue;
      }

      const exerciseCount = lesson.exercises.length;
      if (exerciseCount < 8 || exerciseCount > 15) {
        logError(
          filename,
          `${lessonPrefix}: Must have 8 to 15 exercises per lesson (Found: ${exerciseCount})`
        );
      }

      for (const exercise of lesson.exercises) {
        validateExercise(exercise, filename, lesson.lessonId, exerciseIds);
      }
    }
  }

  console.log(`  Units: ${unitIds.size} | Lessons: ${lessonIds.size} | Exercises: ${exerciseIds.size}`);
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.warn('⚠️ No content JSON files found in /content');
    process.exit(0);
  }

  console.log(`Found ${files.length} content file(s) to validate.`);
  for (const file of files) {
    validateFile(file);
  }

  console.log('\n----------------------------------------');
  if (totalErrors > 0) {
    console.error(`❌ Validation FAILED with ${totalErrors} error(s) and ${totalWarnings} warning(s).`);
    process.exit(1);
  } else {
    console.log(`✅ Validation PASSED! All content files match CyberLingo schema requirements (${totalWarnings} warnings).`);
    process.exit(0);
  }
}

main();
