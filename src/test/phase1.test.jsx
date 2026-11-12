import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { computeLazyHearts, useUserStore } from '../store/userStore.js';
import Welcome from '../routes/Welcome.jsx';
import Onboarding from '../routes/Onboarding.jsx';
import Learn from '../routes/Learn.jsx';

function renderWithClient(ui) {
  const testClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } }
  });
  return render(<QueryClientProvider client={testClient}>{ui}</QueryClientProvider>);
}

describe('Phase 1 - Gamification & Lazy Hearts Computation', () => {
  it('correctly reports full hearts when stored is 5', () => {
    const { currentHearts, nextHeartAt } = computeLazyHearts(5, Date.now());
    expect(currentHearts).toBe(5);
    expect(nextHeartAt).toBeNull();
  });

  it('regenerates 1 heart after 4 hours (4 * 3600 * 1000 ms)', () => {
    const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000 + 1000);
    const { currentHearts } = computeLazyHearts(3, fourHoursAgo);
    expect(currentHearts).toBe(4);
  });

  it('caps at maximum 5 hearts even after 48 hours', () => {
    const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
    const { currentHearts, nextHeartAt } = computeLazyHearts(1, twoDaysAgo);
    expect(currentHearts).toBe(5);
    expect(nextHeartAt).toBeNull();
  });
});

describe('Phase 1 - User Store Operations', () => {
  beforeEach(() => {
    useUserStore.getState().resetUserSession();
  });

  it('sets onboarding data properly', () => {
    useUserStore.getState().setOnboardingData({
      goal: 'career',
      level: 3,
      dailyGoalXp: 50
    });

    const state = useUserStore.getState();
    expect(state.goal).toBe('career');
    expect(state.level).toBe(3);
    expect(state.dailyGoalXp).toBe(50);
    expect(state.isOnboarded).toBe(true);
  });

  it('deducts hearts and spends gems properly', () => {
    const store = useUserStore.getState();
    expect(store.hearts).toBe(5);

    store.deductHeart();
    expect(useUserStore.getState().hearts).toBe(4);

    // Spend gems
    const spentSuccess = useUserStore.getState().spendGems(50);
    expect(spentSuccess).toBe(true);
    expect(useUserStore.getState().gems).toBe(100);

    // Cannot spend more than balance
    const overspend = useUserStore.getState().spendGems(999);
    expect(overspend).toBe(false);
    expect(useUserStore.getState().gems).toBe(100);
  });

  it('marks lessons as completed', () => {
    const store = useUserStore.getState();
    store.markLessonCompleted('u1-l1', 'u1-l2');

    const state = useUserStore.getState();
    expect(state.completedLessons).toContain('u1-l1');
    expect(state.currentLessonId).toBe('u1-l2');
  });
});

describe('Phase 1 - UI Routes & Flow', () => {
  it('renders Welcome view with Shieldy and CTA buttons', () => {
    render(
      <Welcome
        onGetStarted={() => {}}
        onLoginSuccess={() => {}}
      />
    );

    expect(screen.getByText(/Learn cybersecurity in 5 minutes a day/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /I Already Have an Account/i })).toBeInTheDocument();
  });

  it('renders Onboarding step 1 goals and handles next step', () => {
    render(
      <Onboarding
        onComplete={() => {}}
        onBackToWelcome={() => {}}
      />
    );

    expect(screen.getByText(/Why do you want to learn cybersecurity\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Protect myself and my family/i)).toBeInTheDocument();
    expect(screen.getByText(/Start a career in security/i)).toBeInTheDocument();

    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueBtn);

    // Moves to step 2: Experience level
    expect(screen.getByText(/How much do you know about cybersecurity\?/i)).toBeInTheDocument();
  });

  it('renders Learn winding path with unit headers and lesson nodes', () => {
    renderWithClient(
      <Learn onStartLesson={() => {}} />
    );

    // Unit 1 & Unit 2 titles exist
    expect(screen.getAllByText(/The CIA Triad & Core Defense/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Threat Landscape & Active Defense/i).length).toBeGreaterThan(0);

    // First lesson node exists
    expect(screen.getByRole('button', { name: /What is Confidentiality\?/i })).toBeInTheDocument();
  });
});
