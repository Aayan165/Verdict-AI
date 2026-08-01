import logo from '../assets/logo.png';

export default function AuthLayout({ title, description, children }) {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        {/* Left Side */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(78,34,15,0.12)] bg-primary p-8 text-[#F7F1DE] shadow-soft lg:p-12">
          {/* Background Effects */}
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <div className="absolute -right-14 top-8 h-44 w-44 rounded-full bg-[rgba(176,186,153,0.18)] blur-3xl" />

          <div className="relative flex h-full flex-col justify-center">
            {/* Logo + Title */}
            <div className="flex-col items-center gap-6 mb-2 justify-center ">
              <img
                src={logo}
                alt="Logo"
                className="h-28 w-28 lg:h-56 lg:w-56 logo-spin left-[30%] relative"
              />

              <div className="text-center">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl [word-spacing:12px]">
                  Verdict
                </h1>

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F7F1DE]/70">
                  AI
                </p>

              </div>
            </div>

            {/* Description */}
            <p className="mt-6 max-w-lg text-base leading-7 text-[#F7F1DE]/80 text-center tracking-wide [word-spacing:12px] mx-auto">
              Evaluate, compare, and govern LLM responses with one analytical
              workspace.
            </p>

            {/* Feature Cards */}
            <div className="mt-10 grid gap-4 sm:grid-rows-3">
              {[
                ['Scored', 'Three critics plus an adjudicator'],
                ['Tracked', 'Experiments, analytics, and comparisons'],
                ['Exported', 'CSV downloads for downstream review'],
              ].map(([label, text]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                >
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#F7F1DE]/75">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center rounded-[2rem] border border-[rgba(78,34,15,0.10)] bg-white/65 p-6 shadow-soft backdrop-blur-xl sm:p-8">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </div>
  );
}