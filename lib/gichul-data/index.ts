/** 대학별 면접 기출 분석 데이터 목록 — lib/univ-gichul.ts 가 읽는다.
 *  대학 파일(<key>.json)을 추가하면 아래에 import 한 줄과 배열 항목을 함께 넣는다.
 *  ⚠️ 보고서에 '상업적 사용 금지' 문구가 있는 대학(부산대·성균관대·건국대·연세대·연세대 미래·서울대 입학본부 문항)은
 *     게시 여부를 정하기 전까지 싣지 않는다(2026-10-29). */

import ajou from "./ajou.json";
import catholic from "./catholic.json";
import cau from "./cau.json";
import cha from "./cha.json";
import chosun from "./chosun.json";
import cnu from "./cnu.json";
import daeguCatholic from "./daegu-catholic.json";
import daejeon from "./daejeon.json";
import dankook from "./dankook.json";
import donga from "./donga.json";
import dongduk from "./dongduk.json";
import dongeui from "./dongeui.json";
import donggukSeoul from "./dongguk-seoul.json";
import donggukWise from "./dongguk-wise.json";
import duksung from "./duksung.json";
import eulji from "./eulji.json";
import ewha from "./ewha.json";
import gnu from "./gnu.json";
import hallym from "./hallym.json";
import hanyang from "./hanyang.json";
import inha from "./inha.json";
import inje from "./inje.json";
import jbnu from "./jbnu.json";
import jeju from "./jeju.json";
import jnu from "./jnu.json";
import kangwon from "./kangwon.json";
import keimyung from "./keimyung.json";
import khu from "./khu.json";
import knu from "./knu.json";
import konkukGlocal from "./konkuk-glocal.json";
import konyang from "./konyang.json";
import kosin from "./kosin.json";
import sch from "./sch.json";
import semyung from "./semyung.json";
import syu from "./syu.json";
import ulsan from "./ulsan.json";
import wonkwang from "./wonkwang.json";
import woosuk from "./woosuk.json";
import yeungnam from "./yeungnam.json";

export const GICHUL_DATA: unknown[] = [
  ajou,
  catholic,
  cau,
  cha,
  chosun,
  cnu,
  daeguCatholic,
  daejeon,
  dankook,
  donga,
  dongduk,
  dongeui,
  donggukSeoul,
  donggukWise,
  duksung,
  eulji,
  ewha,
  gnu,
  hallym,
  hanyang,
  inha,
  inje,
  jbnu,
  jeju,
  jnu,
  kangwon,
  keimyung,
  khu,
  knu,
  konkukGlocal,
  konyang,
  kosin,
  sch,
  semyung,
  syu,
  ulsan,
  wonkwang,
  woosuk,
  yeungnam,
];
