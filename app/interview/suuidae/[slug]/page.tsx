import type { Metadata } from "next";
import { FIELD_PAGES } from "@/lib/field-registry";
import { FieldUnivPage, fieldUnivMetadata, requireUniv } from "../../_field-page";

const FIELD = FIELD_PAGES.suuidae;

/** 정적 export(output: 'export')라 동적 라우트에는 generateStaticParams 가 필수다. */
export function generateStaticParams() {
  return FIELD.univs.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = FIELD.univs.find((x) => x.slug === slug);
  if (!u) return { title: `${FIELD.label} | T Medi` };
  return fieldUnivMetadata(FIELD, u);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FieldUnivPage field={FIELD} univ={requireUniv(FIELD, slug)} />;
}
