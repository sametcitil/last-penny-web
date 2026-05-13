import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <Container>
        <div className="py-10 text-sm text-white/60 flex justify-between">
          <p>© 2026 Last Penny</p>
          <p>Jazz • Culture • Community</p>
        </div>
      </Container>
    </footer>
  );
}