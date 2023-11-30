import type { MetaFunction } from "@remix-run/cloudflare";
import { ComingSoon } from "./coming-soon";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
      <div>
        <ComingSoon />
      </div>
  );
}
