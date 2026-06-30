import { useState } from "react";
import Hero from "../components/Hero";
import UrlForm from "../components/UrlForm";
import ResultCard from "../components/ResultCard";
import Features from "../components/Features";

const Home = () => {

  const [lastUrl, setLastUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen text-white bg-linear-to-br from-[#0B0F19] via-[#0F172A] to-[#020617]">

      <Hero />

      <UrlForm setLastUrl={setLastUrl} setLoading={setLoading} loading={loading} setError={setError} />

      <ResultCard lastUrl={lastUrl} loading={loading} error={error} />

      <Features />

    </div>
  );
};

export default Home;