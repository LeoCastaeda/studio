"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
}

export function TableOfContents({
  contentSelector = ".article-content",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extraer headings del DOM
  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const elements = container.querySelectorAll("h2, h3");
    const items: Heading[] = [];

    elements.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
      items.push({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);
  }, [contentSelector]);

  // Intersection Observer para resaltar el heading activo
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -70% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Tabla de contenidos"
      className="sticky top-24 hidden xl:block w-56 shrink-0"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        En este artículo
      </p>
      <ol className="space-y-1 border-l border-gray-200 dark:border-gray-800">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`
                block py-1 text-sm leading-snug transition-all duration-200
                ${h.level === 3 ? "pl-6" : "pl-4"}
                ${
                  activeId === h.id
                    ? "text-red-600 dark:text-red-400 font-semibold border-l-2 border-red-600 dark:border-red-400 -ml-px"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
