# Notion Project 
## Used only HTML & CSS & Typescript

<a href="https://minqan.github.io/typescript-notion-project/">데모 링크</a>

* 각 컴포넌트를 Typescript로만 구현하여 컨텐츠 추가 및 삭제 기능 구현.
* 클래스형 상속 및 인터페이스 사용을 통해 코드 재사용성 극대화.
* 각 메뉴별 Section내에서 드래그 앤 드롭 기능을 추가하여 재정렬 가능하게 구현. (버블링 이슈 해결: pointer-event: none 사용)
* 다이어로그의 인풋창을 url을 받는 Photo & Youtube과 text를 받는 Memo & Todo로 두개의 컴포넌트로 나눠서 Input type만들어 코드 중복 줄임. 또한 들어오는 메뉴 타입에 따라 placeholder 안내 문구 다르게 작성.
* 기존의 메뉴와 관련된 컨텐츠가 있다면 해당 섹션에 추가되고 별도로 추가 되지 않도록 설정 및 섹션의 컨텐츠가 0개가 될 시 메뉴 관련 섹션 삭제.
* 컨텐츠가 1개일 경우, 2개일 경우, 혹은 그 이상에 따라 컨텐츠의 크기가 다르도록 flex활용.
* 모바일 사이즈 반응형 가능하도록 미디어쿼리 사용.

