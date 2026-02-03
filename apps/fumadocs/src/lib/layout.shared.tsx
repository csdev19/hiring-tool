import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Hiring Tool Docs",
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
      },
    ],
  };
}
