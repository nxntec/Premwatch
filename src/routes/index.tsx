import { createFileRoute } from "@tanstack/react-router";
import { PremPage } from "@/components/prem-page";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <PremPage />;
}
