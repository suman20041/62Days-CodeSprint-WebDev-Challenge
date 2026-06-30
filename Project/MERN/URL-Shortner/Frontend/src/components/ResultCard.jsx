import { useState } from "react";

const BACKEND_URL = "https://trimly-back.vercel.app/api";

const ResultCard = ({ lastUrl, loading, error }) => {

  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="w-full px-4 mt-10 flex justify-center">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl w-full max-w-2xl flex justify-center items-center shadow-xl">
          <div className="w-12 h-12 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 mt-10 flex justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl w-full max-w-2xl text-center backdrop-blur-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!lastUrl) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(`${BACKEND_URL}/${lastUrl}`);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full px-4 mt-10 flex justify-center">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl w-full max-w-2xl shadow-xl">

        <p className="text-slate-400 mb-3 text-sm">
          Your Short Link
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <a
            href={`${BACKEND_URL}/${lastUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline break-all flex-1"
          >
            trimly/{lastUrl}
          </a>

          <button
            onClick={copyLink}
            className={`px-4 cursor-pointer py-2 rounded-xl text-sm font-medium transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-linear-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-500/20"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ResultCard;