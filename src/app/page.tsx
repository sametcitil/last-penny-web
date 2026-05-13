import Container from "@/components/ui/Container";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="py-24 border-b border-white/10">
        <Container>
          <h1 className="text-5xl font-bold tracking-tight">
            Worth Every Last Penny
          </h1>

        </Container>
      </section>

      {/* EVENTS PREVIEW */}
      <section className="py-20">
        <Container>
          <h2 className="text-2xl mb-6">This Week</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white/10 p-4">
              Jazz Night
            </div>
            <div className="border border-white/10 p-4">
              Book Club
            </div>
            <div className="border border-white/10 p-4">
              Talk Session
            </div>
          </div>
        </Container>
      </section>

      {/* AI TEASER */}
      <section className="py-20 border-t border-white/10">
        <Container>
          <div className="border border-primary/30 p-6">
            <h3 className="text-xl">Need a recommendation?</h3>
            <p className="text-white/60 mt-2">
              Ask our menu assistant.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}