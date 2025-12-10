import React from "react";
import { Link } from "@tanstack/react-router";

const TermsAndPrivacyPolicy = () => {
  return (
    <div className="border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-500">
      <p className="mt-4 text-center text-xs text-gray-500">
        By continuing, you agree to our{" "}
        <Link to="/terms" className="underline hover:text-gray-700">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default TermsAndPrivacyPolicy;
