const Features = () => {

  const features = [
    {
      title: "Instant URL Shortening",
      desc: "Convert long URLs into short links instantly."
    },
    {
      title: "Fast Redirection",
      desc: "Users are redirected to the original page in milliseconds."
    },
    {
      title: "Clean Links",
      desc: "Share simple and readable short links."
    },
    {
      title: "Responsive Design",
      desc: "Works perfectly on desktop, tablet and mobile."
    }
  ];

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Features
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-300"
          >
            <h3 className="text-lg text-white mb-2 font-semibold">
              {feature.title}
            </h3>

            <p className="text-slate-400 text-sm">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;