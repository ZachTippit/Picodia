import { CSSProperties, useEffect, useState } from 'react';
import { useActiveSession } from '@hooks/useActiveSession';

type MutableCSSProperties = CSSProperties & Record<string, string | number>;

type CelebrationParticle = {
  id: string;
  style: MutableCSSProperties;
};

const CONFETTI_COLORS = ['#F87171', '#38BDF8', '#FBBF24', '#34D399', '#A78BFA', '#F97316'];

const createCelebrationParticles = (isWin: boolean): CelebrationParticle[] => {
  const count = isWin ? 45 : 30;

  return Array.from({ length: count }, (_, index) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 2200 + Math.random() * 1600;
    const drift = (Math.random() - 0.5) * 40;
    const rotation = 0.8 + Math.random() * 1.8;
    const scale = 0.9 + Math.random() * 0.6;

    const style: MutableCSSProperties = {
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}ms`,
    };

    style['--drift'] = `${drift}vw`;
    style['--scale'] = `${scale}`;

    if (isWin) {
      style.backgroundColor = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
      style['--rotation'] = `${rotation}`;
    } else {
      style.fontSize = `${1.1 + Math.random() * 0.7}rem`;
    }

    return {
      id: `${isWin ? 'win' : 'lose'}-${index}-${Math.random().toString(16).slice(2, 6)}`,
      style,
    };
  });
};

const AREA_GROW_DELAY_MS = 450;
const RESULTS_SHOW_DELAY_MS = 750;
const CELEBRATION_START_DELAY_MS = 450;
const CELEBRATION_DURATION_MS = 4200;

const Confetti = ({ setIsAreaExpanded, setShouldShowSummary }: { setIsAreaExpanded: (expanded: boolean) => void; setShouldShowSummary: (show: boolean) => void; }) => {

  const [showCelebration, setShowCelebration] = useState(false);
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);

  const { data: activeSession } = useActiveSession();

  useEffect(() => {
    let areaTimer: number | null = null;
    let summaryTimer: number | null = null;
    let celebrationStartTimer: number | null = null;
    let celebrationEndTimer: number | null = null;

    if (activeSession?.puzzle_attempts?.status === 'completed') {
      setIsAreaExpanded(false);
      setShouldShowSummary(false);
      setShowCelebration(false);

      // TODO: determine win/loss based on attempt metadata
      setParticles(createCelebrationParticles(true));

      areaTimer = window.setTimeout(() => {
        setIsAreaExpanded(true);
      }, AREA_GROW_DELAY_MS);

      summaryTimer = window.setTimeout(() => {
        setShouldShowSummary(true);
      }, RESULTS_SHOW_DELAY_MS);

      celebrationStartTimer = window.setTimeout(() => {
        setShowCelebration(true);
      }, CELEBRATION_START_DELAY_MS);

      celebrationEndTimer = window.setTimeout(() => {
        setShowCelebration(false);
        setParticles([]);
      }, CELEBRATION_START_DELAY_MS + CELEBRATION_DURATION_MS);
    } else {
      setIsAreaExpanded(false);
      setShouldShowSummary(false);
      setShowCelebration(false);
      setParticles([]);
    }

    return () => {
      if (areaTimer) {
        window.clearTimeout(areaTimer);
      }
      if (summaryTimer) {
        window.clearTimeout(summaryTimer);
      }
      if (celebrationStartTimer) {
        window.clearTimeout(celebrationStartTimer);
      }
      if (celebrationEndTimer) {
        window.clearTimeout(celebrationEndTimer);
      }
    };
  }, []);

  const celebrationClass = true ? 'confetti-piece' : 'smiley-piece';

  if (!showCelebration) {
    return null;
  }

  return (
    <div className="celebration-overlay" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={celebrationClass}
          aria-hidden="true"
          style={particle.style}
        >
          {true ? '' : ':('}
        </span>
      ))}
    </div>
  );
};

export default Confetti;
