const PrivacyPolicyPage = () => {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 text-gray-900">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p>
          <strong>Last updated:</strong> January 1, 2025
        </p>
        <p>
          Picodia (“we”, “our”, “the Service”) is a puzzle game platform that provides daily puzzles,
          user accounts, progress tracking, and gameplay analytics. This Privacy Policy explains how we
          collect, use, and protect your personal information.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">1.1 Account Information</h3>
          <p>When you sign in using Google OAuth or another provider, we may collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Your name</li>
            <li>Email address</li>
            <li>Profile image (when provided)</li>
            <li>Provider-specific identifiers</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">1.2 Gameplay Data</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Puzzle attempts</li>
            <li>Progress and completion history</li>
            <li>Statistics such as solve time and streaks</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">1.3 Technical Data</h3>
          <p>We may automatically log:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Device and browser type</li>
            <li>Approximate location (country/region)</li>
            <li>IP address</li>
            <li>Usage analytics</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>To provide gameplay features, such as saving puzzles</li>
          <li>To authenticate users and manage sessions</li>
          <li>To analyze game performance and improve the Service</li>
          <li>To prevent fraud and secure accounts</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">3. How We Store Your Data</h2>
        <p>
          Picodia uses <strong>Supabase</strong> to store user accounts, puzzle data, analytics, and related
          information. Supabase is a secure, fully managed Postgres database.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">4. Sharing of Information</h2>
        <p>We do not sell or rent your personal information.</p>
        <p>We may share limited data with:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Authentication providers</strong> (Google, etc.) for login
          </li>
          <li>
            <strong>Analytics or monitoring services</strong> to improve the Service
          </li>
          <li>Legal authorities if required by law</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">5. Cookies &amp; Local Storage</h2>
        <p>The Service may use cookies or local storage for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Session tracking</li>
          <li>Puzzle state</li>
          <li>Authentication tokens</li>
          <li>Analytics</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">6. Data Retention</h2>
        <p>We retain gameplay data and account information for as long as your profile is active. You may request deletion at any time.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">7. Your Rights</h2>
        <p>You may request:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access to your data</li>
          <li>Deletion of your account</li>
          <li>Correction of inaccurate information</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">8. Contact Us</h2>
        <p>
          If you have questions, contact us at:
          <br />
          <strong>support@picodia.com</strong>
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
