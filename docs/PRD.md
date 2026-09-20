# theo-ne.com — 제품 요구사항 정의서

**대상 제품** (주)테오네 공식 웹사이트 · https://theo-ne.com
**문서 상태** 2026-09-11 기준 **운영 반영 완료분**을 기술함 (구현 후 작성)
**운영 커밋** `ae002ba` · 배포 `src=git` (GitHub `main` 푸시 자동 배포)

---

## 1. 개요

(주)테오네의 법인 공식 사이트. 회사가 무엇을 하는 곳인지, 누가 운영하는지, 어떻게 연락하는지를
한 페이지에서 검증 가능한 형태로 제시한다.

이 사이트의 1차 독자는 사람이 아니라 **검색엔진과 AI 답변 엔진**이다. 방문자 수가 아니라,
"테오네가 어떤 회사냐"는 질문에 기계가 **정확하게** 답할 수 있는지가 성공 기준이다.
사람 방문자는 그 답을 확인하러 오는 2차 독자다.

### 1.1 포지셔닝

법인은 두 축으로 일한다. 사이트 구조가 이 두 축을 그대로 반영한다.

| 축 | 내용 |
|---|---|
| 기업 지원 | 기업의 해외 거래·수출 실무를 직접 수행 |
| 소프트웨어 | 그 일에서 반복되는 부분을 **Teheranro AI Studio** 브랜드로 제품화 |

핵심 문장: *기업의 해외 거래를 돕고, 반복되는 일은 소프트웨어로 만듭니다.*

---

## 2. 목표와 비목표

### 2.1 목표

- G1. 법인 실체(상호·대표·사업자번호·주소·연락처)를 기계 판독 가능한 형태로 공개
- G2. 두 축의 사업 범위를 오해 없이 전달
- G3. Teheranro AI Studio가 **법인의 브랜드**임을 명시 — 별도 회사로 오인되지 않게
- G4. 하지 않는 일(법률 자문 등)을 명시해 잘못된 문의·법적 오해를 차단
- G5. 한국어·영어 각각 독립된 크롤링 대상 URL로 제공
- G6. JS 실행 없이도 전체 내용이 읽히는 정적 HTML 제공

### 2.2 비목표

- 리드 수집·전환 최적화 (폼 없음, CTA는 이메일 한 개)
- 블로그·콘텐츠 마케팅 — 주제 콘텐츠는 `trops.kr` / `teheranro-ai.com`이 담당
- 제품 상세 설명 — TROPS 상세는 `trops.kr`로 위임, 여기서는 이름과 링크만
- 개인 사업(대표 개인 자격의 활동) 홍보

---

## 3. 대상 독자

| 순위 | 대상 | 필요 |
|---|---|---|
| 1 | AI 답변 엔진 (GPTBot, ClaudeBot, PerplexityBot, Bingbot, Google-Extended 등) | 인용 가능한 사실, 구조화 데이터 |
| 2 | 검색엔진 (Google, Naver, Bing) | 색인 가능한 정적 HTML, 사이트맵 |
| 3 | 거래처·기관 담당자 | 법인 실체 확인, 연락처 |
| 4 | 해외 거래 중소기업 / 해외 진출 준비 창업 기업 | 무엇을 요청할 수 있는지 |

---

## 4. 정보 구조

단일 페이지. 섹션 순서가 곧 우선순위다.

```
header        워드마크 · 내비게이션 · 언어 전환
hero          법인명(국/영) · 핵심 문장
#work         하는 일 — 두 축 + 연결선
#founder      대표
#faq          자주 묻는 질문 (5문항)
#contact      문의
footer        법인 정보 · 고지
```

### 4.1 섹션별 요구사항

**header**
- 워드마크 `THÉONÉ`는 페이지 최상단 앵커(`#top`)로 이동
- 내비게이션: 하는 일 / 대표 / 문의. 860px 이하에서 앞의 둘은 숨김(`.hide-m`)
- 언어 전환은 **실제 링크**여야 한다 (§6)

**hero**
- 현재 언어의 법인명을 h1으로, 반대 언어 표기를 부제로 병기
  (ko: `(주)테오네` + `THÉONÉ Inc.` / en: 반대)
- 핵심 문장은 한국어에서 2줄로 끊어 표시, 영어는 1줄

**#work** — 이 사이트의 중심 섹션
- 두 축을 좌우 동등한 비중으로 배치 (860px 이하에서는 세로 스택)
- 좌: 기업 지원 5개 항목 + 문의 링크
- 우: 소프트웨어 3개 제품 + `Teheranro AI Studio` 배지 + 전체 보기 링크
- 배지는 **번역하지 않는다** — 국/영 페이지 모두 `테헤란로 AI 스튜디오 / Teheranro AI Studio` 병기
- TROPS만 외부 링크, Otherwise·Bar Route는 텍스트
- 두 축 사이 연결선과 라벨 "반복되는 일은 제품이 됩니다."로 인과를 시각화 (§9)

