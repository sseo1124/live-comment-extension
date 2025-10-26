# LiveComment

생성일: 2025년 9월 18일 오전 11:12
태그: FINAL
최종 편집 일시: 2025년 10월 26일 오후 8:14

## 개요

**배포된 웹사이트에서 피드백 및 검수 협업 툴**

웹사이트 외주 제작 시, 비개발자 고객이 피드백을 전달하기 위해 스크린샷을 찍어 문서로 정리하는 비효율적인 커뮤니케이션 문제를 해결합니다. 고객이 리뷰 중인 배포된 웹사이트 화면에 직접 메모(댓글)를 남겨서 직관적으로 피드백을 작성하고 공유할 수 있는 협업툴 입니다.

## 핵심 기능

- **사이드 패널 로그인 및 프로젝트 선택**
  - 이메일과 비밀번호를 입력하여 API 서버에 로그인하면 액세스 토큰을 발급받고 브라우저 저장소에 저장합니다.
  - 로그인 후 사용자가 속한 프로젝트 목록을 불러와서 선택할 수 있으며, 프로젝트에 속하지 않은 경우 안내 메시지를 표시합니다.
- **페이지별 룸 생성 및 입장**
  - 사용자가 프로젝트를 선택하면 현재 활성 탭의 URL을 기반으로 서버에 **룸(room) 요청**을 보냅니다. 존재하지 않으면 생성하고, 이미 존재하면 해당 룸의 ID를 반환합니다.
  - "참여하기" 버튼을 클릭하면 콘텐츠 스크립트에 `JOIN_ROOM` 메시지가 전송되어 페이지에 댓글 UI가 삽입됩니다.
- **실시간 댓글 작성과 표시**
  - 콘텐츠 스크립트는 [Socket.IO](http://Socket.IO)를 통해 서버에 접속하여 룸에 참여하고, 다른 사용자가 작성한 댓글을 실시간으로 수신합니다.
  - 댓글 작성 시에는 입력 내용을 즉시 UI에 표시한 뒤 서버에 전송하고, 실패할 경우 롤백하여 사용자에게 오류를 알립니다.
  - 손쉬운 인터페이스로 댓글 목록을 확인하고, 텍스트 입력창을 통해 새 댓글을 작성할 수 있습니다
- **플로팅 툴바와 커서 표시**
  - 페이지 하단에는 **플로팅 툴바**가 나타나 댓글 추가 모드, 팔레트 모드, 목록 모드를 전환할 수 있습니다.
  - '추가' 모드에서는 커서가 십자 모양으로 변경되고, 원하는 위치를 클릭하면 댓글 UI가 고정됩니다.

## 시스템 아키텍처

아래 다이어그램은 Live Comment 확장의 전체 흐름을 보여줍니다. 왼쪽에서 사용자가 사이드 패널을 통해 로그인하고 프로젝트를 선택하면 API 서버로 요청을 보내고, 서버는 페이지 URL에 대한 룸 ID를 반환합니다. 이후 확장은 콘텐츠 스크립트에 **JOIN_ROOM** 메시지를 보내 페이지에 UI를 삽입하고 [Socket.IO](http://Socket.IO) 서버에 연결합니다.

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/b684e574-c180-4084-a6c2-3f366acd8b88" />

## 기술적 제약과 해결 방향

### 문제 상황

"리액트 컴포넌트는 잘 렌더되는데, **Slate 에디터만** 콘텐츠 스크립트에서 보이지 않는다."

### 근본 원인

콘텐츠 스크립트는 **Isolated World(별도 Realm)** 에서 실행됩니다. Slate는 내부적으로 `Selection`, `Range`, `Node` 같은 **브라우저 내장 객체**의 `instanceof` 및 DOM 매핑을 엄격히 검사합니다.

페이지 월드와 콘텐츠 스크립트 월드의 객체는 **서로 다른 생성자(Realm 불일치)** 로 인식되어 Slate 내부 가드가 실패 → **렌더 에러**로 이어집니다. 반면 일반 리액트 컴포넌트는 이런 검사에 의존하지 않으므로 정상 렌더됩니다. 팝업/옵션 페이지처럼 **단일 Realm**에서는 Slate가 정상 동작합니다.

### 대안 비교

1. **메인 월드로 주입**
   - 방법: `<script>` 태그로 페이지에 라이브러리/부트스트랩 코드를 삽입해 **페이지 Realm에서 Slate**를 실행.
   - 장점: Slate 그대로 사용 가능.
   - 단점: 보안 검토 필요(페이지와 동일 권한), 리소스 관리·양방향 메시징 복잡, 호스트 페이지와 CSS 충돌 리스크.
2. **콘텐츠 스크립트 유지 + 커스텀 리치 텍스트 에디터** **(선택)**
   - 방법: Slate 의존 제거, Realm 불일치 유발 API를 회피하는 **경량 리치 텍스트 에디터** 구현.
   - 장점: 보안·격리 이점 유지, 주입 복잡성↓, 성능 예측 가능, 협업 기능(커서/스레드) 통합 용이.
   - 단점: 고급 편집 기능은 점진구현 필요(마크다운·단축키·리스트·인라인/블럭 포맷 등).

**선택: 커스텀 리치 텍스트 에디터**

위 리스크를 고려해 **2) 콘텐츠 스크립트 유지 + 커스텀 리치 텍스트 에디터**를 채택했습니다. 목표는 **확장 환경에서의 호환성·안정성**과 **협업 기능 통합의 단순화**입니다.

### 구현 상세(기술적으로 어떻게 해결했는가)

**1) UI 마운트 전략: ShadowRoot + React**

