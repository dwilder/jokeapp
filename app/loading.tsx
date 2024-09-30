import Container from "./components/container";

export default function Loading() {
  return (
    <Container>
      <div className="m-auto">
        <p className="animate-spin text-8xl">🤡</p>
      </div>
    </Container>
  );
}