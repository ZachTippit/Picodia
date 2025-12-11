import InfoPageLayout from "./InfoPageLayout";

const TermsPage = () => {
  return (
    <InfoPageLayout>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
        <p>
          <strong>Last updated:</strong> January 1, 2025
        </p>
        <p>
          By accessing or using Picodia (“the Service”), you agree to the following Terms of Service. If you do not
          agree, you may not use the Service.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">1. Use of the Service</h2>
        <p>
          Picodia is a puzzle platform for entertainment purposes. You agree to use the Service responsibly and in
          compliance with applicable laws.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">2. Accounts</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>You must provide accurate information when signing in.</li>
          <li>You are responsible for any activity under your account.</li>
          <li>We may suspend accounts that engage in abuse or fraud.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">3. Ownership &amp; Content</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>All puzzle content, UI, and assets remain property of Picodia.</li>
          <li>You may not copy, redistribute, or modify game data without permission.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">4. Gameplay Data</h2>
        <p>Your puzzle attempts, progress, and statistics may be stored to enable gameplay features, leaderboards, or future improvements.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">5. Prohibited Behavior</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Attempting to cheat or manipulate puzzle data</li>
          <li>Reverse engineering or exploiting system logic</li>
          <li>Performing automated actions without authorization</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">6. Service Availability</h2>
        <p>We do not guarantee uninterrupted uptime. We may modify or discontinue parts of the Service at any time.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">7. Disclaimer</h2>
        <p>The Service is provided “as is,” without warranties of any kind.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Picodia is not liable for any damages arising from your use of the Service.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
        <p>We may update these Terms occasionally. Continued use of the Service constitutes acceptance of the revised Terms.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">10. Contact</h2>
        <p>
          For questions or concerns, contact:
          <br />
          <strong>support@picodia.com</strong>
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default TermsPage;