**#founder**
- 성명 + 직위, 경력 5행, LinkedIn 링크
- 수상·선정은 `KAIST OverEdge 50인 선정` 1건만 `Person.award`로 모델링

**#faq** — 5문항 고정. AI 인용 단위이므로 각 답변은 단독으로 완결되어야 한다
1. (주)테오네는 어떤 회사인가요?
2. 기업 지원으로 무엇을 요청할 수 있나요?
3. 어떤 기업이 이용하나요?
4. Teheranro AI Studio와는 어떤 관계인가요?
5. 법률 자문도 하나요?

**#contact** — 이메일 한 개(`contact@theo-ne.com`). 폼 없음

**footer** — 상호 · 대표 · 사업자등록번호 · 주소 · 법률 자문 아님 고지 · 저작권

---

## 5. 콘텐츠 관리

- 모든 화면 문구는 `src/i18n/locales/{ko,en}.json`에 있다. 컴포넌트에 문자열을 직접 쓰지 않는다
- JSON-LD·`llms.txt`·OG 이미지 문구가 **같은 로케일 파일에서 생성**되므로 본문과 절대 어긋나지 않는다
- 메타·법인 속성 등 로케일이 아닌 값은 `scripts/site.mjs`의 `META`에 둔다

### 5.1 금지 문구

다음은 이전 포지셔닝의 잔재이며 **어디에도 다시 들어가면 안 된다**:
`직접 처리합니다` · `해외 계약 행정` · `파트너 전문가로 연결` · `중소기업의 수출입 실무`

### 5.2 외부 도메인 정책

- `trops.kr`, `teheranro-ai.com`은 www 주소로 링크한다
- **`hanabeomlaw.com`은 본문·JSON-LD·`llms.txt` 어디에도 넣지 않는다.** 대표 개인 사업이며
  법인 사이트의 범위 밖이다

---

## 6. URL과 국제화

| 언어 | URL |
|---|---|
| 한국어 (기본) | `https://theo-ne.com/` |
| 영어 | `https://theo-ne.com/en/` |

- 두 언어는 **각각 독립된 정적 문서**다. JS로 문구를 바꾸는 방식은 금지 — 크롤러가 한 언어만 보게 된다
- 언어 전환 UI는 서로를 가리키는 `<a href>`이며 현재 언어에 `aria-current="page"`
- 모든 페이지에 `hreflang` ko / en / x-default 제공
- 언어 판정은 URL 경로 기준(`langFromPath`). localStorage·쿠키 사용 금지 — SSR과 하이드레이션이 어긋난다

### 6.1 호스트 정규화

`http://theo-ne.com`, `http://www.theo-ne.com`, `https://www.theo-ne.com` → 모두 308로
`https://theo-ne.com`으로 수렴. `canonical`은 항상 apex를 가리킨다.

---

## 7. 검색·AI 노출 요구사항

이 절이 이 제품의 핵심 요구사항이다.

### 7.1 정적 렌더링

- 빌드 시 전 페이지를 정적 HTML로 프리렌더한다 (`scripts/prerender.mjs`)
- `<div id="root">`가 빈 껍데기인 상태로 배포되면 **치명적 결함**이다
- 진입 애니메이션의 시작 상태는 `<html class="js">`에만 적용한다. JS를 실행하지 않는 클라이언트는
  완성 상태를 본다

### 7.2 구조화 데이터

단일 `@graph`에 5개 노드:

| 노드 | 요점 |
|---|---|
| `Organization` | 상호·영문상호·설명·이메일·설립연도·`taxID`·주소·`logo`/`image`·`contactPoint` |
| ↳ `brand` | `Teheranro AI Studio` → `teheranro-ai.com` |
| ↳ `hasOfferCatalog` | 기업 지원 5개 항목 |
| `Person` | 대표. `jobTitle`·`award`·`sameAs`(LinkedIn **만**)·`worksFor` |
| `SoftwareApplication` | TROPS. `name`/`url`/`publisher`만 |
| `WebSite` | 사이트 전체. `inLanguage` ko·en |
| `WebPage` + `FAQPage` | 페이지별. `isPartOf`·`about`·`mentions`·FAQ 5문항 |

- `WebSite`/`WebPage` 노드는 **유지해야 한다** — `/en/`의 `inLanguage`·`isPartOf` 신호가 여기 실린다
- dangling `@id` 참조가 없어야 한다

### 7.3 발견 경로

| 자산 | 내용 |
|---|---|
| `robots.txt` | 주요 AI 크롤러 30여 종 명시 허용 + `Sitemap:` 선언 |
| `sitemap.xml` | 빌드 시 생성. ko/en + hreflang + `lastmod` |
| `llms.txt` | llmstxt.org 규약. 로케일에서 생성 |
| `og.png` / `og-en.png` | 1200×630. 언어별. 로케일 문구로 생성 |