- 콘텐츠 스크립트에서 `createShadowRootUi`로 **Shadow DOM** 컨테이너 생성 후 리액트 마운트
- 페이지 CSS 간섭 차단, 정리(unmount) 안전성 확보
- 구현: `entrypoints/content/index.tsx`

  ```tsx
  export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "ui",
    async main(ctx) {
      browser.runtime.onMessage.addListener(async (msg) => {
        if (msg?.type !== "JOIN_ROOM") return;
        const { projectId, roomId, accessToken } = msg.payload;

        const ui = await createShadowRootUi(ctx, {
          name: "livecomment-ui",
          position: "inline",
          anchor: "body",
          append: "first",
          onMount: (container) => {
            /* React root mount */
          },
          onRemove: (els) => {
            els?.root.unmount();
            els?.wrapper.remove();
          },
        });

        ui.mount();
      });
    },
  });
  ```

**2) 메시징과 Room 합류**

- 사이드패널 → 콘텐츠 스크립트: `JOIN_ROOM` 메시지
- 콘텐츠 스크립트: 오버레이 UI 마운트 후 소켓 연결 및 `join_room` emit
- 구현: `components/sidepanel/RoomEntrance.tsx`, `entrypoints/content/App.tsx`

  ```tsx
  // sidepanel → content
  await browser.tabs.sendMessage([activeTab.id](http://activeTab.id), {
    type: "JOIN_ROOM",
    payload: { projectId, accessToken, roomId },
  });

  // content socket connect
  const socket = io(import.meta.env.WXT_API_URL, {
    extraHeaders: { authorization: `bearer ${accessToken}` },
  });
  socket.emit("join_room", { roomId }, (ack) => { /* setJoined / setErr */ });

  ```

**3) 커스텀 리치 텍스트 에디터 설계 핵심**

- **브라우저 Selection/Range** 직접 의존 최소화(Realm 민감 API 회피)
- 입력: 기본 `<input>` 또는 contenteditable 단위로 최소 기능부터(엔터, 기본 서식)
- 키 바인딩: Bold/Italic 등은 명령 시스템(예: `execCommand` 대체, 자체 상태 머신)으로 확장
- 스타일/레이아웃: Tailwind + Shadow DOM으로 **호스트 스타일 격리**

**4) 보안·설정**

- 인증: `Authorization: Bearer <token>` 헤더
- 설정: `WXT_API_URL`(API·소켓 베이스 URL), `web_accessible_resources` 최소화
- 정리: UI 제거 시 React unmount + DOM cleanup 보장
