import InfoPageLayout from "./InfoPageLayout";

const AboutPage = () => {
  return (
    <InfoPageLayout>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900 font-display">
          About Picodia
        </h1>
        <p className="text-gray-700">
          Picodia is a daily puzzle platform inspired by classic Nikoli-style
          logic puzzles. It&apos;s a small, focused place to take a quick
          break, flex your brain, and uncover a hidden picture one tile at a
          time.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">What to Expect</h2>
        <p className="text-gray-700">
          Every day, you get a fresh 7×7 nonogram-style puzzle to solve. Use
          the number clues on the rows and columns to figure out which tiles
          to fill and which to leave blank. You have limited lives, so wrong
          guesses matter—solve carefully, not just quickly.
        </p>
        <p className="text-gray-700">
          Picodia is designed to feel light and approachable: one satisfying
          puzzle a day, a clear visual style, and no noisy distractions. Play
          for a few focused minutes, keep your streak going, and come back
          tomorrow for whatever the next grid hides.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Behind the Puzzles</h2>
        <p className="text-gray-700">
          Picodia is created and maintained by an independent developer who
          loves logic puzzles, pixel art, and small daily rituals. The game
          takes inspiration from classic pen-and-paper puzzles, but all of the
          implementation and puzzle content are original to this project.
        </p>
        <p className="text-gray-700">
          The goal is simple: build a thoughtful little corner of the internet
          where puzzles are fair, readable, and respectful of your time.
          Over time, Picodia will grow to include more puzzle types, richer
          stats and streaks, and extra challenges for people who want to go
          deeper.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Stay Connected</h2>
        <p className="text-gray-700">
          Found a bug, have feedback, or want to suggest a puzzle idea?
          You can reach out any time at{" "}
          <a
            href="mailto:support@picodia.com"
            className="font-medium text-blue-600 hover:underline"
          >
            support@picodia.com
          </a>
          .
        </p>
        <p className="text-gray-700">
          As Picodia grows, this page will be updated with more ways to follow
          updates, explore new puzzle modes, and see what&apos;s coming next.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default AboutPage;
