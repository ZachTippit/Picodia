import LoginEmailPass from "./LoginEmailPass";
import LoginGoogle from "./LoginGoogle";
import LoginApple from "./LoginApple";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import TermsAndPrivacyPolicy from "./TermsAndPrivacyPolicy";

const LoginOverlay = () => {
  const { showLogin, closeLogin } = useUI();

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-opacity duration-300",
        showLogin ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 flex justify-center bg-gray-900/70 px-4 transition-transform duration-500 ease-out",
          showLogin ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mt-16 flex w-full max-w-md flex-col bg-white text-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold uppercase tracking-wide">Picodia</h2>
            <button
              type="button"
              onClick={closeLogin}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <div className="px-6 pt-8 pb-6">
            <h3 className="mb-6 text-center text-xl font-semibold">Log in or create an account</h3>

            <LoginEmailPass />

            <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
              <span className="h-px flex-1 bg-gray-300" />
              <span>or</span>
              <span className="h-px flex-1 bg-gray-300" />
            </div>

            <div className="mt-6 space-y-3 text-xs text-gray-500">
              <LoginGoogle />
              <LoginApple />
            </div>
          </div>

          <TermsAndPrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;
