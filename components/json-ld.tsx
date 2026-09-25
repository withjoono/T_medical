import { ldJson } from "@/lib/jsonld";

/** JSON-LD 한 덩어리를 <head> 밖 본문에 심는다.
 *  App Router 에서는 본문에 둬도 크롤러가 읽는다(Google 공식 안내). */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson(data) }}
    />
  );
}

/** 여러 덩어리를 한 번에. */
export function JsonLdAll({ items }: { items: unknown[] }) {
  return (
    <>
      {items.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
    </>
  );
}
