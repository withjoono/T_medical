/** =========================================================================
 *  계열 × 대학 면접 페이지의 '맥락' 데이터 — 2026-10-24 검색 노출 개선.
 *
 *  왜 있나 — 치·한·약·수 대학 면접 페이지는 공통 블록(수업·가격·강사)이 본문의
 *  절반 가까이를 차지했고, 같은 대학의 계열끼리는 요강 문장까지 같아 본문이
 *  86~94% 일치했다(경희대 치대↔한의대 94%). 검색엔진이 '거의 같은 문서' 로 보고
 *  색인을 미루는 구조라, 페이지마다 그 계열·그 대학에만 성립하는 사실을 더한다.
 *
 *  ⚠️ 여기서 만드는 문장은 전부 이미 있는 요강 데이터에서 **계산**한 것이다.
 *     (면접일 순서, 같은 날 면접, 발표→면접 간격, 수능 전후, 요강 공개 여부)
 *     새 수치를 지어내지 말 것. 데이터가 없으면 문장을 만들지 않는다.
 *  ========================================================================= */

import { FIELD_PAGES, type FieldPage, type FieldPageKey } from "./field-registry";
import {
  fieldEarliest,
  fieldGapDays,
  fieldTightestGap,
  type FieldUniv,
} from "./field-interview";
import { UNIV_PAGES } from "./univ";
import { admissionUnivs } from "./field-admission";
import type { Univ as AdmissionUniv } from "./ipkyul";
import { formatKo } from "./mmi-schedule";

/** 2027학년도 수능일. 이보다 이른 면접은 '수능 전 면접' 이다. */
export const CSAT_DATE = "2026-11-19";

export type CrossFieldKey = "uidae" | FieldPageKey;

export type CrossFieldLink = {
  key: CrossFieldKey;
  /** "치의예과" */
  unitLabel: string;
  /** "치대" */
  fieldShort: string;
  href: string;
  /** 카드 위 한 줄 — 면접 방식 라벨 */
  styleLabel: string;
  /** 가장 이른 면접일(ISO). 미공지·미실시면 null */
  first: string | null;
  none: boolean;
};

const ORDER: CrossFieldKey[] = ["uidae", "chidae", "hanuidae", "yakdae", "suuidae"];

function daysBetween(a: string, b: string) {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000,
  );
}

function uidaeLink(short: string): CrossFieldLink | null {
  const u = UNIV_PAGES.find((x) => x.short === short);
  if (!u) return null;
  const dates = (u.interview?.tracks ?? [])
    .map((t) => t.interview)
    .filter((d): d is string => Boolean(d))
    .sort();
  const none = u.hasInterview === false;
  return {
    key: "uidae",
    unitLabel: "의예과",
    fieldShort: "의대",
    href: `/interview/uidae/${u.slug}`,
    styleLabel: none ? "면접 미실시" : "의예과 면접",
    first: dates[0] ?? null,
    none,
  };
}

function fieldLink(field: FieldPage, short: string): CrossFieldLink | null {
  const u = field.univs.find((x) => x.short === short);
  if (!u) return null;
  return {
    key: field.key,
    unitLabel: field.unitLabel,
    fieldShort: field.short,
    href: `${field.base}/${u.slug}`,
    styleLabel: u.styleLabel,
    first: fieldEarliest(u),
    none: u.style === "none",
  };
}

/** 같은 대학의 다른 계열 면접 페이지. `current` 는 목록에서 뺀다. */
export function crossFieldLinks(short: string, current?: CrossFieldKey): CrossFieldLink[] {
  const out: CrossFieldLink[] = [];
  for (const key of ORDER) {
    if (key === current) continue;
    const link = key === "uidae" ? uidaeLink(short) : fieldLink(FIELD_PAGES[key], short);
    if (link) out.push(link);
  }
  return out;
}

/** 다른 계열 면접일을 현재 페이지 기준으로 한 마디로. 둘 중 하나라도 날짜가 없으면 null. */
export function relativeDateNote(mine: string | null, other: CrossFieldLink): string | null {
  if (other.none) return "면접 없음";
  if (!mine || !other.first) return other.first ? formatKo(other.first) : "면접일 미공지";
  const d = daysBetween(mine, other.first);
  if (d === 0) return `${formatKo(other.first)} · 같은 날`;
  return d > 0
    ? `${formatKo(other.first)} · ${d}일 뒤`
    : `${formatKo(other.first)} · ${-d}일 먼저`;
}

/* -------------------------------------------------------------------------
 * 계열 안에서 본 이 대학 — 같은 계열 대학들과 비교한 사실 문장
 * ---------------------------------------------------------------------- */

export type PeerFact = { label: string; text: string };

