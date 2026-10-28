/** 대학별 면접 기출 분석 데이터 목록 — lib/univ-gichul.ts 가 읽는다.
 *  대학 파일(<key>.json)을 추가하면 아래에 import 한 줄과 배열 항목을 함께 넣는다. */

import cha from "./cha.json";
import chosun from "./chosun.json";
import dongduk from "./dongduk.json";
import duksung from "./duksung.json";
import jbnu from "./jbnu.json";
import jeju from "./jeju.json";
import jnu from "./jnu.json";
import syu from "./syu.json";
import wonkwang from "./wonkwang.json";
import woosuk from "./woosuk.json";

export const GICHUL_DATA: unknown[] = [
  cha,
  chosun,
  dongduk,
  duksung,
  jbnu,
  jeju,
  jnu,
  syu,
  wonkwang,
  woosuk,
];
