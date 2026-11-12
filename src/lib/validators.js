/**
 * Exercise Validators
 * Pure validation functions returning { correct: boolean, correctAnswer: string, explanation: string }
 * for all 10 CyberLingo exercise types.
 */

/**
 * Validates a multiple choice question.
 */
export function validateMultipleChoice(exercise, answer) {
  const correct = typeof answer === 'number' && answer === exercise.answer;
  const correctAnswer = exercise.options?.[exercise.answer] || '';
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates a multi-select question.
 */
export function validateMultiSelect(exercise, answer) {
  if (!Array.isArray(answer) || !Array.isArray(exercise.answer)) {
    return { correct: false, correctAnswer: '', explanation: exercise.explanation || '' };
  }

  const sortedUser = [...answer].sort((a, b) => a - b);
  const sortedExpected = [...exercise.answer].sort((a, b) => a - b);

  const correct =
    sortedUser.length === sortedExpected.length &&
    sortedUser.every((val, idx) => val === sortedExpected[idx]);

  const correctAnswer = exercise.answer
    .map((idx) => exercise.options?.[idx])
    .filter(Boolean)
    .join(', ');

  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates a true/false statement.
 */
export function validateTrueFalse(exercise, answer) {
  const correct = typeof answer === 'boolean' && answer === exercise.answer;
  const correctAnswer = exercise.answer ? 'True' : 'False';
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates a fill in the blank exercise.
 */
export function validateFillBlank(exercise, answer) {
  if (!Array.isArray(answer) || !Array.isArray(exercise.answer)) {
    return { correct: false, correctAnswer: '', explanation: exercise.explanation || '' };
  }

  const correct =
    answer.length === exercise.answer.length &&
    answer.every(
      (val, idx) =>
        String(val).trim().toLowerCase() === String(exercise.answer[idx]).trim().toLowerCase()
    );

  const correctAnswer = exercise.answer.join(', ');
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates match pairs exercise.
 * answer format: array of [left, right] tuples
 */
export function validateMatchPairs(exercise, answer) {
  if (!Array.isArray(answer) || !Array.isArray(exercise.pairs)) {
    return { correct: false, correctAnswer: '', explanation: exercise.explanation || '' };
  }

  // Map of expected pair relations
  const expectedMap = new Map();
  exercise.pairs.forEach(([left, right]) => {
    expectedMap.set(left, right);
  });

  const correct =
    answer.length === exercise.pairs.length &&
    answer.every(([left, right]) => expectedMap.get(left) === right);

  const correctAnswer = exercise.pairs
    .map(([l, r]) => `${l} → ${r}`)
    .join('; ');

  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates order steps exercise.
 * answer format: array of step strings in user-selected order
 */
export function validateOrderSteps(exercise, answer) {
  if (!Array.isArray(answer) || !Array.isArray(exercise.steps)) {
    return { correct: false, correctAnswer: '', explanation: exercise.explanation || '' };
  }

  const correct =
    answer.length === exercise.steps.length &&
    answer.every((val, idx) => val === exercise.steps[idx]);

  const correctAnswer = exercise.steps.join(' ➔ ');
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates scenario tactical decision exercise.
 */
export function validateScenario(exercise, answer) {
  const correct = typeof answer === 'number' && answer === exercise.answer;
  const correctAnswer = exercise.options?.[exercise.answer] || '';
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates spot the threat inspection exercise.
 */
export function validateSpotTheThreat(exercise, answer) {
  const correct = typeof answer === 'string' && answer === exercise.answer;
  const targetObj = exercise.threatData?.targets?.find((t) => t.id === exercise.answer);
  const correctAnswer = targetObj?.text || exercise.answer;
  return {
    correct,
    correctAnswer,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates terminal command completion exercise.
 */
export function validateCommandComplete(exercise, answer) {
  if (!Array.isArray(answer)) {
    return { correct: false, correctAnswer: '', explanation: exercise.explanation || '' };
  }

  const userCommand = answer.join(' ').trim();
  const expectedCommand = (exercise.targetCommand || exercise.answer?.join(' ') || '').trim();

  const correct = userCommand === expectedCommand;
  return {
    correct,
    correctAnswer: expectedCommand,
    explanation: exercise.explanation || ''
  };
}

/**
 * Validates info card (teaching card, always correct on acknowledgement).
 */
export function validateInfoCard(exercise) {
  return {
    correct: true,
    correctAnswer: '',
    explanation: exercise.keyTakeaway || ''
  };
}

/**
 * Master dispatcher validator by exercise.type
 */
export function validateExercise(exercise, answer) {
  if (!exercise || !exercise.type) {
    return { correct: false, correctAnswer: '', explanation: '' };
  }

  switch (exercise.type) {
    case 'multiple_choice':
      return validateMultipleChoice(exercise, answer);
    case 'multi_select':
      return validateMultiSelect(exercise, answer);
    case 'true_false':
      return validateTrueFalse(exercise, answer);
    case 'fill_blank':
      return validateFillBlank(exercise, answer);
    case 'match_pairs':
      return validateMatchPairs(exercise, answer);
    case 'order_steps':
      return validateOrderSteps(exercise, answer);
    case 'scenario':
      return validateScenario(exercise, answer);
    case 'spot_the_threat':
      return validateSpotTheThreat(exercise, answer);
    case 'command_complete':
      return validateCommandComplete(exercise, answer);
    case 'info_card':
      return validateInfoCard(exercise, answer);
    default:
      console.warn('Unknown exercise type:', exercise.type);
      return { correct: false, correctAnswer: '', explanation: '' };
  }
}