export type PeerContext = {
  facts: PeerFact[];
  /** 같은 날 면접이 있는 같은 계열 대학 — 복수 지원 시 충돌 */
  sameDay: FieldUniv[];
};


/* -------------------------------------------------------------------------
 * 입결 DB(실측만)에서 이 모집단위의 규모·공시 입결 — 계열마다 값이 다르다
 * ---------------------------------------------------------------------- */

const normName = (s: string) => s.replace(/\s|대학교|\(.*?\)/g, "").replace(/대$/, "");
const normTrack = (s: string) => s.replace(/\s|전형|\(.*?\)|-/g, "");

function admissionOf(field: FieldPage, u: FieldUniv): AdmissionUniv | undefined {
  return admissionUnivs(field.key).find((x) => normName(x.name) === normName(u.short));
}

function admissionFacts(field: FieldPage, u: FieldUniv): PeerFact[] {
  const out: PeerFact[] = [];
  const adm = admissionOf(field, u);
  if (!adm || adm.quota <= 0) return out;
  // 입결 DB 의 전형 수가 요강의 면접 전형 수보다 적으면 DB 가 이 모집단위를 덜 담은 것이다
  // (예: 인제대 약학과 — DB 1개 전형, 요강 면접 전형 4개). 그 경우 규모 비교를 싣지 않는다.
  if (adm.units.length < u.tracks.filter((t) => t.interview).length) return out;

  const peers = field.univs
    .map((x) => admissionOf(field, x))
    .filter((x): x is AdmissionUniv => Boolean(x) && (x as AdmissionUniv).quota > 0)
    .sort((a, b) => b.quota - a.quota);
  const rank = peers.findIndex((x) => x.slug === adm.slug) + 1;
  out.push({
    label: "모집 규모",
    text: `${field.unitLabel} 수시 모집은 ${adm.quota}명(${adm.units.length}개 전형)입니다. 입결 DB에 있는 ${field.short} ${peers.length}곳 가운데 ${
      rank === 1 ? "가장 많이 뽑습니다" : rank === peers.length ? "가장 적게 뽑습니다" : `${rank}번째로 많이 뽑습니다`
    }.`,
  });

  // 면접 전형과 이름이 맞는 전형의 공시(실측) 입결만 — 추정치는 DB 에 애초에 없다.
  const hits: string[] = [];
  for (const t of u.tracks.filter((x) => x.interview)) {
    const unit = adm.units.find(
      (x) => x.program && x.cut?.g70 !== undefined && normTrack(x.program).includes(normTrack(t.name)),
    );
    if (unit?.cut?.g70 !== undefined) {
      hits.push(`${unit.program} ${unit.quota}명 · 70%컷 ${unit.cut.g70.toFixed(2)}등급`);
    }
  }
  if (hits.length > 0) {
    out.push({
      label: "면접 전형 입결",
      text: `${hits.join(" / ")} (최종등록자 기준 공시 실측값). 면접 전 서류 단계에서 이 선이 기준이 됩니다.`,
    });
  }
  return out;
}

