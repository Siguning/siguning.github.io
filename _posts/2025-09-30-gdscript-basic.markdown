---
layout: post
title:  "GDScript Basic"
date:   2025-09-30 20:00:00 +0900
categories: godot
---

더 자세한 내용은 고도엔진 공식문서를 참조한다 [GDScript reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)

# 변수와 자료형

## 변수 선언과 타입 지정
```
# var 변수명: 타입 = 초기값 의 형태로 선언한다
var health: int = 100
var speed: float = 300.0
var player_name: String = "Player"
var is_alive: bool = true
var position: Vector2 = Vector2(100, 150)
```
타입을 생략할 경우 동적 타이핑(Dynamic Typing) 이 되어 변수의 타입이 **실행 시점(Runtime)** 에 적용된다. 즉, 아무 타입의 값이나 넣을 수 있게 되는데, 이는 성능 저하와 잘못된 타입의 오류 가능성, 자동 완성 미지원 등의 문제로 언제나 타입을 적어 정적 타이핑(Static Typing) 을 하는 것을 권장한다

만약 초기값을 통해 타입을 명확히 알 수 있다면, 엔진이 타입을 자동으로 추론하게 할 수도 있다
```
# health_ratio는 float 타입으로 자동 지정됨
var health_ratio := 1.0 
# player_node는 get_node()가 반환하는 타입으로 자동 지정됨
var player_node := get_node("Player")
```
절대 바뀌지 않는 값은 `const` 키워드를 통해 상수로 선언한다
```
const MAX_SPEED: int = 500
const GRAVITY: float = 9.8
```

## 배열

순서가 있는 데이터의 모음으로, `[]`를 사용해 선언한다
```
# 일반적인 배열 (어떤 타입이든 담을 수 있음)
var inventory = ["Sword", 5, "Potion"]

# 정수만 담을 수 있는 타입 지정 배열
var score_list: Array[int] = [100, 80, 95]

# 배열에 아이템 추가 및 접근
score_list.append(70)
print(score_list[0])
```

## 딕셔너리

Key-Value 쌍으로 데이터를 저장하며, 순서가 없고 `{}` 를 사용해 선언한다
```
var player_stats: Dictionary = {
    "name": "Godot",
    "hp": 100,
    "mp": 50,
    "is_knockdown": false
}

# 데이터 접근 및 수정
print(player_stats["name"])
player_stats["hp"] = 90

# 정적 타이핑 이용
var a: Dictionary[String,  int]
```

## 열거형

서로 연관된 상수를 하나의 그룹으로 묶어 코드의 가독성을 높이며, 주로 상태(State)를 관리할 때 유용하다
```
# Player의 상태를 enum으로 정의
enum State {IDLE, WALK, RUN, JUMP}

# 변수에 enum 타입 지정
var current_state: State = State.IDLE

if current_state == State.WALK:
    print("Walking...")
elif current_state == State.RUN:
    print("Running!")

# 타입 이름을 적지 않을 수도 있다
enum {SUN, MON, TUE}
var day = MON
```
## 연산자
연산자는 고도 엔진 공식 문서를 참조한다. 단, 다음 내용은 중요하니 알아두도록 하자
1.  만약  `/` 연산자의 두 피연사가 모두 [int](https://docs.godotengine.org/en/stable/classes/class_int.html#class-int)라면, 실수 나눗셈이 아닌 정수 나눗셈이 실행된다. 예를 들어  `5  /  2`의 결과는 `2.5` 가 아니라 `2` 이다. 실수값이 필요하다면 최소한 하나의 [float](https://docs.godotengine.org/en/stable/classes/class_float.html#class-float) 값을 쓰도록 한다. 캐스팅 (`float(x)  /  y`) 등이 가능하다
    
2.   `%`  연산자는 int 타입에만 가능하며, float 타입에는 [fmod()](https://docs.godotengine.org/en/stable/classes/class_%40globalscope.html#class-globalscope-method-fmod)  함수를 사용한다.
    
3.  `==`  와  `!=`  는 서로 다른 타입에도 실행되는 경우들이 있는데 (예를들어  `1  ==  1.0`  는 참이다), 그렇지 않은 경우 런타임 에러를 발생한다. float들을 비교할 때에는  [is_equal_approx()](https://docs.godotengine.org/en/stable/classes/class_%40globalscope.html#class-globalscope-method-is-equal-approx) 와 [is_zero_approx()](https://docs.godotengine.org/en/stable/classes/class_%40globalscope.html#class-globalscope-method-is-zero-approx) 함수를 대신 사용해야 한다 (부동소수점 오차)


# 흐름 제어

## 조건문
```
var score: int = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Grade: C")
```
## 반복문

### for 반복문
배열이나 딕셔너리 같은 컬렉션의 각 항목을 순회하며 코드를 반복 실행한다. 숫자를 적어서 특정 숫자 범위를 반복할 수도 있다
```
var fruits = ["Apple", "Banana", "Cherry"]
for fruit in fruits:
    print(fruit)

# 0부터 4까지 5번 반복
for i in 5:
    print(i)
```
### while 반복문
특정 조건이 true인 동안 코드를 계속해서 반복 실행한다
```
var countdown: int = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Blast off!")
```
## match 문

특정 변수의 값에 따라 다른 코드를 실행한다. `match 변수` 와 같이 사용하며, 밑의 값을 하나씩 검사하다 해당 변수의 값과 일치하는 값을 만나면 안의 코드를 실행한 후 종료한다
```
enum PlayerState {IDLE, ATTACK, DODGE}
var state: PlayerState = PlayerState.ATTACK

func _physics_process(delta):
    match state:
        PlayerState.IDLE:
            print("대기 중...")
        PlayerState.ATTACK:
            print("공격!")
        PlayerState.DODGE:
            print("회피!")
        _: # 와일드카드. 위의 어떤 경우에도 해당하지 않을 때 실행 (default)
            print("알 수 없는 상태")
```
이 외에도 when 키워드로 추가 조건 확인 등이 가능하다

# 함수
```
# 반환값이 없는 함수 (void)
func take_damage(amount: int) -> void:
    health -= amount
    print("Health: ", health)

# 정수를 반환하는 함수
func calculate_total_score(scores: Array[int]) -> int:
    var total: int = 0
    for score in scores:
        total += score
    return total

func _ready():
    take_damage(20)
    var my_scores = [10, 20, 30]
    var total = calculate_total_score(my_scores)
    print("Total score: ", total) # 출력: Total score: 60
```

## 변수의 getter와 setter

변수의 값을 읽거나(`get`) 쓸 때(`set`) 특정 함수를 자동으로 실행시킨다. 변수 값의 범위를 제한하거나, 값이 변경될 때 특정 효과를 발동시키는 등이 가능하며, 보통 체력바 업데이트 등에 사용한다
```
var health: int:
    # `health` 값을 읽으려고 할 때 이 함수가 실행됨 (생략가능)
    get:
        return health
    # `health`에 값을 할당하려고 할 때 이 함수가 실행됨 (생략가능)
    set(new_value):
        # 0 ~ 100 사이의 값으로 제한
        health = clamp(new_value, 0, 100) 
        
        if health == 0:
            print("Player Died!")

func _ready():
    # 이제 health 변수에 값을 할당하면 자동으로 set 함수가 호출됨
    health = 120 # 출력: Health changed to: 100
    health -= 50 # 출력: Health changed to: 50
    health -= 60 # 출력: Health changed to: 0, Player Died!

```
