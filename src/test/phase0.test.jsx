import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Mascot from '../components/ui/Mascot.jsx';
import trackData from '../../content/security-fundamentals.json';

describe('Phase 0 Verification Tests', () => {
  it('renders the Shieldy Mascot component with proper accessible role', () => {
    render(<Mascot state="happy" size={120} />);
    const mascot = screen.getByRole('img', { name: /CyberLingo Mascot Shieldy \(happy\)/i });
    expect(mascot).toBeInTheDocument();
  });

  it('validates security-fundamentals content schema structure', () => {
    expect(trackData.trackId).toBe('security-fundamentals');
    expect(trackData.units.length).toBe(2);

    for (const unit of trackData.units) {
      expect(unit.lessons.length).toBe(3);
      for (const lesson of unit.lessons) {
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(8);
        expect(lesson.exercises.length).toBeLessThanOrEqual(15);
      }
    }
  });

  it('verifies all 10 exercise types exist in the sample track', () => {
    const allTypes = new Set();
    trackData.units.forEach(unit => {
      unit.lessons.forEach(lesson => {
        lesson.exercises.forEach(ex => allTypes.add(ex.type));
      });
    });

    const expectedTypes = [
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

    expectedTypes.forEach(type => {
      expect(allTypes.has(type)).toBe(true);
    });
  });
});
