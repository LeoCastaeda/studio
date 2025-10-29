import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(430,60)">
        <path d="M-110 0 H110" stroke="#B3B3B3" strokeWidth="3" strokeLinecap="round"/>
        <path d="M-65 0 L-30 55 H30 L65 0 Z" fill="#2A2A2A"/>
        <rect x="-20" y="55" width="40" height="46" rx="6" fill="#1F1F1F"/>
        <path d="M-10 12 L0 40 L10 12 Z" fill="#EDEDED"/>
        <circle cx="0" cy="78" r="8" fill="#EDEDED"/>
      </g>
      <g transform="translate(450,140)" stroke="#6F6F6F" strokeWidth="3" opacity="0.6" fill="none">
        <path d="M-240 90 A240 90 0 0 0 240 90" />
        <path d="M-280 150 A280 150 0 0 0 280 150" />
        <path d="M-320 210 A320 210 0 0 0 320 210" />
      </g>
      <g fontFamily="Segoe UI, Roboto, Helvetica, Arial, sans-serif" fontWeight={800} fontStyle="italic">
        <text x="150" y="300" fontSize="140" fill="#E21B1B" letterSpacing="1">glass</text>
        <text x="480" y="300" fontSize="140" fill="#FFFFFF" letterSpacing="1">nou</text>
      </g>
    </svg>
  );
}
