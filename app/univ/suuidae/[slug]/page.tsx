import type { Metadata } from "next";
import { FieldAdmissionPage, fieldAdmissionMetadata, fieldAdmissionParams } from "../../_field-admission";

/** /univ/suuidae/<대학> — 전형 소개. 본문은 app/univ/_field-admission.tsx 공용. */
export function generateStaticParams() {
  return fieldAdmissionParams("suuidae");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return fieldAdmissionMetadata("suuidae", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FieldAdmissionPage fp="suuidae" slug={slug} />;
}
