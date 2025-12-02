import { FormEvent, useState } from "react";
import { cn } from "@utils/cn";
import useGoogleSignIn from "@/hooks/auth/useGoogleSignIn";
import useAppleSignIn from "@/hooks/auth/useAppleSignIn";
import useEmailPasswordSignIn from "@/hooks/auth/useEmailPasswordSignIn";
import { useUI } from "@/providers/UIProvider";

const LoginEmailPass = () => {
  const { mutateAsync: signInWithEmail, isPending: isEmailSignInLoading } =
    useEmailPasswordSignIn();
  const { isPending: isGoogleLoading } = useGoogleSignIn();
  const { isPending: isAppleLoading } = useAppleSignIn();
  const { closeLogin } = useUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    try {
      await signInWithEmail({
        email,
        password,
      });
      setSuccess("Signed in successfully.");
      setTimeout(() => {
        closeLogin();
        setSuccess(null);
      }, 600);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    }
  }

  const isAnyLoading = isGoogleLoading || isAppleLoading || isEmailSignInLoading;

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
        <span>Email address</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isAnyLoading}
          className="rounded border border-gray-400 px-3 py-2 text-base text-gray-900 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isAnyLoading}
          className="rounded border border-gray-400 px-3 py-2 text-base text-gray-900 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
      <button
        type="submit"
        disabled={isAnyLoading}
        className={cn(
          "mt-2 w-full rounded-sm bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition",
          isAnyLoading ? "opacity-70" : "hover:bg-black"
        )}
      >
        {isEmailSignInLoading ? "Signing in…" : "Continue"}
      </button>
    </form>
  );
};

export default LoginEmailPass;
