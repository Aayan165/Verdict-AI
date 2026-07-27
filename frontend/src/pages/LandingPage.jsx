import { ArrowRight, BadgeCheck, Brain, ClipboardList, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const highlights = [
  { title: 'Accuracy critics', text: 'Measure factual alignment and identify unsupported claims.', icon: BadgeCheck },
  { title: 'Logic critics', text: 'Surface contradictions, invalid reasoning, and weak conclusions.', icon: Brain },
  { title: 'Completeness critics', text: 'Detect missing context and underdeveloped answers.', icon: ClipboardList },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between rounded-full border border-border bg-white/65 px-5 py-4 shadow-soft backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="brand-orb flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-[#F7F1DE] shadow-soft">
              <div className="h-4 w-4 rounded-full bg-[#F7F1DE]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">LLM Arbitrator</p>
              <p className="text-xs text-muted">Quality control for generated responses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button as={Link} variant="ghost" size="sm" to="/login">
              Login
            </Button>
            <Button as={Link} variant="primary" size="sm" to="/register">
              Create account
            </Button>
          </div>
        </header>

        <main className="page-enter mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted shadow-soft">
              <Sparkles className="h-4 w-4 text-primary" />
              Production-grade evaluation dashboard
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl">
              Score LLM outputs with a modern adjudication workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Evaluate a prompt, response, and model name against accuracy, logic, and completeness critics. Track
              experiments, compare models, export CSVs, and review every decision in one clean dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} variant="primary" size="lg" to="/evaluate">
                Start evaluating
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} variant="secondary" size="lg" to="/dashboard">
                Open dashboard
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Real scores', 'Accuracy, logic, completeness, and overall'],
                ['Operational analytics', 'Verdict distributions and trend charts'],
                ['Experiment tracking', 'Compare model runs and export CSVs'],
              ].map(([title, text]) => (
                <Card key={title} className="bg-white/75">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="animate-fadeUp">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(78,34,15,0.08)] text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-ink">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card className="overflow-hidden bg-primary text-[#F7F1DE]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F7F1DE]/65">What is included</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {['Authentication', 'Dashboard', 'Evaluate', 'Evaluations', 'Analytics', 'Model Comparison', 'Experiments', 'Profile'].map(
                  (item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-sm">
                      {item}
                    </div>
                  ),
                )}
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}