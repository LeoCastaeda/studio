import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      {...props}
    >
      <path d="M3 12h18" />
      <path d="M3 7c0-2.5 4-4 9-4s9 1.5 9 4" />
      <path d="M3 17c0 2.5 4 4 9 4s9-1.5 9-4" />
    </svg>
  );
}
