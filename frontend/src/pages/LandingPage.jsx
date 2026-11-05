import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  FileDown,
  GitCompareArrows,
  History,
  Scale,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../assets/logo.png';

const critics = [
  {
    name: 'Accuracy critic',
    description: 'Finds factual errors and unsupported claims.',
    score: '94',
    icon: CheckCircle2,
  },
  {
    name: 'Logic critic',
    description: 'Detects contradictions and flawed reasoning.',
    score: '89',
    icon: Scale,
  },
  {
    name: 'Completeness critic',
    description: 'Identifies missing information and gaps.',
    score: '92',
    icon: ClipboardCheck,
  },
];

const features = [
  { title: 'Multi-critic evaluation', text: 'A balanced view of every response, not a single opinion.', icon: GitCompareArrows },
  { title: 'Model comparison', text: 'See which models hold up best against the same prompt.', icon: BarChart3 },
  { title: 'Experiment tracking', text: 'Keep runs organized and make progress measurable.', icon: History },
  { title: 'Exportable insights', text: 'Take clean, decision-ready results with you as CSV.', icon: FileDown },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="Verdict AI home">
          <img src={logo} alt="Verdict AI logo" className="h-11 w-11 object-contain" />
          <div className="leading-none">
            <p className="text-lg font-bold tracking-[-0.04em] text-ink">Verdict</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">AI</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-primary">How it works</a>
          <a href="#features" className="transition-colors hover:text-primary">Features</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button as={Link} variant="ghost" size="sm" to="/login">Log in</Button>
          <Button as={Link} variant="primary" size="sm" to="/register">Get started <ArrowRight className="h-3.5 w-3.5" /></Button>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#b0ba99]/25 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-[#d8cdaf]/40 blur-3xl" />

          <div className="page-enter relative">
            <div className="mb-9 flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-[rgba(78,34,15,0.12)] bg-white/70 p-3 shadow-subtle sm:h-28 sm:w-28">
                <img src={logo} alt="" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-[-0.05em] text-ink sm:text-3xl">Verdict</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.38em] text-muted">AI evaluation, clarified</p>
              </div>
            </div>

            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-4 w-4" /> Evidence before intuition
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-0.065em] text-ink sm:text-6xl lg:text-[4.65rem]">
              Evaluate AI responses. <span className="text-primary">Trust better decisions.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              An intelligent evaluation platform that analyzes AI-generated responses through accuracy, logic, and completeness critics — delivering reliable, evidence-based verdicts.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button as={Link} variant="primary" size="lg" to="/evaluate">
                Start Evaluating <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} variant="secondary" size="lg" to="/dashboard">
                Explore Dashboard
              </Button>
            </div>
            <a href="#how-it-works" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-primary">
              See how it works <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="page-enter relative [animation-delay:120ms]">
            <div className="absolute -inset-6 rounded-[3rem] bg-[#b0ba99]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(78,34,15,0.14)] bg-[#fffdf7]/80 p-5 shadow-soft backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Live evaluation</p>
                  <p className="mt-1 text-sm font-semibold text-ink">Response adjudication</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-[#edf0e3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f6a38]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4f6a38]" /> In progress
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-[#f7f1de]/55 p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  <span>Model response</span><span>GPT-4o</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink">
                  “A strong answer should be accurate, well-reasoned, and complete enough to support the reader’s next decision.”
                </p>
              </div>

              <div className="relative mt-5 space-y-3">
                <div className="absolute bottom-8 left-5 top-8 w-px bg-border" />
                {critics.map(({ name, description, score, icon: Icon }, index) => (
                  <div key={name} className="relative flex items-center gap-3 rounded-2xl border border-border bg-white/75 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-subtle">
                    <div className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f1de] text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-ink">{name}</p>
                      <p className="mt-1 text-[11px] leading-4 text-muted">{description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold tracking-tight text-primary">{score}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">/ 100</p>
                    </div>
                    {index < critics.length - 1 && <CircleDot className="absolute -bottom-5 left-[13px] z-[2] h-2.5 w-2.5 fill-[#d8cdaf] text-[#d8cdaf]" />}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-primary p-4 text-[#f7f1de] shadow-subtle">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7f1de]/60">Adjudicated verdict</p>
                  <p className="mt-1 text-sm font-semibold">Reliable and decision-ready</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f7f1de]/25 text-lg font-bold">92</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-border/70 bg-white/30">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">A clearer path to confidence</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">How it works</h2>
              <p className="mt-4 text-base leading-7 text-muted">One workflow turns an ambiguous model output into a decision you can explain.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                ['01', 'Submit the context', 'Add a prompt, response, and model name so every evaluation has the right context.'],
                ['02', 'Let critics investigate', 'Three specialized critics independently examine accuracy, logic, and completeness.'],
                ['03', 'Review the verdict', 'An adjudicator combines the findings into a clear, evidence-based final result.'],
              ].map(([number, title, text], index) => (
                <div key={number} className="relative border-t border-primary/25 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-primary">{number}</span>
                    {index < 2 && <ChevronRight className="hidden h-4 w-4 text-border md:block" />}
                  </div>
                  <h3 className="mt-7 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Built for better judgment</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">The detail behind every verdict.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">From the first evaluation to long-running experiments, Verdict keeps your signals useful and your decisions grounded.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-white/55 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-subtle">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0ead8] text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-6 text-sm font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-5 mb-8 overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-[#f7f1de] shadow-soft sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-7xl lg:px-16 lg:py-16">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f7f1de]/55">Start with one response</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Make your next AI decision a confident one.</h2>
            </div>
            <Button as={Link} variant="secondary" size="lg" to="/evaluate" className="shrink-0 border-white/10 bg-[#f7f1de] hover:bg-white">
              Start Evaluating <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 pb-8 pt-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="flex items-center gap-2"><img src={logo} alt="" className="h-5 w-5" /> <span>Verdict AI</span></div>
        <p>Evaluate with clarity. Decide with confidence.</p>
      </footer>
    </div>
  );
}
