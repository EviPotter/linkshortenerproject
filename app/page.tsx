import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, BarChart3, Link2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Create short links in seconds",
    description:
      "Turn long URLs into clean, shareable links you can send anywhere.",
    icon: Link2,
  },
  {
    title: "Keep access secure",
    description:
      "Use Clerk authentication to manage your links inside a protected dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Track and improve",
    description:
      "Monitor link performance and make smarter sharing decisions over time.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-14 md:px-10 lg:py-20">
      <section className="space-y-6">
        <p className="inline-flex rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Modern link management for teams and creators
        </p>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Shorten links, stay organized, and share with confidence.
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            LinkShortener helps you create memorable links, manage them in one
            place, and build better sharing workflows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SignUpButton mode="modal">
            <Button size="lg">
              Get started
              <ArrowRight />
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              I already have an account
            </Button>
          </SignInButton>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border bg-card p-6 text-card-foreground"
          >
            <feature.icon className="mb-4 size-5 text-primary" />
            <h2 className="mb-2 text-lg font-medium">{feature.title}</h2>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
