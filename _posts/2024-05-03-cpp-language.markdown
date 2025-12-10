---
layout: post
title:  "C++ 강의북"
date:   2024-05-03 17:00:00 +0900
categories: lang
---


> 이 책은 다양한 책과 개인의 지식으로 작성되었으며, *Professional C++, 5th Edition* by Marc Gregoire 의 책의 내용을 가장 많이 참고하였습니다. (클래스부터는 사실 거의 번역요약본과 같습니다)

C++는 C언어에 객체 지향 프로그래밍과 템플릿을 이용한 일반화 프로그래밍을 추가하여 만들어진 언어로 C언어를 유지하면서 확장한 것입니다. 이 강의는 [C언어](https://velog.io/@termsigening97/C%EC%96%B8%EC%96%B4-%EC%B4%9D%EC%A0%95%EB%A6%AC) 를 알고 있다는 가정 하에 이루어지며, 실제로 문법 또한 동일합니다. 하지만 프로그래밍 언어가 익숙하다면 요약정리노트처럼 활용할 수도 있습니다.

- - -

# 시작하기

원하는 IDE (Visual Studio 등) 로 작업하시면 되며, Visual Studio를 사용하는 경우는 C언어와 방식이 같습니다.

준비가 되셨다면, 첫 코드를 작성하며 시작해 봅시다!

```cpp
#include <iostream>
using namespace std;

int main()
{
    cout << "Hello, World! \n"
         << "There are 2 ways to make a newline:"
         << endl << "using \'endl\'";
    return 0;
}
```

코드를 실행하면, 컴파일러가 코드를 기계어(011010110...)로 변환시켜주고, 링크(link) 작업을 한 후에 프로그램 파일이 만들어져 실행됩니다.

이 위는 "Hello, World!" 를 출력하는 코드이며 C언어와의 차이점은 다음과 같습니다.

## 확장자

C++에선 입출력을 위해 `<iostream>` 를 사용하며, C언어 헤더파일도 사용할 수 있으며 `<stdio.h>` 도 대체된 `<cstdio>` 가 존재합니다. 기본적으로 C 라이브러리의 이름 앞에 c를 붙이고 .h를 없애면 C++ 버전의 C 라이브러리를 사용 가능합니다. 

주로 C++ 구현 파일의 확장자는 .cpp와 .cc가 있고, 헤더 파일의 확장자는 .h, .hpp, .hh가 존재하는데 여기서 .hh는 헤더 파일이 C++에만 있는 문법을 포함했을 경우를 나타내고 .hpp는 헤더 파일에 구현도 포함되어 있음을 나타냅니다. 그리고 위에서 보았듯이 `<iostream>`과 같은 표준 라이브러리의 헤더는 확장자가 없습니다.

## 네임스페이스

namespace(네임스페이스)는 이름 공간이라고 하며, 같은 이름의 함수라도 네임스페이스가 다르면 다른 함수로 취급될 수 있도록 해줍니다. 예를들어 A와 B라는 네임스페이스 안에 foo()가 있다고 하면, 다음과 같이 호출할 수 있습니다.
```cpp
A::foo();
B::foo(); // 서로 다른 함수입니다
```
cin과 cout은 사실 std라는 네임스페이스 안에 있으며, 네임스페이스를 명시해준다면 `std::cin` 와 같이 사용됩니다. 하지만 매번 네임스페이스를 명시하는 것은 불편하기 때문에, 위에 `using namespace <이름>` 을 해놓으면 해당 네임스페이스는 생략할 수 있습니다.

또한 `using std::cout;` 과 같이 특정 항목만 가져올 수도 있습니다.

> 모든 C++ STL(Standard Library, 표준 라이브러리) 와 C++ 스타일의 C 표준 라이브러리(예: `<cstdio>`) 의 경우 `std` 네임스페이스 혹은 그 하위 네임스페이스 안에 모든 코드가 들어가 있으며, `.h` 가 붙은 C 스타일의 표준 라이브러리는 네임스페이스에 들어가 있지 않습니다.

> 절대 using을 전역적인 헤더파일에 사용하지 마세요. 해당 헤더파일을 가져온 코드마다 강제로 using을 사용하게 됩니다. 헤더파일이라도 네임스페이스 안이나 클래스 안처럼 더 작은 범위에서는 괜찮습니다.

### 중첩Nested 네임스페이스

다음과 같이 네임스페이스 안의 네임스페이스를 정의할 수 있습니다.

```cpp
namespace MyLib::Utility::Math {
  /* ... */
}
```

C++17 이후에만 작동하며, C++17 이전의 경우 다음과 같이 작성해야합니다.

```cpp
namespace MyLib {
  namespace Utility {
    namespace Math {
      /* ... */
    }
  }
}
```

## 네임스페이스 별명Alias

다음과 같이 네임스페이스 이름의 별명을 지어줄 수 있습니다.

```cpp
namespace MyMath = MyLib::Utility::Math;
```

## 입/출력 스트림

C의 printf와 scanf 또한 사용할 수 있지만, C++에서는 cout으로 출력을 하고 cin으로 입력을 받을 수 있습니다.
변수 2개를 입력받고 덧셈 결과를 출력하는 코드를 예시로 들어보겠습니다.
```cpp
#include <iostream>
using namespace std;

int main()
{
    int A, B;

    cin >> A >> B;

    cout << A << " + " << B << " = " << A + B;

    return 0;
}
```
\>\> 를 이용하여 입력 스트림에서 입력을 받고, \<\< 를 이용하여 출력 스트림에 출력을 합니다.

### endl

endl은 '\n'과 동일한 기능을 하지만 다른점은 줄바꿈을 수행한 뒤 현재 버퍼를 비웁(flush)니다. 그래서 반복문 등에서 사용하는 것은 성능에 문제가 될 수 있기 때문에 추천하지 않습니다. 

### 주석(Comment)

// 로 한 줄의 주석을 작성할 수 있고,
/* */ 로 여러 줄의 주석을 작성할 수 있습니다.

```cpp
// 한 줄의 주석

/*
여러 줄의 주석
*/
```

## 모듈

**C++ 20** 부터는 헤더 파일을 대체하기 위한 모듈(module)의 지원이 추가되어서, 전처리기인 #include를 사용하지 않고, import 선언으로 모듈을 가져올 수 있습니다.

```cpp
import <iostream>;
using namespace std;

int main()
{
    cout << "Welcome to the C++20";
    return 0;
}
```

C++에서의 프로그램 빌드는 3단계로 이루어지는데, 우선 **전처리기**preprocessor를 통해 메타정보를 읽어오고, **컴파일**compile되어 기계어로 번역되고(오브젝트 파일 생성), 각각의 오브젝트 파일들이 **링크**link되어 하나의 프로그램이 됩니다.

코드에서 전처리기 명령을 지시할 때는 \#가 사용되며, 예를들어 `#include <iostream>` 에서 \#include는 \<iostream\>에서 모든 내용을 읽어와 현재 파일에서 사용할 수 있게 전처리기에 지시한다는 뜻입니다. \<iostream\>은 헤더 파일로써 입/출력(Input/Output)이 정의가 되어있습니다.

그래서 보통 헤더 파일`(.h)`에는 함수를 선언하고 소스 파일`(.cpp)`에 함수 정의(코드 구현)을 하는 형식으로 구현하였습니다. 하지만 모듈을 사용하면 더이상 선언과 구현을 분리할 필요가 없습니다.

> C언어 라이브러리는 import로 가져올 수 있음이 보장되어있지 않기 때문에, #include를 사용하는 것을 권장합니다.

- - -

# 기초 문법

C++의 기초 문법들을 알아보도록 하겠습니다.

## 변수

C++는 C와 같이 타입 제약이 엄격한(Strongly-Typed) 언어로, 모든 변수에는 타입이 있고 한번 정해진 타입은 절대 변하지 않습니다.

변수는 값을 저장하기 위한 공간의 이름이며, 좀 더 정확히 말하면 메모리 상에 값이 저장되어 있는 주소를 가리키는 식별자라고 할 수 있습니다. 변수를 선언하는 방법은 다음과 같습니다.

`<자료형> <변수 이름>`

선언만 할 경우, 해당 변수는 아무 값도 가지고 있지 않아 사용하려면 오류가 발생하기 때문에 꼭 초기화를 해주어야 합니다.

```cpp
int a = 5;
int b { 5 };
```

a의 경우 대입assignment 연산자로 초기화되었으며, b는 유니폼 초기화(Uniform Initialization) 문법으로 초기화 되었습니다. 유니폼 초기화는 C++11에 생겼으며 권장되는 초기화 방법입니다.

만약 `int b {}` 와 같이 값을 비워주면 0을 적은 것으로 간주됩니다.

### 자료형

C++의 기본 타입인 내장 타입Intrinsic Type 들은 다음과 같이 존재합니다.

<table>
  <tr>
    <td rowspan="4">정수형</td>
    <td>short</td>
    <td>좁은 범위의 정수형</td>
  </tr>
  <tr>
    <td>int</td>
    <td>short보다 넓거나 같은 정수</td>
  </tr>
  <tr>
    <td>long</td>
    <td>int보다 넓거나 같은 정수</td>
  </tr>
  <tr>
    <td>long long</td>
    <td>long보다 넓거나 같은 정수</td>
  </tr>
  <tr>
    <td rowspan="3">부동소수점형</td>
    <td>float</td>
    <td>단일정밀도 부동소수점</td>
  </tr>
  <tr>
    <td>double</td>
    <td>복수정밀도 부동소수점</td>
  </tr>
  <tr>
    <td>long double</td>
    <td>큰 범위의 부동소수점</td>
  </tr>
  <tr>
    <td>문자형</td>
    <td>char</td>
    <td>일반적으로 8비트, 문자 혹은 숫자</td>
  </tr>
  <tr>
    <td>논리형</td>
    <td>bool</td>
    <td>true 혹은 false</td>
  </tr>
</table>

여기서 정확히 몇 바이트라고 확정짓지 않은 이유는, 구현에 따라 int가 16, 32, 64비트가 될 수 있기 때문입니다. 하지만 무조건 이전의 자료형보다는 같거나 큰 범위를 지니고 있습니다.

일반적으로 short는 2바이트(16비트), int는 4바이트, long은 4바이트, long long은 8바이트입니다.

자료형 앞에는 **signed** 와 **unsigned** 라는 키워드가 붙을 수 있으며, 이는 각각 "부호 있는" 과 "부호 없는" 을 나타냅니다. 기본적으로 부호가 존재하기 때문에 signed는 적어도 아무 의미가 없으나 `unsigned char` 와 같이 unsigned를 사용하면 음수를 나타내지 못하는 대신 저장할 수 있는 값의 범위가 2배로 늘어나 -128~127(signed) 인 char 범위가 0~255(unsigned) 로 바뀌게 됩니다. 만약 자료형 없이 `unsigned`와 같이 키워드만 사용했다면 기본적으로 int형입니다.

부동소수점의 경우 일반적으로 float는 32비트, double은 64비트, long double은 80비트입니다.

C++에서 문자는 작은 따옴표(') 로 나타내고 문자열은 큰 따옴표(") 로 나타냅니다.

문자를 나타낼 때, `char8_t`과 C++20부터 `char16_t` `char32_t` 타입이 존재하는데, n-비트 UTF-n 인코딩된 유니코드 문자를 저장할 때 사용됩니다. 문자 리터럴 앞에 u8, u, U를 붙여 각각 8/16/32비트 유니코드 표현이 가능합니다.

논리형은 true나 false라는 값만 저장할 수 있는 타입으로써 말그대로 논리값을 표현할 때 쓰입니다.

> 변수는 일반적으로 처음 사용하기 직전에 선언하는 것이 좋습니다. 코드의 가독성을 높이고, 컴파일러가 중첩된 범위에서 메모리를 더 효율적으로 사용하게 해줍니다.

C++ 11부터는 변수의 타입을 추론할 수 있으며, 다음과 같이 사용합니다.

`auto num = 10;`

오른쪽 값의 타입이 int이기에 num의 타입은 int로 컴파일 시간에 정해집니다. 즉, 한번 정해진 타입이 나중에 바뀌지는 않습니다.

### 상수

상수는 문법적으로 값을 바꿀 수 없는 속성을 가진 특별한 변수이며 `constant` 키워드를 붙여서 선언할 수 있습니다.

`const int a = 10;`

상수는 변경할 수 없기 때문에 반드시 선언과 동시에 초기화되어야 합니다. 상수의 특징으로 컴파일 시간에 값을 알 수 있다는 장점이 있어 최적화에 사용될 수 있습니다.

### 리터럴

리터럴(literal)은 3.14, 10과 같은 바꿀수 없는 값들을 의미하며 리터럴에도 타입이 있어서 정수는 자릿수에 따라 int/long/unsigned long 타입으로 취급하고 소수/지수는 double 타입으로 취급합니다. 만약 이 외에 다른 타입의 리터럴을 입력하고 싶다면 접미사를 추가하면 됩니다.

| 리터럴 | 타입          |
|--------|---------------|
| 2      | int           |
| 2u     | unsigned      |
| 2l     | long          |
| 2ul    | unsigned long |
| 2.0    | double        |
| 2.0f   | float         |
| 2.0l   | long double   |

대부분의 자료형들은 서로 자동으로(암묵적/묵시적) 형변환(캐스팅, Casting)되기 때문에 명시적(Coercion)으로 적을 필요는 없습니다.

또한 숫자 앞에 0을 붙여 8진수를 적거나 0x/0X를 붙여 16진수를 적을 수 있으며, C++14부터 0b/0B를 붙여 2진수로 나타낼 수 있습니다.

또한, C++14부터 긴 숫자를 보기 쉽게 표기하려할 때 따옴표로 나누어서 표기할 수 있게 되었습니다.

`1'234'567'890`

"Hello, World!" 또한 값을 변경할 수 없는 "말 그대로인(리터럴)" 값이기 때문에 리터럴입니다.

### 범위(Scope)

* 전역 정의

모든 함수 바깥에서 선언하는 것을 의미하며, 이곳에 선언된 변수는 전역 변수로 불리며 모든 코드, 어떤 함수 안에서든지 참조 가능합니다. 하지만 전역 변수는 **절대로** 사용하지 말아야 합니다. 알고리즘 풀이 등 간단한 프로젝트에는 잠깐 사용될 수 있겠으나, 규모가 커질수록 전역 변수에 의한 사이드 이펙트Side Effect가 커지게 됩니다. 단, 상수와 같이 값을 변경할 일이 없는 경우는 괜찮습니다.

* 지역 정의

중괄호 `{ }` 안에 선언하는것을 의미하며, 특정 중괄호 안에 선언된 변수는 그 중괄호 안에서만 사용될 수 있습니다.

```cpp
int main() {
  {
    int num = 10;
  }
  cout << num; // 에러 발생: num이 선언되어있지 않음
}
```

또한, 같은 이름의 변수라도 서로 다른 범위에 존재한다면 변수를 사용할 때 안쪽 범위의 변수가 사용됩니다. 이를 단, 같은 범위에 같은 이름의 변수를 두 개 이상 선언할 수는 없습니다.

```cpp
int main() {
  int a = 10;
  {
    cout << "a1 : " << a << '\n';
    int a = 20;
    cout << "a2 : " << a << '\n';
  }
  cout << "a1 : " << a << '\n';
}
```

* static 키워드

일반적으로 변수는 자신의 범위(Scope)을 벗어나면 사라지지만, static 변수는 프로그램이 실행될 때 **단 한 번만** 초기화되며 프로그램이 끝날 때 사라집니다. 물론 범위 내에서만 접근할 수 있지만, 프로그램 실행 중에 메모리에 계속 남아있게 됩니다.

- - -

## 연산자

### 산술 연산자

| 연산      | 표현식   |
|-----------|----------|
| 덧셈      | x + y    |
| 뺄셈      | x - y    |
| 곱셈      | x * y    |
| 나눗셈    | x / y    |
| 나머지    | x % y    |
| 후위 증감 | x++, x\-\- |
| 전위 증감 | ++x, \-\-x |
| 부호      | +x, -x   |

덧셈, 뺄셈, 곱셈은 말 그대로이며 나눗셈 `/`의 경우 두 인자가 모두 정수형이라면 소수 부분이 버려지고, 나머지 연산자 `%`의 경우 정수 나눗셈의 나머지이기에 두 인자가 모두 정수형이어야 합니다.
 
증감 연산자는 1을 더하거나 빼주는 연산자이며, 후위형의 경우 우선순위가 제일 낮으며 전위형의 경우 우선순위가 제일 높습니다.

```cpp
int x = 0;

cout << x++ << '\n'; // 결과: 0

cout << x << '\n'; // 결과: 1

cout << ++x << '\n'; // 결과: 2

cout << x << '\n'; // 결과: 2
```

하지만 수식에서의 증감연산자 사용은 자제하여 x + 1과 같이 대체하고 증감연산자는 분리해서 작성하는 것이 좋습니다. 그래야 읽는 사람들이 이해하기 쉽고 컴파일러가 최적화기도 쉽기 때문입니다.
또한, `v[i] = i++;` 와 같은 사이드 이펙트(동일한 입력에 다른 결과가 나올 수 있음)를 지닌 코드를 작성할 수도 있기 때문에 주의해야 합니다. 방금의 예시 코드는 "정의되지 않은 동작" 으로 컴퓨터 환경에 따라 v[i] 에 i의 값이 들어갈 수도 있고, v[i+1]에 i의 값이 들어갈 수도 있습니다.
이는
```cpp
v[i] = i;
i++;
```
과 같이 분리해서 작성하는 것이 타당합니다. 코드의 양을 줄이기 보다는, 가독성이 좋고 복잡도를 감소시키기 위해 관심사를 분리하는것이 좋습니다.

### 형변환

리터럴에서 설명됐었듯, 대부분의 자료형들은 상호간에 자동으로 형변환이 이루어집니다. 하지만 연산자를 사용할 때에는 일정한 규칙이 있는데, C++은 가능하다면 정보가 손실되지 않도록 값을 변환합니다. 간단하게는 "작은 타입에서 더 큰 타입, 정수 타입에서 부동소수점 타입으로" 암묵적인 형변환이 이루어집니다.

만약 수동으로, 즉, 명시적으로 형변환을 해주고 싶다면 3가지 방법이 존재합니다.

```cpp
double value { 3.14 };
int num1 { (int)value };              // 1번
int num2 { int(value) };              // 2번
int num3 { static_cast<int>(value) }; //3번
```

1번 방법은 C와 같은 방법이며, 권장되지 않는 방법입니다.
2번 방법은 거의 사용되지 않습니다.
3번 방법은 가장 깔끔하고(코드는 길지만) 권장되는 방법입니다.


### 불 연산자

| 연산        | 표현식   |
|-------------|----------|
| 크다        | x > y    |
| 크거나 같다 | x >= y   |
| 작다        | x < y    |
| 작거나 같다 | x <= y   |
| 같다        | x == y   |
| 같지 않다   | x != y   |
| AND         | a && b   |
| OR          | a \|\| b |
| NOT         | !a       |


크다 \~ 같지 않다 까지는 논리 연산자라고 하며, AND/OR/NOT은 관계 연산자라고 합니다. 논리 연산자는 말하는 그대로며, 관계 연산자은 a와 b가 모두 참이어야만 참이며, OR는 a와 b중 하나라도 참이면 참이고, NOT은 조건식의 결과를 반전시킵니다.

> \|\|(OR) 는 \\(역슬래시) 를 Shift와 함께 누르면 됩니다.

불 연산자보다 산술 연산자의 우선순위가 높아 `1 + 2 == 3` 같은 식이 있을 때 `(1 + 2) == 3` 과 같이 처리합니다.

C++에서는 논리 연산자의 결과를 **bool** 타입에 저장하는 것을 권장합니다.

논리 연산자는 연결해서 사용할 수 없으며, 논리 연산자들을 연결하기 위해서는 관계 연산자가 필수입니다. `a < b < c` 은 불가능하고 `a < b && b < c` 와 같이 작성해야 함을 의미합니다.

### 비트 연산자

| 연산        | 표현식         |
|-------------|----------------|
| 비트 NOT    | ~x             |
| 비트 AND    | x & y          |
| 비트 OR     | x \| y         |
| 비트 XOR    | x ^ y          |
| 비트 시프트 | x \<\< k, x \>\> k |

C언어와 동일합니다. 보통 알고리즘에 사용됩니다.

### 할당 연산자

할당 혹은 대입 연산자라고 불리는 =은 개체(Lvalue)의 값을 설정하는 연산자입니다.

`object = expr;`

Lvalue란 주소를 지정할 수 있는 항목이며, 변수 등이 그 예입니다. object와 expr의 타입이 일치하지 않으면 가능한 경우 expr을 object 타입으로 변환하며, 오른쪽에서 왼쪽 순서로 결합하기에 여러 할당 연산자를 연결 가능합니다.

`a = b = c = 10;`

할당 연산자는 모든 산술/비트 연산자보다 우선순위가 낮습니다.

복합 할당 연산자가 존재하며, 모든 산술/비트 연산자를 = 앞에 붙임으로써 `x = x + y;` 와 같은 식을 `x += y;` 로 줄일 수 있습니다.

이 외에 다양한 연산자들이 존재하지만 후에 설명하도록 하겠습니다.


### 콤마 연산자

콤마(,) 를 사용하는 것으로 왼쪽의 표현식을 먼저 계산한 후에 오른쪽의 표현식을 계산하라고 지시할 수 있습니다.

`1 + 2, 3 * 4`

위 식의 결과는 **12** 이며, 가장 마지막 표현식의 값이 결과가 됩니다.

만약 함수의 인수로 콤마 연산자를 사용하고 싶다면, 괄호로 둘러싸면 됩니다.

- - -

## 열거형, 구조체

### 열거형

열거(Enumerated) 형은 연속된 숫자를 나타내기 위해 사용됩니다. 예를 들어, 만약 숫자로 어떤 특별한 의미들을 나타내게 하고 싶을 때,

```cpp
const int Espresso { 0 };
const int Americano { 1 };
const int Latte { 2 };
const int Cappuccino { 3 };

int coffeeOrder { Latte };
```

과 같이 만드는 것을 생각할 수 있는데, 이러면 메뉴에 없는 숫자(-4?) 등이 들어갈 수 있고, 실수로 `coffeeOrder++` 과 같은 코드를 작성해 라떼가 카푸치노가 된다는 말도 안되는 문제가 생길 수 있고, 타입을 나타내는 상수들이 서로 분리되어 있습니다. 이를 열거형으로 다시 만들어 보면,

```cpp
enum class CoffeeType { Espresso, Americano, Latte, Cappuccino };

CoffeeType coffeeOrder { CoffeeType::Latte };
```

과 같이 사용할 수 있습니다. 값의 범위를 강제적으로 정하며, CoffeeType 안의 Espresso, Americano... 등은 순서대로 0, 1, 2, 3 의 값을 가지게 됩니다. 만약 다른 숫자를 지니게 하고 싶다면

```cpp
enum class CoffeeType {
  Espresso,
  Americano = 5, 
  Latte, 
  Cappuccino = 10
};
```

같이 값을 설정해줄 수 있습니다. 설정되지 않은 열거형 멤버는 이전의 열거형 멤버의 값에 1을 더한 값이 설정되어 Latte는 6이 되며, 이전의 열거형 멤버가 없는 Espresso는 0이 됩니다.

> 열거형 값이 숫자를 나타내지만, 정수 타입으로 자동으로 바뀌지는 않아 `CoffeeType::Americano == 5` 와 같이 사용될 수는 없습니다.

C++20부터는 `using enum <열거형>;` 을 이용해 네임스페이스와 같이 `CoffeeType::Latte` 를 `Latte` 로 생략해서 적을 수 있게 만들 수 있습니다. 또한, `using enum CoffeeType::Latte;` 와 같이 특정 멤버만 생략하게 만들 수 있습니다.

지금 설명된 열거형은 C와는 다르게 열거형 타입마다 자신의 범위가 존재하기 때문에 둘 다 using을 사용한 것이 아니라면 다음과 같은 코드가 가능합니다.

```cpp
enum class CoffeeType { Espresso, Americano, Latte, Cappuccino };
enum class LatteType { Latte, GreenTea, Mocha, Vanilla }; // Latte가 겹치지만 OK
```

### 구조체

구조체는 여러 개의 타입을 합쳐 하나로 만들어 줄 수 있는 타입이며, 예를 들어 주택의 정보를 저장할 때 "방의 개수, 화장실 개수, 발코니 유무, 집의 면적" 과 같은 정보들을 따로 담는 것보다 하나의 타입으로 만드는 게 다루기 편하기 때문에 사용됩니다.

> house.cppm

```cpp
export module house;

export struct House {
  int roomCount;
  int bathroomCount;
  bool hasBalcony;
  double floorArea;
}; // 세미콜론에 주의
```

위 코드는 house.cppm 이라는 *모듈 인터페이스 파일(module interface file)* 이고, `.cppm` 은 모듈 인터페이스 파일 확장자로 주로 사용됩니다. 코드의 첫째 줄은 **모듈 선언** 이며 이 파일이 house라는 모듈을 정의함을 말합니다. 또한, 모듈은 모듈이 무엇을 내보낼(export) 지 명시해야 하며, 이는 모듈이 다른 곳으로 임포트(import) 되었을 때 무엇이 보이게 할 지 정하는 것입니다.

타입을 export 할 때는 위 코드에서 `export struct House` 를 한 것과 같이 앞에 export 키워드를 작성하면 됩니다. 구조체는 나만의 "타입" 을 만든 것과 동일하며, House 타입은 안에 적어준 **필드(field)** 들을 전부 내장하고 있으며, `.` 연산자를 통해 필드에 접근할 수 있습니다.

```cpp
import <iostream>;
import <format>;
import house;

using namespace std;

int main() {
   House myHouse;

   myHouse.roomCount = 4;
   myHouse.bathroomCount = 1;
   myHouse.hasBalcony = false;
   myHouse.floorArea = 100.0;

   cout << format("방의 개수: {}, 화장실 개수 : {}", myHouse.roomCount, myHouse.bathroomCount) << endl;
   cout << format("발코니 유무: {}", myHouse.hasBalcony ? "O" : "X") << endl;
   cout << format("집의 면적: {}", myHouse.floorArea);
}
```

사용자 지정 모듈은 \<\>를 사용하지 않음에 유의해 주세요.

- - -

## 제어문

### 표현식과 문장

C++에서 표현식과 문장은 다르며, 모든 표현식에 `;`를 추가하면 문장이 됩니다. 그럼 표현식은 어떤 것들을 의미하는지 알아보면, 모든 변수, 상수, 리터럴은 표현식이며 연산자로 결합된 것 또한 표현식입니다. 심지어, `cout << "Expression"` 같은 출력문도 표현식입니다. 표현식을 인자로 넣은 함수 호출도 표현식으로, `abs(10 - 20)` 이나 `sqrt(abs(10 - 20))` 또한 표현식입니다. 함수 호출이 문장이었다면 중첩이 불가능하다는 점으로 설명될 수 있습니다.

문장은 말했듯 표현식에 세미콜론을 붙인 것으로, `abs(10 - 20);` 이라고 작성하면 문장이 됩니다. 또한, 중괄호로 둘러싸인 문장도 문장이며 이를 복합문이라고 합니다.

### 분기문(조건문)

* if문

```cpp
if (x < 0)
  cout << "x는 음수";
else if (x > 0)
  cout << "x는 양수";
else
  cout << "x는 0";
```

`if (<조건>)` 과 같이 적으며, 조건이 참이라면 if문 안의 코드를 실행합니다. 조건이 거짓일 경우 실행될 코드를 작성하려면, `else` 를 적습니다. `else if` 와 같은 형식으로 다시 한번 조건을 확인할 수도 있습니다.

만약 여러 줄의 코드를 실행하고 싶다면 중괄호를 사용하면 됩니다.

```cpp
if (x < 0) {
  cout << "x는 음수입니다.";
  x = -x;
}
```

조건식 안에는 boolean 값이나 boolean 값으로 계산될 수 있는 값이 들어와야 하며, 숫자가 올 경우 0은 거짓이며 0이 아닌 모든 숫자는 참으로 간주됩니다.
```cpp
if (0); // 무조건 거짓
if (1); // 무조건 참
```

if문에서 초기화를 진행할 수 있으며, 이 경우 if문과 연속된 else if, else 문에서만 사용 가능한 변수를 만들 수 있습니다.

```cpp
if (int x {0}; x < 0)
  cout << "x는 음수";
else if (x > 0)
  cout << "x는 양수";
else
  cout << "x는 0";
// 여기 바깥에서는 x가 사라지게 됩니다
```


* 조건식

삼항 연산자이며, if~else 문을 한 코드로 합친 것이라 볼 수 있습니다.

`조건 ? 참일때 결과 : 거짓일때 결과`

조건식의 결과는 조건에 따라서 참일 경우의 표현식 또는 거짓일 경우의 표현식이 됩니다.

`int max = x > y ? x : y;`

* switch문

정수값에 따른 서로 다른 연산을 수행하며, 다음과 같이 사용합니다. 특수한 경우에 사용되며, if문으로 대체가 가능합니다.

```cpp
int menu = 0;
switch(menu) {
  case 0:
    cout << "0입니다.";
    break;
  case 1:
    cout << "1입니다.";
    break;
  default:
    cout << "무언가입니다.";
}
```

여기서 `break;` 는 중요한데, 이를 적어주지 않으면 조건에 맞아 특정 case에 진입해 코드를 실행한 후, 다음 case의 코드들까지 전부 실행합니다.

switch의 적절한 사용 예시는 다음과 같습니다. 

```cpp
enum class Mode { Default, Custom, Standard };
 
int value { 42 };
Mode mode { /* ... */ };
switch (mode) {
    using enum Mode;
 
    case Custom:
        value = 84;
        [[fallthrough]]; // 컴파일러에게 의도적으로 break를 쓰지 않은것이라 알림
    case Standard:
    case Default:
        // ...
        break;
}
```

case 안의 코드가 비어있지 않은 이상 break를 사용하지 않으면 다음 case에 해당하지 않더라도 전부 실행하는 *fallthrough* 라 불리는 작업이 일어나는데, 보통 이를 원하지 않을 것이기 때문에 혹시 break를 실수로 빼먹었진 않았는지 컴파일러가 알려줍니다. 이를 무시하기 위해 위와 같이 `[[fallthrough]]` 를 작성하여 경고를 없애줄 수 있습니다. switch문 또한 조건문에 변수를 선언할 수 있습니다.

### 반복문

* while문

while은 `while (<조건>)` 과 같이 적으며, 조건이 참이라면 while문 안의 코드를 실행하고, 다시 조건을 확인하는 동작을 반복합니다.

```cpp
int i { 0 };
while (i < 10)
  i++;
```

이 또한 코드가 한 줄만 있으면 중괄호를 생략할 수 있습니다.

* do-while문

```cpp
int i { -1 };
do {
  i++;
} while(i < 10);
```
조건을 끝에서 검사한다는 것을 제외하면 while과의 차이점은 없습니다. 그래서 적어도 코드가 한 번은 실행됨을 보장할 수 있습니다.

* for문

가장 많이 사용되며, `for (<초기식>; <조건식>; <증감식>)` 과 같이 적으며, \[초기식 -> 조건식 -> (참일 경우) 코드 실행 -> 증감식 -> 조건식 -> ...\] 와 같은 절차대로 실행됩니다. while과 같이 조건식이 거짓이라면 반복을 종료합니다.

```cpp
for (int i { 0 }; i < 10; i++)
  cout << i << ' ';
```

여기서 초기식, 조건식, 증감식은 모두 생략될 수 있으며 조건식이 비워져있다면 무한으로 반복하게 됩니다.

```cpp
for (;;); // 무한 반복
```

* break / continue

break는 반복문을 종료하고 continue는 현재 반복만 종료하고 다음 반복으로 넘어가는 키워드입니다.

* goto

모든 분기/반복문은 내부적으로 점프(goto)로 구현되어있으나, 절차적 프로그래밍에서 구조적 프로그래밍으로 넘어온 지금은 절대로 사용되지 않습니다.


* 범위 기반 for(foreach)문

C++11에 추가되었으며, 배열이나 컨테이너(STL)의 모든 항목을 간단하게 반복하는 방법으로, `for (<자료형> <변수명> : <배열/컨테이너>)` 와 같이 적습니다.

```cpp
int data[] {1, 2, 3, 4, 5};
for (int i : data)
  cout << i << ' ';
```

위의 코드의 실행 결과는 `1 2 3 4 5` 입니다. 배열의 첫 번째 원소부터 마지막 원소까지 반복하며 각 반복마다 배열의 다음번째 값을 i에 담습니다.

C++20부터 foreach문 안에서도 변수를 초기화 할 수가 있습니다.

```cpp
for (int arr[] { 1, 2, 3, 4 }; int i : arr)
{
  cout << i << endl;
}
```

- - -

## 함수

함수는 다음과 같이 선언합니다.

```cpp
[inline] <반환타입> <함수이름> (<매개변수(인수)>) {
  ...실행될 코드
}
```

> 전달된 값을 받는 변수를 매개변수(Parameter)라고 하고, 함수로 전달되는 값을 인수(Argument)라고 하지만 보통 구분하지 않고 사용합니다.

> 특정 파일에서만 사용되는 함수라면 해당 파일에 함수를 구현하고, 만약 다른 모듈이나 파일에 사용된다면 *모듈 인터페이스 파일*에서 선언을 `export` 합니다. 함수의 구현은 모듈 인터페이스 파일에 작성해도, 모듈 **구현** 파일에 작성해도 됩니다.

`__func__` 키워드로 현재 사용중인 함수의 **이름** 을 문자열로 받아올 수 있습니다.

C++에서 기본적으로 인수를 전달받을 때 복사본이 만들어지는 "값에 의한 호출" 을 사용합니다. 만약 인수로 전달받은 실제 변수값을 수정하고 싶다면 레퍼런스(&) 를 사용해서 "참조에 의한 호출" 을 합니다.

```cpp
void add_one(int& x){
  x++;
}

int main() {
  int val = 0;

  add_one(val);

  cout << val; // 결과: 1
}
```

레퍼런스는 나중에 더 자세히 알아보겠지만, 포인터와 거의 동일한 동작을 수행합니다. 이렇게 참조에 의한 호출을 하는 경우, `add_one(val * 2)` 와 같은 임시 값으로 호출할 수 없습니다.

하지만, `const int& x` 과 같이 **상수 레퍼런스** 로 참조를 하면 안에서 값을 변경할 수 없기 때문에 임시 값 또한 넘겨줄 수 있습니다.

그 외에도 레퍼런스는 주로 배열과 같이 비싼 복사 연산을 피하기 위해 주소만 참조하기 위해 사용됩니다.

### 기본값

매개변수에 기본값을 줄 수 있으며, 기본값이 존재하는 매개변수에 인수를 전달하지 않으면 기본값이 사용됩니다.

```cpp
int add(int a, int b, bool printResult = false) {
  if (printResult)
    cout << a + b << '\n';
 
  return a + b;
}

int main() {
  cout << add(5, 10) << '\n'; // 15 출력

  add(5, 10, true); // 함수 내부에서 15 출력
}
```

### 인라인

함수 앞에 inline 키워드를 사용하여 레지스터를 저장하고 스택에 인수를 복사하는 함수의 오버헤드를 피할 수 있습니다. 함수 호출을 인라인하면 해당 부분을 함수에 포함된 연산으로 대체합니다. 하지만 inline이 키워드가 있다고 컴파일러에서 반드시 인라인이 수행되는 것이 아니며, 성능에서 유리해 보인다면 인라인이 없어도 컴파일러가 인라인시킬 수 있습니다.

### 오버로딩

C++ 함수에서 매개변수 선언이 충분히 다르다면 같은 이름을 공유할 수 있으며, 이를 함수 오버로딩(Overloading) 이라고 합니다.

```cpp
int divide(int a, int b) {
  return a / b;
}

double divide(double a, double b) {
  return a / b;
}

int main() {
  cout << divide(10, 3) << endl; // int divide(int, int) 호출
  cout << divide(10.0, 3.0) << endl; // double divide(double, double) 호출
  cout << divide(10, 3.0) << endl; // 오류. 모호함
}
```

divide()를 호출하면 컴파일러는 오버로드 확인을 수행하는데, 인수 타입과 정확히 일치하는 오버로드가 있다면 해당 오버로드를 사용하고, 그렇지 않다면 변환 후 일치하는 오버로드가 얼마나 있는지 확인하고 일치하는 오버로드가 1개일 경우 해당 함수를 사용하며 그 외의 경우는 오류가 발생합니다.

위에서 `divide(10, 3.0)` 은 변환을 수행했을 경우 int와 double이 둘다 가능해 모호하기 때문에 오류가 발생합니다. 함수 오버로드는 시그니처(Signature)가 서로 달라야 하며, C++에서 시그니처는 함수 이름, 매개변수의 개수, 매개변수의 타입으로 구성됩니다.

### 속성Attributes

속성은 선택적/공급업체별 정보를 소스 코드에 작성하기 위해 사용됩니다. C++11부터 ``[[속성]]`` 과 같이 사용되며, switch문에서 보았던 ``[[fallthrough]]`` 또한 속성입니다.

* `[[nodiscard]]`

만약 return된 값으로 아무것도 하지 않으면 컴파일러에게 경고를 발생시키게 해줍니다.

```cpp
[[nodiscard]] int func()
{
  return 42;
}

int main()
{
  func(); // 컴파일러 경고
}
```

C++20부터는 `[[nodiscard("꼭 써야합니다. 꼭.")]]` 와 같이 안에 이유를 적어줄 수 있습니다.

* `[[maybe_unused]]`

컴파일러 경고 단계에 따라, 변수를 선언하고 사용하지 않으면 컴파일러 경고가 발생하는데 이를 막을 수 있게 해줍니다.

```cpp
int func(int param1, [[maybe_unused]] int param2)
{
    return 42;
}

- - - - -

warning C4100: 'param1': unreferenced formal parameter
```

위와 같이, param1에는 경고가 발생하지만 param2는 무시되는 모습입니다.

* `[[noreturn]]`

이 함수는 호출 된 후에 호출한 곳으로 다시 되돌아가지 않는 함수를 의미합니다. 예를 들어 프로그램을 종료하는 함수 선언 앞에 사용되며, 적지 않을경우 해당 함수를 호출하려는 함수에 대한 컴파일러 경고가 발생합니다.

* `[[deprecated]]`

사용할 수 있지만, 앞으로 사용되지 않을 것이라 사용을 권장하지 않음을 의미합니다. 이유 또한 적어줄 수 있습니다.


- - -

## 컨테이너

C언어와 동일한 배열을 사용 가능합니다. 하지만, STL에 존재하는 다양한 컨테이너(배열)를 사용하는 것을 권장합니다.

* <array\>

array 라이브러리 안에는 배열을 나타내는 타입이 따로 정해져 있으며, `array<타입, 크기> 이름` 과 같이 사용됩니다. 예를 들어,

```cpp
array<int, 5> arr {1, 2, 3, 4, 5};
cout << format("배열의 크기: {}", arr.size()) << endl;
cout << format("두 번째 원소: {}", arr[1]) << endl;
```

와 같이 사용할 수 있습니다. 타입에 사용되는 부등호는 템플릿(제네릭 프로그래밍)을 공부하면 알 수 있습니다.

또한 C++에는 **CTAD**(Class Template Argument Deduction) 이라는 기능이 있는데, 템플릿 타입에 대해 초기화된 값에 타입에 맞춰서 알아서 타입이 결정되는 것을 의미합니다.

`array arr {1, 2, 3, 4, 5};` 와 같이 작성하면, arr는 자동으로 int타입이 됩니다.

* <vector\>

벡터는 **동적 배열** 으로, 실행 중에 크기를 늘리거나 줄일 수 있는 타입입니다.

```cpp
// int타입 벡터 생성
vector<int> myVector { 11, 22 };
 
// 33과 44를 벡터에 추가. 벡터는 이제 { 11, 22, 33, 44 } 가 됩니다.
myVector.push_back(33);
myVector.push_back(44);
 
// 벡터 요소 사용하기
cout << format("세 번째 원소: {}", myVector[2]) << endl;
```

벡터 또한 CTAD를 지원하여 다음과 같이 선언할 수도 있었습니다.

`vector myVector {11, 22};`

* std::pair

\<utility\> 에 있으며, 두개의 서로 다른 타입의 값을 하나로 묶어줍니다. CTAD를 지원합니다.

`pair<double, int> myPair { 3.14, 99 };`

* std::optional

\<optional\> 에 있으며, 특정 타입의 값이 있거나 아무 값이 없음을 나타냅니다. 함수의 매개변수로 사용되어 "선택적인" 값을 나타낼 수 있고, return 값으로 사용되어 값을 반환하거나 아무값도 반환하지 않게할 수 있습니다. 이는 nullptr, end(), -1, EOF과 같은 "없음" 을 나타내는 특별한 값들을 반환할 필요가 없게 만들어줍니다.

```cpp
optional<int> getData(bool giveIt)
{
    if (giveIt) {
        return 42;
    }
    return nullopt;  // 간단하게 return {}; 라고 할 수도 있습니다.
}
```

값이 있는지 없는지를 알기 위해서는 `.has_value()` 를 호출하거나 if문의 조건으로 사용하면 됩니다.

```cpp
optional<int> data1 { getData(true) };
optional<int> data2 { getData(false) };

cout << "data1.has_value = " << data1.has_value() << endl;
if (data2) {
    cout << "data2 has a value." << endl;
} 
```

또한 가지고 있는 값을 읽어오고 싶다면, `.value()` 를 호출하거나 역참조 연산자 `*`를 사용하면 됩니다. 

```cpp
cout << "data1.value = " << data1.value() << endl;
cout << "data1.value = " << *data1 << endl;
```

만약 값을 가지고 있지 않는데 `.value()` 를 호출하면 `std::bad_optional_access`라는 **예외** 를 발생시킵니다. 예외는 나중에 알아보도록 하겠습니다.

`.value_or(값)` 로 값이 있다면 가지고 있는 값을, 없다면 함수 안에 적어준 값을 사용하도록 만들 수 있습니다.

나중에 나오겠지만, 포인터는 저장할 수 있지만 레퍼런스는 저장할 수 없습니다.

### 구조적 바인딩(Structured Binding)

array, struct, pair과 같은 타입으로 여러개의 변수를 동시에 선언하고 초기화하게 해줄 수 있는 방법을 말합니다.

```cpp
array values { 11, 22, 33 };
auto [x, y, z] { values };
```

위 코드는 x, y, z라는 변수를 선언하고, 각각의 변수는 11, 22, 33로 초기화되게 만듭니다. 여기서 `auto` 키워드는 **필수** 이며, 명시적으로 int를 사용한다던가 할 수는 없습니다.

struct의 경우 모든 static이 아닌 구조체의 멤버가 public이라면 사용할 수 있습니다. 그리고 auto 대신 `auto&` 나 `const auto&` 를 사용해 주소에 대한 참조를 만들어 낼 수도 있습니다.

### 초기화 리스트(Initializer Lists)

\<initializer_list\> 안에 있으며, 가변 매개변수를 나타냅니다.

```cpp
import <initializer_list>;
 
using namespace std;
 
int makeSum(initializer_list<int> values)
{
    int total { 0 };
    for (int value : values) {
        total += value;
    }
    return total;
}

int main() {
  int sumA { makeSum({ 1, 2, 3 }) };
  int sumB { makeSum({ 10, 20, 30, 40, 50, 60 }) };
  // int sumC { makeSum({ 3, 6, 9.0 }) }; 오류: 타입이 모두 일치해야함

  return 0;
}
```

### 문자열

C++에서는 C와 같이 char의 배열로 문자열 사용이 가능합니다. 하지만 C++의 \<string\> 안에 있는 `string` 타입을 이용하는 것을 권장합니다. 이는 내부적으로 C의 배열을 사용하는 Wrap 클래스입니다.

```cpp
string myString { "Hello, World" };
cout << format("문자열 {} 을 담고 있습니다.", myString) << endl;
cout << format("첫번째 문자는 {} 입니다.", myString[0]) << endl;

myString = "Goodbye, World"; // 다른 문자열을 대입해도 문제없이 작동합니다
```

- - -

# 클래스

*class* 란 어떤 객체의 특성을 정의합니다. 좀 더 간단하게 설명하면, 구조체(struct)와 같이 나만의 타입을 만들어 주는데 사용한다고 할 수 있습니다. C++의 클래스는 보통 모듈 인터페이스 파일(`.cppm`) 에서 정의되고 `export` 되며, 모듈 인터페이스 파일 안 혹은 별도의 소스 파일(`.cpp`) 에 구현될 수 있습니다.

클래스는 속성attributes과 행동behaviours로 이루어지는데, 여기서 속성은 변수를 의미하고 행동은 함수를 의미합니다. 하지만 클래스에 속성으로 정의된 변수는 "데이터 멤버", "멤버 변수" 혹은 "필드field" 와 같이 특별한 이름으로 불리고, 행동으로 정의된 함수는 "멤버 함수" 혹은 메서드method라고 합니다. 

각각의 멤버 변수와 메서드는 `public`, `private`, `protected` 라는 접근 지정자로 어디에서 해당 코드에 접근할 수 있는지를 지정해줄 수 있습니다.

<table>
  <tr>
    <td>public</td>
    <td>클래스 바깥에서 접근할 수 있습니다</td>
  </tr>
  <tr>
    <td>private</td>
    <td>클래스 안쪽에서만 접근할 수 있습니다</td>
  </tr>
  <tr>
    <td>protected</td>
    <td>클래스 안쪽과, 자신을 상속한 클래스에서 사용할 수 있습니다</td>
  </tr>
</table>

보통 모든 멤버 변수는 private으로 설정하여 바깥에서 접근할 수 없도록 하고, public 메서드들을 이용해서 멤버 변수의 값을 읽어오거나 설정하도록 만듭니다. 이렇게 하는 이유는, 내부 코드가 변경되더라도 외부에 표시되는 구조는 똑같도록 유지할 수 있습니다.

- - -

> `player.cppm`

```cpp
export module player;

import <string>;

export class Player {
public:
	Player();
	~Player();

	void OnDamaged(double damage);
	void OnLevelUp();

	std::string getPlayerName();
	void setPlayerName(std::string name);

	int getPlayerLevel();
	void setPlayerLevel(int level);

	double getPlayerHealth();
	void setPlayerHealth(double health);
private:
	std::string m_name;
	int m_level;
	double m_health;
};
```

위의 코드의 메서드들은 당연히 구현된 것이 아니며, 선언만 되어있습니다. 여기서 변수 앞의 `m_` 은 이 변수가 멤버 변수임을 의미하는 코드 컨벤션(Coding Convention) 입니다. public: 이후 ~ private: 이전의 코드들은 모두 public 접근범위를 가지고 있고, private: 이후의 코드들은 모두 private 접근범위를 가지고 있습니다. public: 을 여러번 작성해도 됩니다.

> 코드 컨벤션이란 가독성이 좋게 하도록 개발자들끼리 정한 규칙이며, 꼭 따를 필요는 없지만 특정 언어나 라이브러리에 존재하는 코드 컨벤션을 따르면 다른 개발자들이 코드를 읽기 더 편해집니다.

반환타입이 없고 클래스 이름과 동일한 메서드(`Player()`)는 생성자라고 하며, 클래스의 객체가 생성될 때 호출됩니다. 동일하지만 앞에 `~`가 붙은 메서드는 소멸자라고 하며, 클래스의 객체가 소멸할 때 호출됩니다. 여기서 클래스의 객체라는 말은 해당 클래스 타입의 값을 의미합니다.

이제 모듈 인터페이스 파일(`.cppm`)에 선언이 끝났으니, 구현은 소스 파일(`.cpp`) 에 해보도록 하겠습니다.

- - -

> `player.cpp`

우선, 이 소스 파일이 `player` 모듈이라는 것을 컴파일러에게 알려주기 위해 **모듈 선언** 을 합니다.

`module player;`

C++에서 클래스의 멤버 변수들을 초기화 하는 방법은 2가지가 있습니다. 첫 번째는 생성자 초기화(constructor initializer)를 사용하는 것입니다. 간단하게, 생성자 뒤에 콜론(`:`) 을 붙이고 멤버 변수들을 초기화해주면 됩니다. 

C++에서 클래스 선언 외부에서 메서드를 구현할 때는, `<클래스>::<메서드이름>` 과 같이 합니다.

```cpp
module player;

Player::Player() : m_name { "Unknown User" }, m_level { 0 }, m_health { 1.0 }
{
}
```

두 번째로 다음과 같이 생성자를 구현할 수도 있습니다.

```cpp
Player::Player()
{
  m_name = "Unknown User";
  m_level = 0;
  m_health = 1.0;
}
```

하지만 만약 이와 같이 값만 초기화 할 거라면, 생성자는 필요 없이 클래스 내부에서 선언과 동시에 초기화 할 수 있습니다.

```cpp
private:
	std::string m_name { "Unknown User" };
	int m_level { 0 };
	double m_health { 1.0 };
```

생성자는 보통 파일 열기, 메모리 할당 등의 초기 작업을 할 때 사용되며, 소멸자 또한 파일 닫기, 메모리 해제와 같은 마무리 작업을 할 때 사용됩니다. 생성자가 없다면 위와 같이 바로 초기화해 줄 수 있지만, 생성자가 있다면 초기화 작업도 직접 구현해주어야 합니다.

C++에서는 또한 클래스 선언 내부에서 메서드를 구현할 수 있습니다.

```cpp
export module player;

import <string>;

export class Player {
public:
	void OnDamaged(double damage) {
    m_health -= damage;
  }

	void OnLevelUp() {
    m_level++;
  }

	std::string getPlayerName() { return m_name; }
	void setPlayerName(std::string name) { m_name = name; }

	int getPlayerLevel() { return m_level; }
	void setPlayerLevel(int level) { m_level = level; }

	double getPlayerHealth() { return m_health; }
	void setPlayerHealth(double health) { m_health = health; }
private:
	std::string m_name { "Unknown User" };
	int m_level { 0 };
	double m_health { 1.0 };
};
```

- - -

> `main.cpp`

클래스를 사용하기 위해선 우선 모듈을 import합니다.

`import player;`

그리고 클래스 타입의 변수(객체)를 선언한 뒤, public인 속성이나 메서드에 `.` 연산자로 접근하여 사용합니다.

```cpp
Player myPlayer;
myPlayer.setPlayerName("Dummy");
myPlayer.setPlayerLevel(15);
myPlayer.OnDamaged(0.2);

cout << format("My Health is: {}", myPlayer.getPlayerHealth()) << endl;
```

## 범위 확인 연산자Scope Resolution

C++에서 모든 이름은 "범위(Scope)" 안에 있으며, 해당 이름이 선언된 중괄호 내부로 범위가 정해집니다. 특정 이름을 사용하려 할 때, 가장 가까이 있는 범위부터 가장 바깥인 **전역 범위**(Global Scope)까지 확인하여 가장 먼저 확인된 이름을 사용합니다. 여기서 전역 범위란, 그 어떤 중괄호 안에도 없어서 어디에서나 사용될 수 있는 범위를 의미합니다.

또한, 만약 바깥 범위에 선언된 이름과 같은 이름이 더 안쪽 범위에 선언되면, 이 이름은 바깥쪽 이름을 감춥니다. 그런데 만약 바깥쪽 범위의 이름을 사용하고 싶다면 범위 확인 연산자인 `::` 를 사용하면 됩니다.

```cpp
class Demo
{
    public:
        int get() { return 5; }
};
 
int get() { return 10; }
 
namespace NS
{
    int get() { return 20; }
}
```

전역 범위는 이름이 없기 때문에 전역 범위의 `get()` 을 지정해서 접근할 때는 이름을 붙이지 않고, `::get()` 과 같이 접근할 수 있습니다.

```cpp
int main()
{
    Demo d;
    cout << d.get() << endl;      // 5
    cout << NS::get() << endl;    // 20
    cout << ::get() << endl;      // 10
    cout << get() << endl;        // 10
}
```

여기서 주의해야 하는 점은, 만약 `namespace NS` 가 이름이 없는, 익명의 네임스페이스였다면 `cout << get() << endl;` 는 오류가 발생하게 됩니다. 전역 범위의 get()과 범위가 겹치기 때문이죠. 또한, `using namespace NS;` 를 사용했어도 같은 문제가 발생합니다.

## 유니폼 초기화

책 초반부터 사용되었던 것 처럼, 구조체와 클래스는 유니폼 초기화가 가능합니다.

```cpp
Somestruct myStruct = {3.14, "Hello", 10000};
Someclass myClass {"Dummy User", 100, 10.0};
```

여기서 `=` 은 선택적으로 적는 것이며, 생략이 가능합니다. 또한, 클래스의 경우 C++11 이전엔 무조건 생성자를 `Someclass myClass("Dummy User", 100, 10.0)` 같이 호출했어야 하지만, C++11부터는 유니폼 초기화로도 생성자가 호출이 됩니다.

또한, 계속 언급된 것 처럼 변수 등에도 유니폼 초기화가 가능합니다. 유니폼 초기화의 장점은 **narrowing** 을 방지한다는 것인데, 예를 들어 다음의 코드들은 3.14를 자동으로 3으로 자릅니다.

```cpp
int foo(int val) { }
int main() {
  int x = 3.14;
  foo(3.14);
}
``

하지만 만약 유니폼 초기화를 사용한다면 다음과 같은 코드들은 컴파일 에러를 발생시킵니다.

```cpp
int x { 3.14 };
foo({ 3.14 });
```

하지만 만약 narrowing이 필요하다면 `gsl::narrow_cast()` 를 사용하는 것이 추천되는 방식입니다.

또한 동적 할당된 배열이나 생성자에서의 배열 초기화 등에도 사용할 수 있습니다. 배열뿐만 아니라, `std::vector` 와 같은 컨테이너에도 사용됩니다.

```cpp
/* 이렇게 하는 대신
int* myArray = new int[4];
myArray[0] = 0;
myArray[1] = 1;
myArray[2] = 2;
myArray[3] = 3;
*/
int* myArray = new int[4] { 0, 1, 2, 3 };
int* myArray = new int[] { 0, 1, 2, 3 }; // C++20부터 배열의 크기 생략이 가능합니다
```

```cpp
public:
    MyClass() : m_array { 0, 1, 2, 3 } {}
private:
    int m_array[4];
```

## 지정된 초기화Designated Initializers

C++20부터 집합aggregate 타입에서 데이터 멤버들을 이름을 직접 사용해서 초기화 할 수 있게 해주는 방법입니다. 집합 타입이란, 배열 타입의 객체나 구조체/클래스 타입의 객체 중 `public` 필드만을 지니고 있고 정의하거나 상속된 생성자가 없으며, `virtual` 함수가 없고 `virtual`, `private`, `protected` 클래스 상속이 없는 것을 의미합니다.

지정된 초기화는 선언한 멤버의 순서에 맞게 해야하며, 다른 초기화와 섞어서 쓸 수 없습니다. 또한 지정된 초기화에서 지정해주지 않은 멤버의 경우 설정해 둔 기본값이 사용되고, 설정하지 않았다면 0으로 초기화됩니다.

```cpp
struct Vector3 {
  double x;
  double y;
  double z;
  double w { 1.0 };
};

// Vector3 playerPos { 1.5, 4.75 };

Vector3 playerPos {
  .x = 1.5,
  .y = 4.75
};
```

위에서 `playerPos` 는 x과 y에 각각 입력받은 값을, z에는 0을, w에는 1.0을 담고 있습니다. 유니폼 초기화보다 직관적이라는 장점이 있습니다. 또, 구조체나 클래스에 새 멤버를 추가하더라도 코드가 정상적으로 작동하는데, 빠진 멤버는 기본값으로 초기화되기 때문입니다.

# 포인터와 동적 메모리

## Stack과 Free-Store

C++에서 메모리는 두 부분으로 나뉘는데, 스택(Stack)과 Free-Store가 그것입니다.

스택은 쌓여있는 책처럼 값을 넣을때 맨 위에 넣고, 값을 뺄때도 맨 위에서 빼는 구조를 의미합니다. 메모리 구조에서는 이 값을 스택 프레임이라고 하며, 함수를 호출할 때마다 새 스택 프레임이 쌓이게 됩니다. 이 스택 프레임에는 호출한 함수에 선언된 모든 변수들이 들어있으며, 전달된 모든 매개변수들을 자신을 호출한 함수의 스택 프레임에서 자신의 스택 프레임으로 복사합니다. 따라서 스택의 맨 위는 현재 프로그램의 범위Scope를 나타내며, 이는 주로 현재 실행중인 함수입니다.

스택 프레임은 함수마다 고립된 메모리 공간을 지닐 수 있게 합니다. 그리고 함수가 종료되면 스택에서 스택 프레임이 빠지게 되며, 함수 안에 선언된 모든 변수들이 자동으로 메모리에서 해제됩니다. 그래서 스택에 할당된 메모리는 프로그래머가 별도로 해제해 줄 필요가 없습니다.

Free-Store는 현재 함수나 스택 프레임과의 별개의 메모리 영역입니다. 원할때 Free-Store에 메모리를 할당하거나 할당된 메모리를 수정할 수 있고, 함수 내부에서 할당하고 함수가 종료되었더라도 해제되지 않고 유지됩니다. 그리고 **스마트 포인터**를 사용하는 것이 아니라면, 할당 해제는 수동으로 해주어야합니다. 스마트 포인터에 대해서는 이후에 설명됩니다.

> 포인터를 설명하기에 앞서, 오래된 코드베이스가 아니라면 포인터는 소유권Ownership 이 포함되지 않은 경우만 허용됩니다. 그 외의 경우에는 자동으로 할당을 해제해주는 스마트 포인터를 사용해야 합니다.

## 포인터

명시적으로 메모리를 할당함으로써 아무거나 Free-Store에 넣을 수 있습니다. 그 전에, 포인터를 먼저 선언해야 합니다.

```cpp
int *integerPointer;
```

변수 앞에 `*`를 붙여 포인터를 선언할 수 있고, 위의 코드는 int형의 메모리를 참조하거나 가리키는 포인터를 선언함을 의미합니다. 일반 변수와 동일하게 포인터도 꼭 초기화되어야 하며, 초기화되지 않으면 오류를 발생시킵니다. 만약 지금 당장 초기화할 것이 아니라면 `nullptr` 라는 값으로 초기화해 null 포인터로 만들어주어야 합니다. null 포인터는 조건문에 사용되면 `false` 로 변환됩니다.

```cpp
int *integerPointer { nullptr };

if (integerPointer) { /* 포인터 할당이 되어있는 경우 실행 */ }
```

***

null 포인터에 대해 잠깐 이야기하자면, C++11 이전까지는 `nullptr` 대신 `NULL`을 사용했는데, 이는 실제로 포인터는 아니고 0을 나타내는 상수였습니다. 그래서 포인터가 아니고 일반 정수로 취급되기 때문에 다음과 같은 코드가 오류가 나지 않는다는 문제점이 있습니다.

```cpp
void foo(int n) { /* ... */ }

int main() {
  foo(NULL);
}
```

이는 코드가 예상하지 못한 결과물을 낼 수 있습니다. 몇몇 컴파일러는 이에 대한 경고를 표시하기도 합니다. 이에 반해 `nullptr`는 진짜 null 포인터를 나타내기 때문에 `foo(nullptr);` 같이 호출하면 foo 함수는 포인터를 받는 오버로드가 없기 때문에 컴파일 오류를 발생시킵니다.

***

메모리를 새로 할당하기 위해서는 `new` 연산자를 사용합니다.

```cpp
int *integerPointer;
integerPointer = new int;
```

그러면 위의 `integerPointer`는 int형 값의 주소를 가리킵니다. 가리키는 주소의 값을 바꾸려면, 포인터를 역참조dereference 해야합니다. 역참조는 포인터가 가리키는 주소의 값을 직접 읽어오는 것을 의미하고, 포인터 앞에 `*`을 적어 사용합니다. 그래서 Free-Store에 새로 할당된 int형 정수를 초기화하려면 다음과 같이 작성합니다.

```cpp
*integerPointer = 10;
```

위 코드가 포인터를 바꾸는 것이 아닌 가리키는 메모리를 변경하는 것을 알고 있어야 합니다. 만약 `integerPointer = 10;` 이라고 했다면 10이라는 주소를 가리키라고 하는 것이며, 거기엔 무작위 쓰레기 값이 들어있어 프로그램에 오류를 일으킬 것입니다.

동적 할당된 메모리를 다 썼다면 이제 할당 해제를 해야하는데, `delete` 연산자를 사용합니다. 할당 해제한 후의 주소를 포인터가 사용하는 것을 방지하기 위해 null 포인터로 만드는 것이 좋습니다.

```cpp
delete integerPointer;
integerPointer = nullptr;
```

> 역참조를 하려는 포인터는 유효해야만 하는데, null 포인터나 초기화되지 않은 포인터를 역참조하면 프로그램에 오류가 나거나 작동은 하지만 이상한 결과를 줄 수 있습니다.

포인터는 Stack 메모리나 다른 포인터까지도 가리키게 할 수 있으며, `&` 연산자로 특정 변수의 주소를 가져올 수 있습니다.

```cpp
int number { 10 };
int* intPtr { &number }; // number의 포인터를 가리킴
```

C++는 구조체나 클래스에 포인터를 사용할 때 특별한 문법이 존재합니다. 보통 역참조 `*` 를 먼저 진행하고, `.` 로 멤버에 접근할텐데 `.` 연산자의 우선순위가 더 높아 다음과 같이 코드를 작성해야 합니다.

```cpp
Book* someBook { &myBook }; // myBook이라는 Book 타입의 객체가 있다고 가정합니다
cout << (*someBook).author << endl;
```

그래서 이를 위해 `->` 라는 간편한 연산자를 사용하여 역참조와 필드접근을 동시에 처리 가능합니다.

```cpp
Book* someBook { &myBook };
cout << someBook->author << endl;
```

추가적으로, 포인터를 역참조하기 전에 포인터가 유효한지 판단해 오류를 방지하는 기법이 있습니다.

```cpp
if (myPtr && *myPtr < 0) { // 좀더 명확하게 적자면 myPtr != nullptr && *myPtr < 0을 의미합니다.
  // ...
}
```

`&&` 관계연산은 왼쪽부터 조건을 확인하며, 조건이 맞지 않으면 이후의 조건 연산들은 무시하고 바로 빠져나오기 때문에 위와 같은 코드가 가능합니다.

## 동적 배열

`new[]` 연산자를 사용해 변수를 사용하여 원하는 크기의 배열을 만들 수 있습니다. C언어의 `malloc()`을 대체하는 강력한 기능이죠.

```cpp
int N { 10 };
int *arr { new int[N] }; // int형 10개만큼의 연속된 메모리의 시작 주소 할당
arr[9] = 55;
```

할당이 끝나고 나면 일반 배열과 동일하게 사용할 수 있습니다. 위에서 언급했듯이 동적 할당한 메모리로 할 작업이 끝났다면 꼭 수동으로 해제해주어야 합니다. 배열은 `delete[]` 연산자로 해제합니다.

```cpp
delete[] arr;
arr = nullptr;
```

## const의 사용

const는 "constant(상수)"의 약자로, 무언가 변하지 않도록 만들어 주는 기능입니다. 또, 이미 값을 알고 있다는 점을 이용해 컴파일러가 코드를 더 잘 최적화해줄 수도 있습니다. 이제 const의 비슷하지만 미묘하게 다른 다양한 활용법들을 알아봅시다.

* 타입의 한정자(Qualifier)로서의 const

C에서는 `#define` 으로도 상수를 선언할 수 있었지만, C++에서는 `const` 키워드를 사용하는 것을 권장합니다. 변수를 선언할때 앞에 const라고 적는다는 것을 제외하면 일반 변수와 사용이 동일하지만, 컴파일러가 값이 바뀌지 않을 것임을 보장합니다. 클래스 멤버 등 어떤 변수에나 사용 가능합니다.

```cpp
const int majorVersion { 1 };
const int minorVersion { 2 };
const double PI { 3.141592653589793238462 };
```

* 포인터의 const

포인터는 "가리킬 주소" 를 변하지 않게 할 것인지, "가리키는 주소의 값" 을 변하지 않게 할 것인지에 따라 const 키워드가 적힐 위치가 다릅니다. 다음은 "가리키는 주소의 값" 을 변하지 못하게 하는 예시입니다.

```cpp
const int* arr; // int const* arr; 라고 해도 됩니다.
arr = new int[5];
arr[0] = 10; // 컴파일 오류!
```

다음은 "가리킬 주소" 를 변하지 못하게 하는 예시입니다. 별 뒤에 선언했다는 점을 유의해주세요.

```cpp
int* const arr { new int[5] };
arr[0] = 10;

delete[] arr;
arr = nullptr; // 컴파일 오류!
```

둘은 혼용될 수 있으며, 간접 참조의 깊이가 깊어질수록 복잡해보이게 됩니다. 하지만 단순하게, * 이전의 const는 주소의 값을 변하지 못하게 하고, * 이후의 const들은 자신의 바로 왼쪽의 포인터가 가리킬 주소를 바꾸지 못하게 한다고 할 수 있습니다. 다음은 삼중 포인터의 예시로, 포인터의 포인터의 포인터를 나타냅니다.

```cpp
const int * const * const * const arr { nullptr };
```

* 매개변수를 지키기 위한 const

C++에서는 비-const 변수를 const 변수로 변환할 수 있습니다. 그렇게 하면 바뀌면 안되는 값에 대해 실수로 값을 바꿔버리지 않도록 변수를 보호할 수 있어 실수의 근원을 차단함으로써 유지보수에 도움이 됩니다. 아래의 코드는 `string *` 타입이 자동으로 `const string *` 타입으로 변환됩니다.

```cpp
void someFunction(const string* str) {
  *str = "Something"; // 컴파일 에러!
}

int main() {
  string myStr { "Some Message" };
  someFunction(&myStr);
}
```

* const 메서드

클래스의 메서드를 const로 지정하여 해당 메서드가 클래스의 멤버를 수정하지 못하게 할 수 있습니다. 클래스 예시에서 나왔던 코드를 바꿔보면,

```cpp
export class Player {
public:
	Player();
	~Player();

	void OnDamaged(double damage);
	void OnLevelUp();

	std::string getPlayerName() const;
	void setPlayerName(std::string name);

	int getPlayerLevel() const;
	void setPlayerLevel(int level);

	double getPlayerHealth() const;
	void setPlayerHealth(double health);
private:
	std::string m_name;
	int m_level;
	double m_health;
};
```

값을 가져오기만 하는 메서드들에 const 키워드를 붙여 해당 메서드가 확실하게 멤버 변수의 값을 수정하지 못하게 할 수 있습니다.

> 멤버의 값을 변경하지 않는 메서드들은 const로 선언하는 것이 권장됩니다. 이 메서드들은 인스펙터inspector 라고 불리고, 비-const 메서드들은 뮤테이터mutator 라고 불립니다.

### 상수 표현식

* constexpr

C++에는 언제나 상수 표현식이라는 개념이 있었고, 이는 컴파일 시간에 계산되는 연산을 의미합니다. 예를 들어, 배열의 크기는 컴파일 시간에 알아야 하기 때문에 상수 표현식이어야 하기에 다음과 같은 코드는 컴파일되지 않습니다.

```cpp
int getArraySize() {
  return 10;
}

int main() {
  int arr[getArraySize()]; // 컴파일 에러!
}
```

이 때 `constexpr` 키워드를 사용해 상수 표현식에 사용될 수 있도록 함수를 변환할 수 있습니다.

```cpp
constexpr int getArraySize() {
  return 10;
}

int main() {
  int arr[getArraySize()]; // 컴파일 시간에 계산될수만 있다면 [getArraySize() * 2] 등도 가능합니다.
}
```

대신 이 함수가 컴파일 시간에 계산될 수 있도록 하기 위해 많은 제약이 부여됩니다. 제약으로는, constexpr 함수는 다른 constexpr 함수를 호출할 수 있지만 비-constexpr 함수는 호출할 수 없다는 점, 사이드 이펙트(Side Effect)를 포함할 수 없다는 점, 예외를 발생시킬 수 없다는 점 등이 있습니다. 간단히 말해 컴파일 시간에 계산될 수 있게만 한다면, 그 코드는 작동합니다. 이 기능은 고급 기능으로 **메타 프로그래밍** 의 범주에 들어가기 때문에 깊게 다루지는 않겠습니다.

* consteval

`constexpr`는 사실 컴파일 시간에 실행함을 보장하지 않습니다. 예시를 들자면, 다음 코드는 컴파일 시간에 계산됩니다.

```cpp
constexpr double getArea(double radius) { return radius * 3.14; }

int main() {
  constexpr double const_radius { 10.0 };
  constexpr double circleArea { getArea(const_radius) };
}
```

하지만 다음의 코드는 런타임 시간에 계산되게 됩니다!

```cpp
constexpr double getArea(double radius) { return radius * 3.14; }

int main() {
  double const_radius { 10.0 };
  double circleArea { getArea(const_radius) };
}
```

여기서 컴파일 시간에 작동함을 보장하기 위해, C++20부터 추가된 기능인 `consteval` 키워드를 사용하면 위의 코드는 컴파일 에러를 내게 됩니다. 마찬가지로, 전혀 다른 범위의 내용이므로 깊게 다루지 않겠습니다.

## 레퍼런스 &

레퍼런스(참조) 는 C++에서 광범위하게 사용되는 문법입니다. *레퍼런스*는 다른 변수에 대한 *별명* 이라고 할 수 있습니다. 레퍼런스에 대한 모든 수정은 레퍼런스가 참조하고 있는 변수에 적용됩니다. 레퍼런스는 암묵적으로 포인트고 주소를 가져오는 작업과 역참조하는 문제를 해결해주는 것이라고도 할 수 있습니다.

```cpp
int x { 3 };
int& ref { x };

cout << x << endl;   // 3
ref = 99;
cout << x << endl;   // 99
cout << ref << endl; // 99
```

포인터와 비슷하게 변수를 선언할 때 앞에 `&` 를 붙여줌으로써 레퍼런스를 선언할 수 있습니다. 레퍼런스는 선언과 동시에 초기화되어야만 하며, 이 때 초기화해준 변수를 참조하게 됩니다. 일반 변수와 똑같이 사용하지만, 내부적으로는 참조하는 변수로의 포인터이어서 레퍼런스의 값을 변경하면 참조하는 변수의 값도 변경됩니다.

> 레퍼런스는 꼭 선언과 동시에 초기화되어야 하고, 초기화 이후에 다른 변수를 참조하도록 변경하는 것은 불가능합니다.

레퍼런스도 `const` 를 사용해 값을 바꾸지 못하게 할 수 있습니다.

```cpp
int x = 2000;
const int& cRef { x }; // int const& cRef { x }; 도 가능합니다
cRef = 1000; // 컴파일 오류!
```

const 레퍼런스의 특징으로는, 변하지 않는 상수이기 때문에 리터럴 값을 참조할 수 있다는 점입니다. 예를 들어, `const int& ref { 10 };` 이 가능하다는 것이죠.

그래서 const 레퍼런스는 **값**만을 참조한다 할 수 있는데, 이 특징이 있기에 **임시 변수**의 값 또한 참조할 수 있습니다.

```cpp
string getString() { return "Test"; }

int main() {
  string& ref { getString() };         // 컴파일 오류!
  const string& c_ref { getString() }; // 오류없이 실행
}
```

### 포인터로의 참조

거의 사용되지 않지만, 가끔 유용하게 사용되는 문법입니다.

```cpp
int* intP { nullptr };
int*& ptrRef { intP };
ptrRef = new int;
*ptrRef = 5;
```

반대로 포인터가 레퍼런스를 가리키는 경우, 그것은 레퍼런스가 참조중인 변수의 주소를 가리키는 것과 같습니다.

```cpp
int x { 3 };
int& xRef { x };
int* xPtr { &xRef };
*xPtr = 100;
cout << x;   // 100 출력
```

마지막으로, `int&&` 나 `int&*` 같은 문법은 불가능합니다.

### 구조적 바인딩과 레퍼런스

[구조적 바인딩](https://termsigening97.github.io/posts/CPP-Lecture/#%EA%B5%AC%EC%A1%B0%EC%A0%81-%EB%B0%94%EC%9D%B8%EB%94%A9structured-binding) 에 레퍼런스를 다음과 같이 사용할 수 있습니다.

```cpp
pair myPair { "hello", 5 };
auto [theString, theInt] { myPair };   // 기본 구조적 바인딩
auto& [theString, theInt] { myPair };
const auto& [theString, theInt] { myPair };
```

### 멤버 변수 참조

클래스의 멤버 변수는 레퍼런스가 될 수 있습니다. 단, 생성자 초기화(constructor initializer) 로 초기화 되어야만 합니다.

```cpp
class Player
{
  public:
    Player(int& ref) : m_ref { ref } { }
  private:
    int& m_ref;
};
```

### 레퍼런스 매개변수

포인터와 마찬가지로, 일반적으로 레퍼런스는 함수의 매개 변수로 활용됩니다. 레퍼런스를 사용하는 것은 *Pass-by-Reference*(참조에 의한 전달) 라고 하고, 사용하지 않는 것은 *Pass-by-Value*(값에 의한 전달) 라고 합니다. Call-by-Reference나 Call-by-Value와 같은 의미죠. C에서는 포인터로 스택 메모리의 값을 가리켰지만, 지금까지 배운것처럼 C++는 대신 레퍼런스를 사용해 작업을 훨씬 편하게 합니다.

```cpp
void swap(int first, int second)
{
    int temp { first };
    first = second;
    second = temp;
}

int main() {
  int a { 10 }, b { 20 };

  swap(a, b);

  cout << a << " " << b; // 10 20 출력
}
```

위의 코드는 값이 서로 바뀌지 않습니다. 하지만 레퍼런스를 사용하면 코드의 변화가 거의 없이 참조를 넘겨 원하는 기능을 쉽게 만들 수 있죠. 포인터로도 가능하지만, 포인터보다 훨씬 편한 것입니다.

```cpp
void swap(int& first, int& second)
{
    int temp { first };
    first = second;
    second = temp;
}

int main() {
  int a { 10 }, b { 20 };

  swap(a, b);

  cout << a << " " << b; // 20 10 출력
}
```

그런데 혹시 레퍼런스 매개변수에 포인터가 참조하는 변수를 넘겨줘야 한다면, 다음과 같이 할 수 있습니다.

```cpp
int x { 5 }, y { 6 };
int *xp { &x }, *yp { &y };
swap(*xp, *yp);
```

추가로, 예전에 프로그래머들은 `return` 값의 복사 연산도 피하고자 결과값을 return하는 대신, 레퍼런스 매개변수를 받아 해당 변수에 직접 값을 써주는 방식을 쓰곤 했습니다. 하지만 그 때를 포함해서 컴파일러는 매우 똑똑하기 때문에 그런 불필요한 복사 연산을 알아서 피하기 때문에 이런 최적화는 할 필요가 없습니다.

> 함수에서 객체를 반환할 때 권장되는 방식은, 출력 파라미터보다는 값으로 return하는 것입니다.

레퍼런스를 사용한 다른 이점도 있는데, 큰 크기의 클래스 등을 Pass-by-Value로 동작시키면 값을 복사하는 작업이 들어 성능에 영향이 있는데, 레퍼런스를 이용하면 주소만 복사하기 때문에 빠르게 처리할 수 있습니다.

하지만 이렇게 하면 원본 값 자체가 수정되기 때문에, `const` 레퍼런스를 이용합니다.

```cpp
void printString(const string& myString)
{
    cout << myString << endl;
}
 
int main()
{
    string str { "원래는 이 글자 하나하나를 복사해야하지만 레퍼런스로 주소만 복사하면 됩니다" };
    printString(str);
    printString("이것도 가능합니다");
}
```

이처럼 레퍼런스를 이용하면 더 성능에 효율적이고, 클래스중에 *Pass-by-Value* 를 지원하지 않는 경우도 있기 때문에 자주 사용됩니다.

> 그래서 기본형인 `int`, `double` 과 같은 타입을 제외하고는 불필요한 복사를 방지하기 위해 `const` 레퍼런스를 사용하는 것이 권장됩니다. 값의 변경이 필요하다면 일반 레퍼런스를 사용합니다.

### 레퍼런스와 포인터

레퍼런스와 포인터는 상호변환될 수 있으며, 대부분의 경우 코드가 더 깔끔하고 오류에 강한 레퍼런스를 사용합니다. 포인터가 사용되는 경우는, 가리키는 주소가 변경되어야 할 경우와 포인터가 선택적인 경우에 사용됩니다.

### 실사용 예제

다음 코드는 *Professional C++, 5th Edition* 에서 직접 발췌한 코드입니다. 배열을 입력받아 해당 배열을 짝수와 홀수의 배열로 쪼개는 함수입니다. 이 때, 우리는 짝수와 홀수 배열의 길이가 얼마나 될 지 모르기 때문에 동적할당도 해주어야 합니다.

```cpp
void separateOddsAndEvens(const int arr[], size_t size, int** odds,
    size_t* numOdds, int** evens, size_t* numEvens)
{
    // 짝수와 홀수의 개수를 센다
    *numOdds = *numEvens = 0;
    for (size_t i = 0; i < size; ++i) {
        if (arr[i] % 2 == 1) {
            ++(*numOdds);
        } else {
            ++(*numEvens);
        }
    }
 
    // 두개의 배열을 적당한 크기로 선언한다
    *odds = new int[*numOdds];
    *evens = new int[*numEvens];
 
    // 홀수와 짝수를 새 배열로 옮긴다
    size_t oddsPos = 0, evensPos = 0;
    for (size_t i = 0; i < size; ++i) {
        if (arr[i] % 2 == 1) {
            (*odds)[oddsPos++] = arr[i];
        } else {
            (*evens)[evensPos++] = arr[i];
        }
    }
}
```

함수가 매우 복잡한데다, 호출하는 코드 또한 불필요해보이는 코드들이 많습니다.

```cpp
int unSplit[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
int* oddNums { nullptr };
int* evenNums { nullptr };
size_t numOdds { 0 }, numEvens { 0 };
 
separateOddsAndEvens(unSplit, std::size(unSplit),
    &oddNums, &numOdds, &evenNums, &numEvens);
 
// 무언가 작업
 
delete[] oddNums; oddNums = nullptr;
delete[] evenNums; evenNums = nullptr;
```

이제 이 코드를 레퍼런스를 사용하도록 바꾸어보겠습니다.

```cpp
void separateOddsAndEvens(const int arr[], size_t size, int*& odds,
    size_t& numOdds, int*& evens, size_t& numEvens)
{
    numOdds = numEvens = 0;
    for (size_t i { 0 }; i < size; ++i) {
        if (arr[i] % 2 == 1) {
            ++numOdds;
        } else {
            ++numEvens;
        }
    }
 
    odds = new int[numOdds];
    evens = new int[numEvens];
 
    size_t oddsPos { 0 }, evensPos { 0 };
    for (size_t i { 0 }; i < size; ++i) {
        if (arr[i] % 2 == 1) {
            odds[oddsPos++] = arr[i];
        } else {
            evens[evensPos++] = arr[i];
        }
    }
}
```

함수의 호출 부분 또한 `separateOddsAndEvens(unSplit, std::size(unSplit), oddNums, numOdds, evenNums, numEvens);` 처럼 `&`로 주소를 넘겨줄 필요가 없어집니다.

하지만 이보다 권장되는 방법은, 배열 대신 동적 배열인 [벡터(Vector)](https://termsigening97.github.io/posts/CPP-STL-Vector/)를 사용하는 것입니다.

```cpp
void separateOddsAndEvens(const vector<int>& arr,
    vector<int>& odds, vector<int>& evens)
{
    for (int i : arr) {
        if (i % 2 == 1) {
            odds.push_back(i);
        } else {
            evens.push_back(i);
        }
    }
}

int main() {
  vector<int> vecUnSplit { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
  vector<int> odds, evens;
  separateOddsAndEvens(vecUnSplit, odds, evens);
}
```

벡터는 내부적으로 `.size()` 로 크기를 알고 있기 때문에 크기값을 전달할 필요가 없고, `.push_back()` 으로 동적으로 길이를 늘릴 수 있기 때문에 훨씬 간단해졌습니다.

하지만 일반적으로 레퍼런스 매개변수로 입력변수 자체를 바꾸는 방법은 권장되지 않으며, 따라서 다음과 같이 **값을 전달하도록** 바꾸는 것이 좋습니다.

```cpp
struct OddsAndEvens { vector<int> odds, evens; };
 
OddsAndEvens separateOddsAndEvens(const vector<int>& arr)
{
    vector<int> odds, evens;
    for (int i : arr) {
        if (i % 2 == 1) {
            odds.push_back(i);
        } else {
            evens.push_back(i);
        }
    }
    return OddsAndEvens { .odds = odds, .evens = evens };
}

int main() {
  vector<int> vecUnSplit { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
  auto oddsAndEvens { separateOddsAndEvens(vecUnSplit) };
}
```

# 형변환, auto 키워드

## 타입 캐스트 연산자

C++에서 모든 변수는 타입이 있고, 이 타입을 형변환(Casting) 하기 위해 const_cast(), static_cast(), reinterpret_cast(), dynamic_cast(), 그리고 std::bit_cast() *(C++20 부터)* 라는 5가지 연산자를 지원하고, 일반적으로 포인터/레퍼런스와 함께 사용됩니다. C와 같이 `(int)3.14` 도 사용 가능하지만, 이는 여러 예외를 지니고 있어 C++에서는 C 방식이 권장되지 않습니다.

* const_cast()

비-const 변수를 const 변수로 변경하거나, 반대로 const 변수에서 const를 없애주기 위해 사용됩니다. 당연하지만, const로 선언했다는 것은 값을 바꾸면 안된다는 것이기에 이 연산자를 사용하면 안되지만, 가끔 const 타입만을 매개변수로 받는데 비-const를 넘겨줘야 하고, 해당 함수가 절대로 해당 변수의 값을 변경하지 않는다면 사용됩니다. 올바른 방법은 전체 코드를 수정하는 것이지만 시간이 부족하거나 타 라이브러리를 사용하는 등의 경우에는 이게 불가능하기 때문에 **함수가 절대 변수의 값을 바꾸지 않는다면** const를 없애주기 위해 사용됩니다.

```cpp
void SomeMethod(char* str);
 
void f(const char* str)
{
    SomeMethod(const_cast<char*>(str));
}
```

위와 같이 `const_cast<바꿀타입>(객체)` 의 형태로 사용됩니다. C++17부터는 `<utility>` 라이브러리에 `std::as_const()` 가 정의되어 있고, 이는 객체의 const형 레퍼런스를 반환합니다. 그래서 `as_const(obj)` 는 타입 T인 obj에 대해 `const_cast<const T&>(obj)` 와 동일하지만 더 간결합니다.

```cpp
string str { "C++" };
const string& constStr { as_const(str) };
```

* static_cast()

명시적 변환이며, 서로 다른 타입간의 형변환입니다.

```cpp
int a { 10 }, b { 3 };
cout << static_cast<double>(a) / b;
```

이 외에 더 자세한 내용은 상속 등 더 고급 문법인 내용들을 배운 후, 필요에 따라 알려드리도록 하겠습니다.

## 타입 별칭

타입 별칭(Type Aliases)은 이미 정의된 타입에 새 이름을 부여하는 것입니다. typedef와 동일하며, C++에서 가독성을 위해 대체되는 문법입니다.

```cpp
using IntPtr = int*;
using uInt = unsigned int;

int *a;
IntPtr b;

a = b;
b = a;
```

원래의 타입 이름과 똑같이 사용할 수 있으며, 이름만 다르지 같은 타입이기 때문에 상호 변환이 가능합니다.

이는 주로 길이가 긴 타입 이름을 간소화하기 위해 사용되며, `string` 타입 또한 사실 축약형입니다.

```cpp
using string = basic_string<char>;
```

## 타입 추론

타입 추론은 표현식의 유형을 자동으로 추론할 수 있도록 하며, 이를 위해 `auto` 와 `decltype` 가 존재합니다.

auto 키워드에는 다양한 사용방식이 있으며, 다음과 같습니다.

* 함수의 `return` 타입 추론
* 구조적 바인딩
* 표현식의 타입 추론
`밑의 내용들은 고급 문법이므로 다루지 않습니다`
* 템플릿 매개변수가 아닌 타입 추론
* 함수 템플릿 구문 축약
* `decltype(auto)`
* 대체 함수 구문
* 제네릭 람다 표현식

auto는 전에도 설명되었었는데, 컴파일러에게 컴파일 시간에 자동으로 타입을 추론할 수 있도록 해줍니다.

```cpp
auto x { "Hello World!" }; // x는 string 타입
```

컴파일 시간에 결정되기 때문에 이후에 x가 다른 타입으로 변화하지는 않습니다. 그리고 위 같은 코드는 사실 `auto`로 얻는 이득이 별로 없습니다. 하지만 만약 타입의 이름이 `vector<vector<pair<int, double>>>` 과 같이 복잡한 타입이라면 코드를 간결하게 만들 수 있겠죠.

### auto&

auto의 또 다른 특징이 있는데, auto는 레퍼런스와 const 한정자를 제거합니다.

```cpp
const string message { "Test" };
const string& foo() {
  return message;
}

auto f1 { foo() };
```

여기서 auto는 const와 레퍼런스를 제거하므로, **복사** 연산이 일어나게 됩니다. 만약 const 레퍼런스가 필요하다면 다음과 같이 하면 됩니다.

```cpp
const auto& f2 { foo() };
```

### auto*

포인터 타입 추론은 정상적으로 이루어집니다.

```cpp
int i { 123 };
auto p { &i }; // p는 int*
```

하지만 포인터는 잘못 다루면 위험하므로, 이것이 포인터 타입을 추론함을 나타내도록 `auto*`를 사용하는 것이 좋습니다.

```cpp
const auto p1 { &i };
auto const p2 { &i };
```

위의 p1과 p2는 `const int*` 일거라 생각되지만, 사실은 `int* const` 입니다. 가리킬 주소를 바꿀 수 없는 포인터 상수가 되는거죠.

```cpp
const auto* p2 { &i };
```

위 코드는 `const int*` 가 됩니다. 만약 위와 같은 방법으로 `int* const` 만들고 싶다면 `auto* const` 로 순서를 바꾸면 됩니다.

### 복사 초기화 vs 직접 초기화

중괄호를 이용한 초기화에는 두 가지 방법이 있습니다.

+ 복사 리스트 초기화: `T obj = {arg1, arg2, ...};`
+ 직접 리스트 초기화: `T obj {arg1, arg2, ...};`

C++17부터는 auto 타입 추론과 함께 중요한 차이점이 존재합니다. (아래의 코드는 `<initializer_list>` 가 필요합니다)

```cpp
// 복사 리스트 초기화
auto a = { 11 };         // initializer_list<int>
auto b = { 11, 22 };     // initializer_list<int>
 
// 직접 리스트 초기화
auto c { 11 };           // int
auto d { 11, 22 };       // 오류, 요소가 너무 많음
```

또한, 복사 리스트 초기화는 중괄호 안이 전부 같은 타입으로 이루어져야 합니다. 그리고 위의 코드는 이전 버전이 C++11/14 기준으로는 둘 다 `initializer_list<int>` 타입이 됩니다.

### decltype

`decltype` 키워드는 표현식을 받아 타입을 계산합니다.

```cpp
int x { 10 };
decltype(x) y { 20 };
```

직관적으로 x의 추론된 타입으로 y의 타입이 정해졌음을 볼 수 있습니다. auto와의 차이점은, decltype는 레퍼런스와 const를 제거하지 않습니다.

```cpp
decltype(foo()) f1 { foo() };
```

별로 쓰임새가 없어 보이지만, 템플릿 프로그래밍에서 사용됩니다.