export function fieldPeerContext(field: FieldPage, u: FieldUniv): PeerContext {
  const facts: PeerFact[] = [];
  const me = fieldEarliest(u);
  const withInterview = field.univs.filter((x) => x.style !== "none");
  const dated = withInterview
    .map((x) => ({ u: x, d: fieldEarliest(x) }))
    .filter((x): x is { u: FieldUniv; d: string } => Boolean(x.d))
    .sort((a, b) => a.d.localeCompare(b.d));

  let sameDay: FieldUniv[] = [];

  if (u.style === "none") {
    facts.push({
      label: "면접 유무",
      text: `${field.short} ${field.univs.length}곳 가운데 2027학년도에 면접을 보지 않는 곳은 ${
        field.univs.length - withInterview.length
      }곳이고, ${u.short}가 그중 하나입니다.`,
    });
    facts.push(...admissionFacts(field, u));
    return { facts, sameDay };
  }

  if (me) {
    const rank = dated.filter((x) => x.d < me).length + 1;
    sameDay = dated.filter((x) => x.d === me && x.u.slug !== u.slug).map((x) => x.u);
    const tie = sameDay.length > 0 ? `(같은 날 ${sameDay.length}곳 포함)` : "";
    facts.push({
      label: "면접일 순서",
      text:
        rank === 1
          ? `면접일이 확인된 ${field.short} ${dated.length}곳 가운데 가장 이른 면접입니다${tie}. 첫 면접이 ${formatKo(me)}입니다.`
          : rank === dated.length && sameDay.length === 0
            ? `면접일이 확인된 ${field.short} ${dated.length}곳 가운데 가장 늦은 면접입니다(${formatKo(me)}). 다른 ${field.short} 면접을 먼저 치르고 들어가는 일정입니다.`
            : `면접일이 확인된 ${field.short} ${dated.length}곳 가운데 ${rank}번째로 이른 면접입니다${tie}. 첫 면접이 ${formatKo(me)}입니다.`,
    });

    const csatGap = daysBetween(me, CSAT_DATE);
    const beforeCsat = dated.filter((x) => x.d < CSAT_DATE).length;
    facts.push({
      label: "수능과의 거리",
      text:
        csatGap > 0
          ? `수능(${formatKo(CSAT_DATE)})보다 ${csatGap}일 먼저 치르는 면접입니다. ${field.short} 중 수능 전 면접은 ${beforeCsat}곳뿐이라, 수능 공부와 면접 준비를 동시에 굴려야 하는 드문 일정입니다.`
          : csatGap === 0
            ? `수능 당일과 겹치는 날짜입니다. 요강 원문과 입학처 공지를 반드시 다시 확인하세요.`
            : `수능 ${-csatGap}일 뒤 면접입니다. ${field.short} ${dated.length}곳 중 ${dated.length - beforeCsat}곳이 수능 뒤에 면접을 봅니다.`,
    });
  } else {
    facts.push({
      label: "면접일",
      text: `요강에 면접일이 아직 없습니다. 면접일이 확인된 ${field.short}는 ${dated.length}곳입니다. 1단계 발표 공지와 함께 날짜가 나옵니다.`,
    });
  }

  const tight = fieldTightestGap(u);
  if (tight) {
    const gaps = withInterview
      .map((x) => ({ u: x, g: fieldTightestGap(x) }))
      .filter((x): x is { u: FieldUniv; g: { track: FieldUniv["tracks"][number]; days: number } } =>
        Boolean(x.g),
      )
      .sort((a, b) => a.g.days - b.g.days);
    if (gaps.length > 1) {
      const shortest = gaps[0];
      const longest = gaps[gaps.length - 1];
      const position =
        shortest.u.slug === u.slug
          ? `${field.short} 중 가장 짧은 구간입니다`
          : longest.u.slug === u.slug
            ? `${field.short} 중 가장 긴 구간입니다`
            : `${field.short} 중 가장 짧은 곳은 ${shortest.u.short}(${shortest.g.days}일), 가장 긴 곳은 ${longest.u.short}(${longest.g.days}일)입니다`;
      facts.push({
        label: "발표→면접",
        text: `${tight.track.name} 기준으로 1단계 발표 뒤 ${tight.days}일 만에 면접입니다. ${position}.`,
      });
    }
  }

  const ivTracks = u.tracks.filter((t) => t.interview).length;
  const avg =
    withInterview.reduce((n, x) => n + x.tracks.filter((t) => t.interview).length, 0) /
    Math.max(1, withInterview.length);
  facts.push({
    label: "면접 전형 수",
    text: `면접을 보는 전형이 ${ivTracks}개입니다. 면접을 보는 ${field.short} ${withInterview.length}곳의 평균은 ${avg.toFixed(1)}개${
      ivTracks > 1 ? " — 전형마다 날짜와 반영비율이 다를 수 있어 지원 전형부터 확정해야 합니다" : ""
    }.`,
  });

  const disclosedSource = withInterview.filter(
    (x) => x.source && x.source.label !== "요강 미기재",
  ).length;
  const disclosedScoring = withInterview.filter(
    (x) => x.scoring && !x.scoring.label.includes("미기재"),
  ).length;
  const mySource = u.source && u.source.label !== "요강 미기재";
  const myScoring = u.scoring && !u.scoring.label.includes("미기재");
  facts.push({
    label: "요강 공개 범위",
    text: `면접을 보는 ${field.short} ${withInterview.length}곳 중 질문 출처를 요강에 밝힌 곳은 ${disclosedSource}곳, 평가 배점을 밝힌 곳은 ${disclosedScoring}곳입니다. ${u.short}는 ${
      mySource && myScoring
        ? "둘 다 공개해 준비 범위가 분명한 편입니다"
        : mySource
          ? "질문 출처만 공개했습니다 — 배점은 요강에 없습니다"
          : myScoring
            ? "평가 배점만 공개했습니다 — 질문이 어디서 나오는지는 요강에 없습니다"
            : "둘 다 공개하지 않았습니다 — 요강 문장 밖의 질문에 대비해야 합니다"
    }.`,
  });

  facts.push(...admissionFacts(field, u));
  return { facts, sameDay };
}

/** 면접 전형 중 발표→면접 간격 목록(표시용). */
export function trackGaps(u: FieldUniv) {
  return u.tracks
    .filter((t) => t.interview)
    .map((t) => ({ name: t.name, days: fieldGapDays(t) }));
}
