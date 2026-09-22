# 방문 분석 관리자 페이지 — 설치 및 운영

**대상** https://theo-ne.com/admin/
**문서 상태** 2026-09-22 작성 · 배포 전 설정이 필요함

---

## 1. 무엇을 보여주는가

GA4 태그는 이미 붙어 있지만 집계만 보여 준다. 이 페이지는 그 아래 층,
**"어떤 방문자가 언제 어디서 들어와 무엇을 읽었는가"** 를 한 줄씩 보여준다.

| 항목 | 내용 |
| --- | --- |
| 방문자 수 | 세션(브라우저 탭) 기준 순 방문자, 페이지뷰, 평균 체류 시간 |
| 접속 위치 | 국가 · 도시 · 지역 · 방문자 시간대 (Vercel 엣지가 붙여 주는 헤더) |
| 시간 | 일별 추이, 시간대별 분포 (모두 한국 표준시 기준) |
| 확인한 정보 | 히어로 / 사업 영역 / 대표 소개 / FAQ / 연락처 **섹션별 실제 체류 시간** |
| 행동 | 이메일 · 링크드인 · TROPS · Teheranro AI 등 클릭한 링크 |
| 유입 경로 | 검색엔진, 외부 사이트, 직접 방문 |
| 환경 | 기기 / 브라우저 / OS / 언어(한국어·영어 페이지) |
| 봇 | AI 크롤러 트래픽을 따로 표시 (기본은 통계에서 제외, 체크박스로 포함) |

마지막 "최근 방문 기록" 목록은 한 줄을 펼치면 그 방문 한 건의 전체 맥락
— 시각, 위치, 기기, 유입 경로, 섹션별 체류 시간, 클릭 — 이 그대로 나온다.

## 2. 구조

```
방문자 브라우저
  └─ src/lib/analytics.ts      섹션 체류 시간·클릭을 모아 sendBeacon으로 전송
        │
        ▼
  POST /api/collect            위치·기기·봇 여부는 요청 헤더에서 서버가 직접 채움
        │
        ▼
  Supabase  theone_page_views  RLS 켜짐 + 정책 없음 → service_role 키만 접근 가능
        │
        ▼
  GET /api/admin/stats         세션 쿠키 검증 후 기간 집계
        │
        ▼
  /admin/  (public/admin/)     빌드에 포함되지 않는 정적 페이지 + 바닐라 JS
```

관리자 페이지를 React 앱에 넣지 않은 이유: 랜딩 페이지 번들에 한 사람만
여는 대시보드 코드가 실려 나갈 이유가 없고, 이 사이트의 성공 기준(크롤러가
읽는 정적 HTML)과도 무관하기 때문이다.

### 개인정보

- 쿠키를 쓰지 않는다. 방문 식별자는 탭을 닫으면 사라지는 `sessionStorage` 값이다.
- **원시 IP는 저장하지 않는다.** 솔트를 섞은 HMAC 해시만 남으므로 DB가 유출돼도
  IP를 역산할 수 없다. 이 해시는 로그인 횟수 제한에만 쓰인다.
- 보관 기간은 400일이며, 수집 요청 100건 중 1건꼴로 `prune_analytics()` 가
  오래된 행을 지운다. 별도 크론이 필요 없다.

## 3. 설치 (한 번만)

### 3.1 Supabase 프로젝트

사용 중인 프로젝트는 이미 정해져 있다.

| 항목 | 값 |
| --- | --- |
| 프로젝트 | `pp_a` (`kimusrivsubyghfhrwng`) |
| 리전 | `ap-northeast-2` (서울) |
| 대시보드 | https://supabase.com/dashboard/project/kimusrivsubyghfhrwng |
| `SUPABASE_URL` | `https://kimusrivsubyghfhrwng.supabase.co` |

**이 프로젝트는 다른 애플리케이션과 함께 쓰고 있다.** 그래서 이 기능이 만드는
DB 객체는 전부 `theone_` 접두사를 달고 있다 (`theone_page_views`,
`theone_admin_login_attempts`, `theone_prune_analytics()`). 접두사가 없으면
다른 앱의 `page_views` 와 이름이 겹쳤을 때 `create table if not exists` 가
조용히 넘어가고, 엉뚱한 컬럼에 insert 하다 실패하게 된다.

스키마를 적용하는 방법은 둘 중 하나다.

- **대시보드**: SQL Editor 에 `supabase/migrations/20260922000000_visit_analytics.sql`
  전체를 붙여넣고 **Run**. (멱등이라 여러 번 실행해도 안전하다.)
- **CLI**: `supabase link --project-ref kimusrivsubyghfhrwng` 후 `supabase db push`.
  DB 비밀번호를 묻는다.

그다음 **Project Settings → API Keys** 에서 `service_role` 키를 복사한다.
(`anon` 키가 아니다. service_role 키는 RLS를 우회하므로 절대 공개하면 안 된다.)

### 3.2 Vercel 환경변수

Vercel → 프로젝트 → **Settings → Environment Variables** 에 아래 5개를
**Production, Preview, Development 모두 체크**해서 넣는다.

