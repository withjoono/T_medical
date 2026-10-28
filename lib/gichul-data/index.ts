/** 대학별 면접 기출 분석 데이터 목록 — lib/univ-gichul.ts 가 읽는다.
 *  대학 파일(<key>.json)을 추가하면 아래에 import 한 줄과 배열 항목을 함께 넣는다. */

import cha from "./cha.json";
import chosun from "./chosun.json";
import cnu from "./cnu.json";
import daejeon from "./daejeon.json";
import dankook from "./dankook.json";
import dongduk from "./dongduk.json";
import dongeui from "./dongeui.json";
import donggukSeoul from "./dongguk-seoul.json";
import donggukWise from "./dongguk-wise.json";
import duksung from "./duksung.json";
import eulji from "./eulji.json";
import gnu from "./gnu.json";
import hallym from "./hallym.json";
import hanyang from "./hanyang.json";
import jbnu from "./jbnu.json";
import jeju from "./jeju.json";
import jnu from "./jnu.json";
import kangwon from "./kangwon.json";
import khu from "./khu.json";
import konkukGlocal from "./konkuk-glocal.json";
import konkukSeoul from "./konkuk-seoul.json";
import konyang from "./konyang.json";
import sch from "./sch.json";
import semyung from "./semyung.json";
import syu from "./syu.json";
import wonkwang from "./wonkwang.json";
import woosuk from "./woosuk.json";

export const GICHUL_DATA: unknown[] = [
  cha,
  chosun,
  cnu,
  daejeon,
  dankook,
  dongduk,
  dongeui,
  donggukSeoul,
  donggukWise,
  duksung,
  eulji,
  gnu,
  hallym,
  hanyang,
  jbnu,
  jeju,
  jnu,
  kangwon,
  khu,
  konkukGlocal,
  konkukSeoul,
  konyang,
  sch,
  semyung,
  syu,
  wonkwang,
  woosuk,
];
