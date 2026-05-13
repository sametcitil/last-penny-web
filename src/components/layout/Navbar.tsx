import Container from "@/components/ui/Container";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <Container>
        <div className="flex items-center justify-between py-5">
          <div className="font-bold tracking-widest">
            LAST PENNY
          </div>

          <nav className="flex gap-6 text-sm text-white/70">
            <a href="/events">Events</a>
            <a href="/menu">Menu</a>
            <a href="/gallery">Gallery</a>
            <a href="/merch">Merch</a>
          </nav>
        </div>
      </Container>
    </header>
  );
}