### 7.4 소유 확인

- `VERIFICATION.google` / `VERIFICATION.naver`는 **목록**이다. 환경변수를 쉼표·공백으로 구분해 파싱하고
  토큰마다 태그를 하나씩 출력한다
- 한 속성을 여러 번 등록할 수 있고, **기존 토큰을 계속 서빙하지 않으면 이전 소유권이 만료된다**
- 현재: 네이버 2개 토큰(메타 태그), 구글은 DNS TXT(메타 태그 없음)

### 7.5 변경 통보

배포 후 `npm run indexnow`로 Bing·네이버에 통보한다. 구글은 IndexNow 미지원이라
Search Console에서 별도 색인 요청이 필요하다.

**이 스크립트는 `npm run build`에 포함하지 않는다.** 빌드는 배포 승격 이전에 실행되므로
그 시점에 통보하면 크롤러에게 옛 내용을 알리게 된다. 스크립트는 키 파일과 대상 URL이
실제로 200을 반환하는지 확인한 뒤에만 전송한다.

---

## 8. 디자인 시스템

| 토큰 | 값 | 용도 |
|---|---|---|
| `--paper` | `#FFFFFF` | 배경 |
| `--ink` | `#1C2024` | 본문 |
| `--muted` | `#6A7177` | 보조 텍스트·라벨 |
| `--rule` | `#E3E6E4` | 구분선 |
| `--plate` | `#1F4A96` | 배지 배경·포커스 링 |

- 서체 **Pretendard Variable** (jsDelivr `@v1.3.9` dynamic subset). 본문 17px / 행간 1.75
- 컨테이너 `max-width: 62rem`, 좌우 여백 2rem (860px 이하 1.5rem)
- 유일한 브레이크포인트: **860px**
- 한국어 줄바꿈은 `word-break: keep-all` — 음절 단위로 끊기면 안 된다

### 8.1 CSS 범위 규칙

목업 CSS는 `header`·`nav`·`section`·`h2`·`footer`·`details` 같은 태그 선택자를 쓴다.
이를 그대로 두면 `src/components/ui/*`(shadcn)까지 번진다. **모든 규칙은 페이지 루트 클래스
`.theone` 아래로 한정한다.** 전역에 남기는 것은 `:root` 커스텀 프로퍼티와 `html`/`body` 리셋뿐이다.

---

## 9. 인터랙션과 접근성

### 9.1 진입 애니메이션 (#work)

두 축이 원근에서 제자리로 들어오고, 좌→우 연결선이 그려진 뒤, 태그가 선을 따라 이동해
TROPS 행을 잠깐 강조한다. 두 축이 인과로 이어져 있음을 보여주는 장치다.

구현 제약:
- 실행 상태(`go`)는 **React state**로 관리한다. DOM에 클래스를 직접 붙이면 재렌더가 지운다
- 애니메이션이 명령형으로 쓰는 값(`--len`, `--mx`, `--my`, SVG `viewBox`/`d`/`points`)은
  React가 prop으로 제어하지 않는 속성이어야 한다
- 860px 이하에서는 연결선을 숨기고(`display:none`) 라벨만 남긴다

### 9.2 `prefers-reduced-motion: reduce`

애니메이션 CSS 전체가 `@media (prefers-reduced-motion: no-preference)` 안에 있다.
감소 설정에서는 **처음부터 완성 상태**로 보이며, 태그 이동도 실행하지 않는다. `scroll-behavior`도 `auto`.

### 9.3 기타

- 포커스 링: `2px solid var(--plate)`, offset 4px
- FAQ는 네이티브 `<details>` — JS 없이 동작하고 닫힌 상태에서도 내용이 DOM에 있다
- 내비게이션·언어 그룹에 `aria-label`, 각 섹션에 `aria-labelledby`

---

## 10. 기술 구조

```
Vite + React 18 + TypeScript          SPA로 개발
  └ vite build                        클라이언트 번들 → dist/
  └ vite build --ssr entry-server     → dist-ssr/
  └ node scripts/prerender.mjs        정적 HTML + head + JSON-LD + sitemap + llms.txt
```

| 파일 | 역할 |
|---|---|
| `scripts/site.mjs` | 단일 진실 공급원 — ORIGIN, META, LINKS, VERIFICATION, TAX_ID, INDEXNOW_KEY |
| `scripts/prerender.mjs` | head·JSON-LD 주입, sitemap·llms.txt 생성 |
| `scripts/make-og-image.mjs` | OG 이미지 (헤드리스 Chrome + npm `pretendard` 인라인) |
| `scripts/indexnow.mjs` | 배포 후 변경 통보 |
| `scripts/ai-search-audit.mjs` | 품질 게이트 (§11) |
| `index.html` | `js` 클래스 · `<!--seo-head-->` · `<!--ssr-outlet-->` 자리표시자 |

