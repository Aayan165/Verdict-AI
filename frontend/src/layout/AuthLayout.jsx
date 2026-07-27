export default function AuthLayout({ title, description, children }) {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(78,34,15,0.12)] bg-primary p-8 text-[#F7F1DE] shadow-soft lg:p-12">
          <div className="absolute inset-0 noise-overlay opacity-20" />
          <div className="absolute -right-14 top-8 h-44 w-44 rounded-full bg-[rgba(176,186,153,0.18)] blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="brand-orb flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F1DE] text-primary shadow-soft">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F7F1DE]/70">LLM</p>
                  <p className="text-lg font-semibold">Arbitrator System</p>
                </div>
              </div>

              <p className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Evaluate, compare, and govern LLM responses with one analytical workspace.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#F7F1DE]/82">
                Accuracy, logic, and completeness critics feed a LangGraph adjudicator so every response is scored,
                explained, and ready for experimentation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Scored', 'Three critics plus an adjudicator'],
                ['Tracked', 'Experiments, analytics, and comparisons'],
                ['Exported', 'CSV downloads for downstream review'],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#F7F1DE]/78">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[2rem] border border-[rgba(78,34,15,0.10)] bg-white/65 p-6 shadow-soft backdrop-blur-xl sm:p-8">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}