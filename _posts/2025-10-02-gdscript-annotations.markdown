---
layout: post
title:  "GDScript 어노테이션"
date:   2025-10-02 20:00:00 +0900
categories: godot
---

[모든 어노테이션 정보](https://docs.godotengine.org/en/stable/classes/class_@gdscript.html)

Godot 엔진이나 편집기가 스크립트를 처리하는 방식에 영향을 주는 문법으로, @로 시작한다

# `@export`

멤버 변수에 사용할 수 있으며, 가장 많이 사용하는 어노테이션이다. 기본적으로 인스펙터에서 수정할 수 있게 만들어 준다라고 알면 되지만, 더 깊게 들어가면 변수의 값을 Resource와 같이 저장해 준다는 것(코드와 별개로 저장된다는 것)과 RPC를 통해 전송 가능해지는 효과가 있다

무조건 상수로 초기화되거나 타입을 지정해주어야 한다

```
@export var number = 5

@export var number: int

@export var resource: Resource
@export var node: Node
```

## `@export_group`

export된 변수들을 그룹화할 수 있다. `@export_group` 이 선언된 이후의 export들은 해당 그룹에 속해있게 되는데, 새 그룹을 만들거나 `@export_group("")` 을 사용해 그룹을 끊을 수 있다
```
@export_group("My Properties")
@export var number = 3
```

### `@export_subgroup`

그룹 안에 그룹을 만드려면 위 속성을 사용한다
```
@export_subgroup("Extra Properties")
@export var string = ""
@export var flag = false
```

## String 관련 export

### `@export_file`

문자열을 파일의 경로로 사용한다. 패턴을 부여할 수 있으며, 이 경우 해당 문자열 패턴에 일치하는 파일만 선택 가능해진다

```
@export_file var sound_effect_path: String
@export_file("*.txt") var notes_path: String
@export_file var level_paths: Array[String]
```

### `@export_dir`

문자열을 디렉토리의 경로로 사용한다

```
@export_dir var sprite_folder_path: String
@export_dir var sprite_folder_paths: Array[String]
```

### `@export_global_file`, `@export_global_dir`

프로젝트 외부의 파일까지 접근할 수 있는 버전이다

### `@export_multiline`

Dictionary에도 사용 가능한데, 인스펙터에서 한 줄 공간이 아닌 여러 줄 공간으로 표시해준다

## `@export_range`

말 그대로 값의 범위를 정해줘 슬라이더로 보이게 만든다. 보통 `@export_range(최대값, 최소값, 스냅값)` 과 같이 사용하며, 스냅값은 생략이 가능한데 슬라이더를 한 칸 움직일 때 얼마씩 증가/감소할지를 정한다. 이 외에 뒤에 옵션을 추가해 줄 수도 있는데, 다음과 같다
- "or_greater" : 설정한 범위의 최댓값을 초과하는 값을 입력할 수 있게 한다. 즉, 값의 상한선을 없앤다

- "or_less" : 설정한 범위의 최솟값 미만의 값을 입력할 수 있게 한다. 즉, 값의 하한선을 없앤다

- "exp" : 슬라이더로 값을 조절할 때 값이 선형적(linearly)이 아닌 지수적(exponentially)으로 변경되도록 한다 (예: 사운드 볼륨 조절에 유용)

- "hide_slider" : 에디터 위젯에서 슬라이더를 숨기고 숫자 입력 필드만 표시한다

- "radians_as_degrees" : 실제 값은 라디안(radians)이지만 인스펙터 창에서는 사람이 읽기 편한 각도(degrees)로 표시하고 편집할 수 있게 한다 (설정하는 범위 값 또한 각도 기준)

- "degrees" : 실제 값은 변경하지 않고, 숫자 뒤에 도(°) 기호를 단위로 붙여서 표시한다

- "suffix:unit" : 원하는 문자열을 단위(unit)로 붙여서 표시한다 (예: "suffix:px", "suffix:m/s")

```
@export_range(0, 20) var number
@export_range(-10, 20) var number
@export_range(-10, 20, 0.2) var number: float
@export_range(0, 20) var numbers: Array[float]

@export_range(0, 100, 1, "or_greater") var power_percent
@export_range(0, 100, 1, "or_greater", "or_less") var health_delta

@export_range(-180, 180, 0.001, "radians_as_degrees") var angle_radians
@export_range(0, 360, 1, "degrees") var angle_degrees
@export_range(-8, 8, 2, "suffix:px") var target_offset
```

## `@export_enum`

주어진 값 중 하나만 선택 가능하도록 만든다. 선택된 값은 순서대로 0, 1, 2과 같이 숫자가 배정된다. `:` 을 이용하여 값을 지정할 수도 있으며, 값을 지정하지 않으면 `이전의 값 + 1` 을 사용한다

enum을 직접 만들지 않고 사용하는 것이며, enum을 만들었다면 `@export` 를 사용하면 된다
```
@export_enum("Warrior", "Magician", "Thief") var character_class: int
@export_enum("Slow:30", "Average:60", "Very Fast:200") var character_speed: int
# A는 1, B는 10, C는 11, D는 12가 됨
@export_enum("A", "B:10", "C", "D") var character_type: int

@export_enum("Rebecca", "Mary", "Leah") var character_name: String
@export_enum("Sword", "Spear", "Mace") var character_items: Array[int]
@export_enum("double_jump", "climb", "dash") var character_skills: Array[String]
```

## `@export_flags`

int타입을 비트필드로서 사용한다면 `@export_flags` 로 각 비트를 선택하게 할 수 있다. `:` 을 이용하여 값을 지정할 수 있으며, 이는 무조건 2의 승수여야 하고 `1 ~ 2^31-1` 범위의 값을 지정할 수 있다. 값을 일부분만 지정한 경우 `@export_enum` 와 다르게 이전의 값을 사용하지 않는다

```
@export_flags("Fire", "Water", "Earth", "Wind") var spell_elements = 0
@export_flags("Self:4", "Allies:8", "Foes:16") var spell_targets = 0

# B는 2, C는 4가 됨
@export_flags("A:16", "B", "C") var x
```

`@export_flags_2d_navigation`, `@export_flags_2d_physics`, `@export_flags_2d_render`, `@export_flags_3d_navigation`, `@export_flags_3d_physics`, `@export_flags_3d_render`, `@export_flags_avoidance` 과 같이 엔진에 존재하는 비트필드를 사용하는 어노테이션들도 존재하며, 이들은 프로젝트 설정에 따라 이름이 변경된다는 이점이 있다
```
@export_flags_2d_navigation var navigation_layers: int
@export_flags_2d_navigation var navigation_layers_array: Array[int]
```

## `@export_tool_button`

인스펙터에 버튼을 만들며, 버튼에 지정된 Text를 적어준다. 두 번째 매개변수로 아이콘을 넘겨줄 수 있으며, 아이콘을 지정하면 `Control.get_theme_icon()` 을 이용하여 아이콘을 불러온다

```
@tool
extends Sprite2D

@export_tool_button("Hello") var hello_action = hello
@export_tool_button("Randomize the color!", "ColorRect")
var randomize_color_action = randomize_color

func hello():
	print("Hello world!")

func randomize_color():
	var undo_redo = EditorInterface.get_editor_undo_redo()
	undo_redo.create_action("Randomized Sprite2D Color")
	undo_redo.add_do_property(self, &"self_modulate", Color(randf(), randf(), randf()))
	undo_redo.add_undo_property(self, &"self_modulate", self_modulate)
	undo_redo.commit_action()
```

# `@icon`

현재 스크립트에 아이콘을 부여한다. 클래스 정의 나 상속문보다 위에 작성되어야 하기 때문에 보통 맨 윗줄에 작성한다
```
@icon("res://path/to/class/icon.svg")
```
# `@onready`

`_ready()` 직전에 실행되며, 보통 초기값이 런타임에 결정되어야 하는 상황에 쓰인다

```
@onready var character_name = $Label

@export var max_health = 1000
@onready var health = max_health
```

# `@tool`

현재 스크립트를 에디터에서 실행되게 만든다. 즉, 게임을 실행하지 않아도 실행되며 보통 커스텀 에디터 등을 만들때 사용한다. 클래스 정의/상속보다 위에 선언되어야 하므로 보통 맨 윗줄에 작성한다

쓰임새는 [에디터에서 코드 실행하기](https://docs.godotengine.org/en/stable/tutorials/plugins/running_code_in_the_editor.html) 공식 문서를 참조한다

```
@tool
extends Node
```