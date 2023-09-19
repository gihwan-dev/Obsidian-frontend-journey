프론트엔드에서 규모있는 어플리케이션을 만들 때 폴더 구조를 정의하는 것 만큼 중요한게 없다는 생각이 들어 여러 기사를 찾아 발견한 meduim 글 정리

`src` 폴더: root 디렉토리
- `assets`
- `components`: 앱 전체에서 공유되는 모든 컴포넌트
- `hooks`: 앱 전체에서 공유되는 모든 hook 
- `config`: 앱 설정 파일
- `features`: 앱의 features를 포함하는 폴더. 이 폴더 안에 대부분의 앱 코드가 저장됨
- `layouts[next.js에선 불필요]`: 페이지를 위한 레이아웃
- `lib`: 앱에서 사용되는 써드 파티 라이브러리 설정 파일
- `pages[next.js에선 불필요]`: 앱의 페이지들
- `services`: provider나 services를 담는 폴더
- `stores`: 전역 state stores
- `test`: mocks, helpers, utilities, configurations를 위한 테스트 코드
- `types`: 공유되는 타입스크립트 타입
- `utils`: 공유되는 utility 함수들
> [!info] services는 애플리케이션의 핵심 비즈니스 로직이나 외부 API와의 통신, 데이터 변환, 유틸리티 함수 등의 기능을 의미한다.

## `utils` 와 `services` 의 차이점
1. **Services**:
	- **목적**: 애플리케이션의 핵심 비즈니스 로직이나 외부 API와의 통신, 데이터베이스 연산 등의 기능을 제공한다.
	- **특징**
		- 주로 외부 시스템이나 서비스와의 통신을 담당한다.
		- HTTP 요청, 데이터베이스 쿼리, 인증 및 인가와 같은 비즈리스 로직을 포함할 수 있다.
2. **Utils**:
	- **목적**: 애플리케이션 전반에 걸쳐 재사용될 수 있는 범용적인 함수나 유틸리티를 제공한다.
	- **특징**:
		- 상태나 외부 의존성 없이 독립적으로 동작하는 함수나 로직을 포함한다.
		- 애플리케이션의 핵심 로직과는 거리가 있을 수 있다.
	- **예시**:
		- 날짜 형식 변환 함수
		- 문자열 검증 유틸리티
		- 배열이나 객체를 처리하는 헬퍼 함수

루트 디렉터리에서 다음 코드를 실행한다.
```bash
mkdir -p src/{composables,layouts,utils,assets,config,lib,services,test,components,features,stores,types}
```

알아둬야할 세가지 중요한 점:
- **Pages** 폴더는 그 자체로 이미 모듈화 되어 있다. 중요한것은 페이지 안의 로직은 최소한으로 유지되어야 한다.
- 확장성과 유지보수를 위해 대부분의 코드를 `features` 폴더안에 위치시킨다. 모든 feature 폴더는 domain-specific 코드를 포함해야 한다.
- feature 폴더 안의 components, hooks, stores, services 등의 모든 것들은 공유되어서는 안된다. 
## Features Folder
앞서 언급한대로 앱의 대부분의 코드는 features 폴더안에 위치해야 한다.

![[Pasted image 20230914135239.png]]
- `api`: 모든 fetch 로직은 여기에 위치한다.
- `components`: 특정 feature의 컴포넌트들
- `hooks`: 특정 feature의 훅들
- `stores`: state managements 코드
- `types`: features에 특정되는 타입 정의
- `index.ts`: feature의 진입 포인트.  feature의 **public API**로 동작한다, 또한 이 파일은 어플리케이션에서 공개적으로 사용될 부분만 export 해야한다.

```
# Bad 🚫 🚫 🚫  
import { UserProfile } from '@/features/profile/components/UserProfile.vue'  
  
# Good ✅ ✅ ✅  
import { UserProfile } from '@/features/profile'
```

ESLint rule 추가를 통해 이를 강제할 수 있다.
```json
rules: {  
		'no-restricted-imports': [  
		'error',  
		{  
			patterns: ['@/features/*/*'],  
		},  
	],  
	'import/no-cycle': 'error',  
	...  
}
```

#Programming