import { describe, it, expect } from 'vitest';
import {
  validateMultipleChoice,
  validateMultiSelect,
  validateTrueFalse,
  validateFillBlank,
  validateMatchPairs,
  validateOrderSteps,
  validateScenario,
  validateSpotTheThreat,
  validateCommandComplete,
  validateInfoCard,
  validateExercise
} from '../lib/validators.js';

describe('Exercise Validators Unit Tests', () => {
  describe('Multiple Choice', () => {
    const exercise = {
      type: 'multiple_choice',
      prompt: 'What does CIA stand for in security?',
      options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Common Internet Access'],
      answer: 1,
      explanation: 'CIA stands for Confidentiality, Integrity, and Availability.'
    };

    it('returns correct when the selected index matches', () => {
      const res = validateMultipleChoice(exercise, 1);
      expect(res.correct).toBe(true);
      expect(res.correctAnswer).toBe('Confidentiality, Integrity, Availability');
      expect(res.explanation).toBe(exercise.explanation);
    });

    it('returns false when an incorrect index is chosen', () => {
      const res = validateMultipleChoice(exercise, 0);
      expect(res.correct).toBe(false);
      expect(res.correctAnswer).toBe('Confidentiality, Integrity, Availability');
    });

    it('handles null/undefined answer gracefully', () => {
      const res = validateMultipleChoice(exercise, null);
      expect(res.correct).toBe(false);
    });
  });

  describe('Multi Select', () => {
    const exercise = {
      type: 'multi_select',
      prompt: 'Select all authentication factors',
      options: ['Password', 'Fingerprint', 'Wallpaper color', 'SMS Token'],
      answer: [0, 1, 3],
      explanation: 'Something you know, have, or are.'
    };

    it('returns correct when all correct indices are selected, regardless of order', () => {
      const res = validateMultiSelect(exercise, [3, 0, 1]);
      expect(res.correct).toBe(true);
      expect(res.correctAnswer).toBe('Password, Fingerprint, SMS Token');
    });

    it('returns false when an option is missing or extra option selected', () => {
      expect(validateMultiSelect(exercise, [0, 1]).correct).toBe(false);
      expect(validateMultiSelect(exercise, [0, 1, 2, 3]).correct).toBe(false);
      expect(validateMultiSelect(exercise, null).correct).toBe(false);
    });
  });

  describe('True / False', () => {
    const exercise = {
      type: 'true_false',
      prompt: 'HTTPS guarantees that a website is completely trustworthy and safe.',
      answer: false,
      explanation: 'HTTPS only encrypts transit.'
    };

    it('validates correct boolean value', () => {
      expect(validateTrueFalse(exercise, false).correct).toBe(true);
      expect(validateTrueFalse(exercise, false).correctAnswer).toBe('False');
      expect(validateTrueFalse(exercise, true).correct).toBe(false);
    });
  });

  describe('Fill In The Blank', () => {
    const exercise = {
      type: 'fill_blank',
      prompt: 'The CIA triad consists of Confidentiality, ___, and Availability.',
      answer: ['Integrity'],
      explanation: 'Integrity ensures data is accurate and untampered.'
    };

    it('validates blank matches case-insensitively', () => {
      expect(validateFillBlank(exercise, ['integrity']).correct).toBe(true);
      expect(validateFillBlank(exercise, ['Integrity']).correct).toBe(true);
      expect(validateFillBlank(exercise, ['Authentication']).correct).toBe(false);
    });

    it('handles invalid inputs', () => {
      expect(validateFillBlank(exercise, null).correct).toBe(false);
    });
  });

  describe('Match Pairs', () => {
    const exercise = {
      type: 'match_pairs',
      prompt: 'Match each term to its definition',
      pairs: [
        ['Phishing', 'Deceptive emails'],
        ['Ransomware', 'File extortion malware'],
        ['DDoS', 'Traffic flood attack']
      ],
      explanation: 'Core security definitions.'
    };

    it('returns correct when all pairs match accurately', () => {
      const answer = [
        ['Phishing', 'Deceptive emails'],
        ['DDoS', 'Traffic flood attack'],
        ['Ransomware', 'File extortion malware']
      ];
      expect(validateMatchPairs(exercise, answer).correct).toBe(true);
    });

    it('returns false if any pair is mismatched', () => {
      const wrong = [
        ['Phishing', 'Traffic flood attack'],
        ['DDoS', 'Deceptive emails'],
        ['Ransomware', 'File extortion malware']
      ];
      expect(validateMatchPairs(exercise, wrong).correct).toBe(false);
      expect(validateMatchPairs(exercise, []).correct).toBe(false);
    });
  });

  describe('Order Steps', () => {
    const exercise = {
      type: 'order_steps',
      prompt: 'Order the incident response lifecycle steps',
      steps: ['Preparation', 'Detection & Analysis', 'Containment', 'Post-Incident Activity'],
      explanation: 'NIST SP 800-61 lifecycle.'
    };

    it('returns correct when order is exact', () => {
      const answer = ['Preparation', 'Detection & Analysis', 'Containment', 'Post-Incident Activity'];
      expect(validateOrderSteps(exercise, answer).correct).toBe(true);
    });

    it('returns false when steps are out of order', () => {
      const wrong = ['Detection & Analysis', 'Preparation', 'Containment', 'Post-Incident Activity'];
      expect(validateOrderSteps(exercise, wrong).correct).toBe(false);
    });
  });

  describe('Scenario', () => {
    const exercise = {
      type: 'scenario',
      situation: 'You receive an urgent wire request from your CEO via an unfamiliar Gmail address.',
      question: 'What is the most secure immediate action?',
      options: ['Execute wire transfer immediately', 'Verify via known internal phone channel', 'Reply to email asking if real'],
      answer: 1,
      explanation: 'Out-of-band verification prevents Business Email Compromise (BEC).'
    };

    it('validates correct decision option', () => {
      expect(validateScenario(exercise, 1).correct).toBe(true);
      expect(validateScenario(exercise, 0).correct).toBe(false);
    });
  });

  describe('Spot The Threat', () => {
    const exercise = {
      type: 'spot_the_threat',
      prompt: 'Inspect this email and select the suspicious element',
      threatData: {
        targets: [
          { id: 't1', text: 'Sender: support@paypa1-security.com' },
          { id: 't2', text: 'Subject: Account suspended' },
          { id: 't3', text: 'Date: Today' }
        ]
      },
      answer: 't1',
      explanation: 'Look for typosquatting domains (paypa1 instead of paypal).'
    };

    it('validates selected threat target ID', () => {
      expect(validateSpotTheThreat(exercise, 't1').correct).toBe(true);
      expect(validateSpotTheThreat(exercise, 't2').correct).toBe(false);
    });
  });

  describe('Command Complete', () => {
    const exercise = {
      type: 'command_complete',
      prompt: 'Generate an RSA 4096-bit key pair',
      targetCommand: 'ssh-keygen -t rsa -b 4096',
      explanation: 'ssh-keygen generates cryptographic keys.'
    };

    it('validates tokens assemble into exact target command', () => {
      expect(validateCommandComplete(exercise, ['ssh-keygen', '-t', 'rsa', '-b', '4096']).correct).toBe(true);
      expect(validateCommandComplete(exercise, ['ssh-keygen', '-b', '4096']).correct).toBe(false);
    });
  });

  describe('Info Card', () => {
    const exercise = {
      type: 'info_card',
      title: 'Defense in Depth',
      keyTakeaway: 'Layered defenses provide redundancy.'
    };

    it('always validates as correct upon reading/acknowledging', () => {
      expect(validateInfoCard(exercise).correct).toBe(true);
    });
  });

  describe('Master Dispatcher (validateExercise)', () => {
    it('dispatches properly to the right validator by exercise.type', () => {
      const mc = { type: 'multiple_choice', answer: 0, options: ['A', 'B'] };
      expect(validateExercise(mc, 0).correct).toBe(true);
      expect(validateExercise(mc, 1).correct).toBe(false);

      const unknown = { type: 'mystery_hack' };
      expect(validateExercise(unknown, null).correct).toBe(false);
      expect(validateExercise(null, null).correct).toBe(false);
    });
  });
});

