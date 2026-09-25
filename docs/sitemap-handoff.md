# T메디 sitemap 등록 핸드오프 (2026-09-20)

`public/sitemap.xml` 은 `Hub/brand/sync_brand.py` 산출물입니다. **직접 고치지 않았습니다.**
SSOT 는 `Hub/brand/apps.json` 의 medi `pages` 입니다.

## 현재 상태

- 빌드 결과 실제 존재하는 페이지: **117개**
- 현재 `sitemap.xml` 에 등록된 페이지: **28개**
- **누락: 89개** — `/ipkyul` 44개, `/univ` 40개가 통째로 빠져 있고, 이번에 추가한 `/interview` 하위 4개와 `/jiyeok-uisa` 도 미등록입니다.

## 할 일

1. `Hub/brand/apps.json` 의 medi `pages` 를 아래 `medi-pages.json` 내용으로 교체
2. 아래 명령 실행

```bash
cd E:\Dev\github\Hub
python brand/sync_brand.py medi
node scripts/check-standard.mjs medi
```

## 전체 경로 목록 (117개)


### / (1개)

- `/`

### /blog (1개)

- `/blog`

### /guide (1개)

- `/guide`

### /interview (5개)

- `/interview`
- `/interview/chuseok`
- `/interview/injeokseong`
- `/interview/jesimun`
- `/interview/mmi`

### /ipkyul (44개)

- `/ipkyul`
- `/ipkyul/chiuiye`
- `/ipkyul/hanuiye`
- `/ipkyul/suuiye`
- `/ipkyul/uiye`
- `/ipkyul/uiye/ajou`
- `/ipkyul/uiye/catholic`
- `/ipkyul/uiye/catholic-kwandong`
- `/ipkyul/uiye/cau`
- `/ipkyul/uiye/cbnu`
- `/ipkyul/uiye/chosun`
- `/ipkyul/uiye/cnu`
- `/ipkyul/uiye/daegu-catholic`
- `/ipkyul/uiye/dankook`
- `/ipkyul/uiye/donga`
- `/ipkyul/uiye/dongguk-wise`
- `/ipkyul/uiye/eulji`
- `/ipkyul/uiye/ewha`
- `/ipkyul/uiye/gachon`
- `/ipkyul/uiye/gnu`
- `/ipkyul/uiye/hallym`
- `/ipkyul/uiye/hanyang`
- `/ipkyul/uiye/inha`
- `/ipkyul/uiye/inje`
- `/ipkyul/uiye/jbnu`
- `/ipkyul/uiye/jeju`
- `/ipkyul/uiye/jnu`
- `/ipkyul/uiye/keimyung`
- `/ipkyul/uiye/khu`
- `/ipkyul/uiye/knu`
- `/ipkyul/uiye/konkuk-glocal`
- `/ipkyul/uiye/konyang`
- `/ipkyul/uiye/korea`
- `/ipkyul/uiye/kosin`
- `/ipkyul/uiye/pusan`
- `/ipkyul/uiye/sch`
- `/ipkyul/uiye/skku`
- `/ipkyul/uiye/snu`
- `/ipkyul/uiye/ulsan`
- `/ipkyul/uiye/wonkwang`
- `/ipkyul/uiye/yeungnam`
- `/ipkyul/uiye/yonsei`
- `/ipkyul/uiye/yonsei-mirae`
- `/ipkyul/yakhak`

### /jiyeok-uisa (1개)

- `/jiyeok-uisa`

### /jungsi (1개)

- `/jungsi`

### /mmi (16개)

- `/mmi`
- `/mmi/ajou`
- `/mmi/catholic`
- `/mmi/cau`
- `/mmi/daegu-catholic`
- `/mmi/hallym`
- `/mmi/hanyang`
- `/mmi/inje`
- `/mmi/kangwon`
- `/mmi/keimyung`
- `/mmi/konyang`
- `/mmi/korea`
- `/mmi/skku`
- `/mmi/snu`
- `/mmi/ulsan`
- `/mmi/yonsei`

### /overseas (1개)

- `/overseas`

### /susi (4개)

- `/susi`
- `/susi/gyogwa`
- `/susi/jonghap`
- `/susi/nonsul`

### /tamgu (1개)

- `/tamgu`

### /uidae-class (1개)

- `/uidae-class`

### /univ (40개)

- `/univ`
- `/univ/ajou`
- `/univ/catholic`
- `/univ/catholic-kwandong`
- `/univ/cau`
- `/univ/cbnu`
- `/univ/chosun`
- `/univ/cnu`
- `/univ/daegu-catholic`
- `/univ/dankook`
- `/univ/donga`
- `/univ/dongguk-wise`
- `/univ/eulji`
- `/univ/ewha`
- `/univ/gachon`
- `/univ/gnu`
- `/univ/hallym`
- `/univ/hanyang`
- `/univ/inha`
- `/univ/inje`
- `/univ/jbnu`
- `/univ/jeju`
- `/univ/jnu`
- `/univ/kangwon`
- `/univ/keimyung`
- `/univ/khu`
- `/univ/knu`
- `/univ/konkuk-glocal`
- `/univ/konyang`
- `/univ/korea`
- `/univ/kosin`
- `/univ/pusan`
- `/univ/sch`
- `/univ/skku`
- `/univ/snu`
- `/univ/ulsan`
- `/univ/wonkwang`
- `/univ/yeungnam`
- `/univ/yonsei`
- `/univ/yonsei-mirae`
