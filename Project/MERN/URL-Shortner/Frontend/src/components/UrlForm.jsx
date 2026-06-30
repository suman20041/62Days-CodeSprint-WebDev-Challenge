import { useState } from "react";
import api from "../services/api";

const UrlForm = ({ setLastUrl, setLoading, loading, setError }) => {

  const [inputVal, setInputVal] = useState("");

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();

    if (!inputVal) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(inputVal)) {
      setError("Invalid URL format (include http/https)");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await api.post("/short", {
        originalUrl: inputVal
      });

      setLastUrl(res.data.shortenUrl);
      setInputVal("");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 mt-6 flex justify-center">
      <form
        onSubmit={formHandler}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-3 rounded-2xl shadow-xl"
      >

        <input
          type="text"
          placeholder="Paste your long URL here..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-transparent text-white placeholder-gray-400 outline-none"
        />

        <button disabled={loading}
          className="px-6 py-3 cursor-pointer rounded-xl font-semibold text-white bg-linear-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-lg shadow-violet-500/20 transition-all"
        >
          {loading ? "..." : "Shorten"}
        </button>

      </form>
    </div>
  );
};

export default UrlForm;