S-표현식(S-expressions, Symbolic Expressions)은 주로 Lisp 계열의 프로그래밍 언어에서 사용되는 표기법으로, 중첩된 리스트 데이터 구조를 표현하는 데 사용됩니다. S-표현식은 코드와 데이터를 모두 나타내는 데 사용됩니다. 다음은 S-표현식의 주요 특징입니다:

1. **문법**: S-표현식은 매우 간단하고 일관된 문법을 사용합니다. S-표현식은 원자(atom)와 리스트(list)로 구성됩니다.
   - **원자**: 기호(식별자), 숫자 또는 기타 기본 데이터 타입을 나타냅니다.
   - **리스트**: 괄호로 묶여 있으며, 원자나 다른 리스트를 포함할 수 있습니다. 리스트는 S-표현식의 주요 구조입니다.

2. **표현 방식**: S-표현식은 재귀적으로 정의될 수 있습니다.
   - 원자 또는
   - S-표현식의 리스트.

3. **예시**:
   - 원자: `42`, `hello`, `+`
   - 리스트: `(add 2 3)`, `(+ 2 3)`

4. **사용 사례**:
   - **코드 표현**: Lisp 및 유사한 언어에서는 코드 자체가 S-표현식으로 작성됩니다. 예를 들어, 함수 호출이나 수학 연산은 리스트로 표현되며, 첫 번째 요소는 함수나 연산자, 나머지 요소는 인자입니다. 예를 들어, 두 숫자를 더하는 것은 `(+ 2 3)`로 작성됩니다.
   - **데이터 표현**: S-표현식은 중첩된 데이터 구조를 표현하는 데에도 사용될 수 있습니다. 예를 들어, 트리 구조는 중첩된 리스트로 표현될 수 있습니다.

5. **WebAssembly 텍스트 형식(wat)에서의 예시**:
   - WebAssembly 텍스트 형식에서는 S-표현식을 사용하여 모듈, 함수 등의 구조를 정의합니다. 예를 들어:
     ```wat
     (module
       (func $add (param $a i32) (param $b i32) (result i32)
         (i32.add
           (get_local $a)
           (get_local $b)
         )
       )
     )
     ```
   - 이 예시에서 `module`과 `func` 구성 요소는 리스트이며, 함수 내의 매개변수와 연산도 중첩된 리스트로 표현됩니다.

S-표현식은 코드와 데이터를 표현하는 간단하고 일관된 방법을 제공하기 때문에 Lisp과 같은 언어 및 WebAssembly 텍스트 형식에서 사용됩니다.