앱과 빌드 스크립트는 `@site` 별칭으로 `site.mjs`의 외부 URL을 공유한다 — 두 곳에 적어 어긋나는 일이 없도록.

### 10.1 배포

- 호스팅 Vercel · 저장소 `tteehhaa/theo-ne-landing` · 프로덕션 브랜치 `main`
- **`main` 푸시로만 배포한다.** 로컬 `vercel --prod` 금지 — 운영과 git 이력이 어긋난다
- `vercel.json`의 `git.deploymentEnabled: true`로 모든 브랜치가 미리보기를 생성한다
- 미리보기는 Vercel 인증으로 보호됨(`ssoProtection`). 외부 공유 시 해제 필요
- DNS는 hosting.kr. **DNS 레코드는 Vercel CLI로 변경할 수 없다**
- `design/` 폴더는 참고용이며 배포 산출물(`dist/`)에 포함되지 않는다

---

## 11. 품질 기준

`node scripts/ai-search-audit.mjs https://theo-ne.com` — **90점 미만이면 배포 불가.**

| 항목 | 배점 | 현재 |
|---|---|---|
| JS 없이 읽히는가 | 30 | 30 |
| AI 크롤러 접근 | 15 | 15 |
| 구조화 데이터 | 20 | 20 |
| 질문 답변 가능성 | 15 | 15 |
| 발견 경로 | 10 | 10 |
| 스니펫 품질 | 10 | 10 |
| **합계** | **100** | **100** |

### 11.1 본문 분량 기준은 언어별이다

두 언어에 같은 글자 수를 적용하면 페이지가 아니라 **문자 체계를 측정**하게 된다.
같은 내용 기준 `ko 967 / en 1683 = 0.5746`이므로, 영어 1,000자에 대응하는 한국어 기준은 575자다.

### 11.2 감사 스크립트 원칙

- 검사할 문구를 **로케일 파일에서 읽지 않는다.** 같은 소스를 읽는 감사는 아무것도 증명하지 못한다
- 통과시키려고 기준을 낮추지 않는다. 기준이 틀렸다면 근거를 남기고 고친다(§11.1)

---

## 12. 제약과 금지

| # | 내용 | 이유 |
|---|---|---|
| C1 | 법률 자문·계약서 법률 검토·분쟁 대응·채권 추심을 한다고 표기 금지 | 법인의 업무가 아님. 푸터 고지와 FAQ에 명시 |
| C2 | `hanabeomlaw.com` 언급·링크 금지 | 대표 개인 사업. 법인 사이트 범위 밖 |
| C3 | Teheranro AI Studio를 별도 회사처럼 표기 금지 | 법인의 브랜드. 계약·결제 주체는 (주)테오네 |
| C4 | 목업(`design/theo-ne-mockup.html`)에 없는 문구 임의 생성 금지 | 확정된 카피만 사용 |
| C5 | 언어 전환을 JS 텍스트 치환으로 구현 금지 | 크롤러가 한 언어만 보게 됨 |
| C6 | 기존 소유확인 토큰 제거 금지 | 이전 속성의 소유권이 만료됨 |

---

## 13. 배포 체크리스트

```
□ npm run typecheck
□ npm run build                    # 프리렌더·sitemap·llms.txt 생성 확인
□ npm run build:og                 # 문구가 바뀌었다면
□ npm run preview                  # localhost:4173, 데스크톱·390px·reduced-motion
□ node scripts/ai-search-audit.mjs http://localhost:4173   # ≥90
□ 브랜치 push → Vercel 미리보기에서 확인
□ main 병합 → 자동 배포
□ node scripts/ai-search-audit.mjs https://theo-ne.com     # 운영 재확인
□ npm run indexnow
□ Google Search Console 색인 요청 (IndexNow 미지원)
```

---

## 14. 현재 상태와 남은 과제

**운영 반영 완료** — 위 요구사항 전부. 감사 100/100.

**미해결**

| # | 내용 | 담당 |
|---|---|---|
| O1 | 미리보기 URL이 Vercel 인증으로 보호됨. 외부 공유 불가 | 대시보드 → Settings → Deployment Protection |
| O2 | 구글 색인 재요청 미실행 (내용 전면 개편됨) | Search Console |
| O3 | `trops.kr`·`teheranro-ai.com`이 theo-ne.com을 되받아 링크하지 않음. 엔티티 연결이 일방 주장 상태 | 각 사이트 정비 시 |
| O4 | `teheranro-ai.com`에 robots.txt·sitemap.xml·JSON-LD 없음 | 별도 작업 |