| 이름 | 값 |
| --- | --- |
| `SUPABASE_URL` | `https://kimusrivsubyghfhrwng.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | 3.1에서 복사한 service_role 키 |
| `ADMIN_USERNAME` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | `scrypt$...` 형식의 해시 (3.3 참고) |
| `ADMIN_SESSION_SECRET` | 64자리 hex 난수 |
| `ANALYTICS_EXCLUDE_IPS` | (선택) 기록에서 뺄 IP. 쉼표/공백 구분 |

환경변수를 넣은 뒤에는 **재배포해야 반영된다** (Deployments → 최신 배포 → Redeploy).

### 3.3 아이디·비밀번호 바꾸기

비밀번호는 평문으로 저장하지 않는다. 아래를 실행하면 새 비밀번호와 그에 맞는
해시가 함께 나오고, 해시만 Vercel에 넣으면 된다.

```bash
node -e '
const c = require("node:crypto");
const A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const pick = (n) => Array.from(c.randomBytes(n)).map((b) => A[b % A.length]).join("");
const pw = `${pick(5)}-${pick(5)}-${pick(5)}`;
const salt = c.randomBytes(16);
const hash = c.scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1 });
console.log("비밀번호 (이 값만 따로 보관):", pw);
console.log("ADMIN_PASSWORD_HASH=scrypt$" + salt.toString("hex") + "$" + hash.toString("hex"));
console.log("ADMIN_SESSION_SECRET=" + c.randomBytes(32).toString("hex"));
'
```

`ADMIN_SESSION_SECRET` 을 바꾸면 기존 로그인 세션이 모두 끊기고, 이후 저장되는
IP 해시도 이전 값과 달라진다(과거 데이터는 그대로 남는다).

## 4. 내 방문 빼기

운영자 본인의 접속이 대시보드에 쌓이면 정작 봐야 할 소수의 진짜 방문이 묻힌다.
두 장치가 겹쳐서 막는다.

### 4.1 브라우저별 스위치 (주 수단)

대시보드 상단의 **"내 방문 기록 안 함"** 체크박스를 켠다. `localStorage` 에
플래그를 남기고, 랜딩 페이지 수집기가 그 값을 보고 아예 뜨지 않는다. 관리자
페이지와 랜딩 페이지가 같은 오리진이라 한 번만 켜면 둘 다 적용된다.

로그인하기 번거로운 기기(휴대폰 등)에서는 주소로도 된다.

- `https://theo-ne.com/?no-track` — 이 브라우저를 영구히 제외
- `https://theo-ne.com/?track` — 제외 해제

**기기마다 한 번씩** 해야 한다. IP가 바뀌어도 유지되므로 이쪽이 근본 수단이다.
브라우저 저장소를 지우면 함께 지워진다.

### 4.2 IP 제외 (보조)

`ANALYTICS_EXCLUDE_IPS` 에 든 주소에서 온 요청은 서버가 저장하지 않는다.
새 기기를 집어 들어도 설정 없이 바로 빠지는 게 장점이다.

단점은 **가정용 회선의 공인 IP가 바뀐다**는 것. 바뀌면 (a) 내 접속이 다시
기록되고, (b) 그 IP를 넘겨받은 남의 접속이 대신 빠진다. 그래서 이쪽은 보조이고,
4.1을 기기마다 켜 두는 편이 낫다. IP가 바뀌었다면 Vercel 환경변수를 고치고
재배포한다.

## 5. 사용

- 주소: `https://theo-ne.com/admin/`
- 로그인 세션은 12시간 유지된다. 쿠키는 HttpOnly · Secure · SameSite=Strict 이다.
- 같은 IP에서 15분 안에 8번 실패하면 15분간 잠긴다.
- 상단에서 기간(오늘 / 7일 / 30일 / 90일 / 1년)과 봇 포함 여부를 고른다.

## 6. 알아둘 점

- **`vercel.json` 의 `/admin` 헤더 규칙이 두 개인 이유.** `/admin/:path*` 한 줄로는
  `/admin/` 이 매칭되지 않는다. 꼬리 슬래시가 빈 세그먼트를 남기는데 반복 그룹이
  그걸 소비하지 못하기 때문이다. 정작 사람이 여는 주소가 `/admin/` 이므로
  `/admin` 과 `/admin/(.*)` 두 규칙으로 나눠 두었다. 규칙을 합치려 할 때
  `curl -sI https://theo-ne.com/admin/ | grep x-robots` 로 반드시 확인할 것.

- **내 방문은 4장의 방법으로 뺀다.** 설정 전에 쌓인 기록은 그대로 남는다.
- **로컬 개발 트래픽은 수집되지 않는다.** `localhost` 에서는 수집기가 아예 뜨지
  않으므로, 화면을 확인하려면 배포된 주소로 접속해야 한다.
- **섹션 체류 시간은 화면에 40% 이상 들어와 있던 시간**의 합이다. 0.8초 미만은
  스쳐 지나간 것으로 보고 버린다.
- 위치 정보는 Vercel 엣지 헤더에서 오므로 `vercel dev` 로컬 실행 시에는 비어 있다.
- 한 번에 집계하는 이벤트 상한은 3만 건이다. 넘으면 최신 3만 건만 보며,
  대시보드 상단에 그 사실이 표시된다.
- GA4(`G-G022YZ9172`)는 그대로 둔다. 두 계측은 서로 독립적이며, 한쪽이
  광고 차단기에 막혀도 다른 쪽은 남는다.
