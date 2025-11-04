// app/quote/page.tsx
import { Suspense } from "react";
import QuoteForm from "./quote-form";

type PageProps = {
  searchParams: Promise<{ glassType?: string }>;
};

function QuoteFallback() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold">Solicitar una Cotización</h1>
      <p className="text-muted-foreground mt-2">Cargando…</p>
    </div>
  );
}

export default async function QuotePage({ searchParams }: PageProps) {
  const { glassType = "" } = await searchParams; // ✅ Next 15: await

  return (
    <Suspense fallback={<QuoteFallback />}>
      <QuoteForm initialGlassType={glassType} />
    </Suspense>
  );
}
