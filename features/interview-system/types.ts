/** 면접 시스템 데이터 모양 — 클라이언트가 import 해도 데이터 원본이 딸려 오지 않게 타입만 둔다(값은 catalog.ts 가 만든다) */

export type CatalogField = "uidae" | "chidae" | "hanuidae" | "yakdae" | "suuidae";

export type CatalogTrack = { name: string; announce: string | null; date: string | null };

export type CatalogUniv = {
  /** `${field}:${slug}` — 내 지원 대학 저장 키 */
  id: string;
  field: CatalogField;
  /** 「고려대」 */
  short: string;
  /** 예약에 남기는 학교 이름 — 「고려대학교」 */
  school: string;
  /** 면접 정보 페이지 */
  href: string;
  /** 면접이 있는 전형만 */
  tracks: CatalogTrack[];
  /** 그 대학 기출 면접 세트 — /interview/ai?set= */
  aiSet: string | null;
};

/** T메디 수업 상품 — 수시 서버 bank-deposit.constants.ts INTERVIEW_CLASS 의 iv_medi* 와 같아야 한다 */
export type ClassOption = { product: string; label: string; sessions: number; price: number; note: string; recommended?: boolean };

export type CatalogFieldInfo = { key: CatalogField; short: string; unit: string };

export type InterviewCatalog = {
  /** 계열 — 예약 폼 학과 칸 기본값(「치의예과」 등) */
  fields: CatalogFieldInfo[];
  univs: CatalogUniv[];
  options: ClassOption[];
  /** 예약 폼 환불 확인 문장 — lib/mmi-schedule.ts TUITION.refund 에서 */
  refund: string[];
};
