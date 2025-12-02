import React from "react";

const TermsAndPrivacyPolicy = () => {
  return (
    <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-500">
      <p className="mt-4 text-center text-xs text-gray-500">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline hover:text-gray-700">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default TermsAndPrivacyPolicy;
