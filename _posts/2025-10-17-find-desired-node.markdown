---
layout: post
title:  "GDScript에서 원하는 노드 찾기"
date:   2025-10-17 16:00:00 +0900
categories: godot
---

# 경로를 이용해 찾기

일반적으로, 부모 노드가 자식 노드를 접근할 때는 경로를 이용하여 불러온다.
https://docs.godotengine.org/ko/4.x/tutorials/scripting/nodes_and_scene_instances.html

## `$` 기호

`$` 기호와 함께 노드의 경로를 적으면, 현재 코드가 부착된 노드를 기준으로 해당 노드를 찾아오게 할 수 있다
직접 타자를 칠 필요 없이 왼쪽 위의 Scene 뷰에서 노드를 드래그하여 코드로 가져오면 스크립트가 붙은 노드를 기준으로 해당 노드의 경로를 불러온다. 드래그하여 마우스를 뗄 때 Ctrl 키를 누르고 있으면 `@onready` 어노테이션을 알아서 붙여준다
```
# 자식 노드중 이름이 Sprite2D인 노드를 불러옴
@onready var sprite2d = $Sprite2D

# 마찬가지로 ShieldBar 노드 밑의 AnimationPlayer 노드를 불러옴
@onready var animation_player = $ShieldBar/AnimationPlayer

# 자신의 상위 노드에서 StaticBody3D 이름의 노드를 불러온다
@onready var animation_player = $"../StaticBody3D"
```
## `get_node()`

`$` 기호와 동일한 역할을 하지만 이는 다른 노드 밑의 노드를 불러올 수 있으며, 문자열을 이용한다

```
var sprite2d
var camera2d
var animation_player

func _ready():
	sprite2d = get_node("Sprite2D")
	camera2d = get_node("Camera2D")
    animation_player = get_node("ShieldBar/AnimationPlayer")
```

## Unique Name `%`

Scene 뷰에서 노드를 우클릭하고 `%` 기호가 들어간 "Access as Unique Name" 를 체크하면, 이 노드는 경로와 상관없이 이름만으로 바로 접근이 가능하다. 또는, 노드의 이름을 수정할 때 이름 앞에 %를 붙여도 된다

그럼 이제 아래와 같이 사용 가능하다
```
get_node("%RedButton").text = "Hello"
%RedButton.text = "Hello" # Shorter syntax
```
현재 Scene 내에서만 찾을 수 있으며, 현재 Scene 안의 다른 Scene의 Unique Name을 접근하려면 다음과 같이 해야한다
```
get_node("Hand/Sword/%Hilt")
```

# 검색을 이용해 찾기

## `Node.find_child()`

`Node find_child(pattern: String, recursive: bool = true, owned: bool = true) const`
위와 같이 정의되어 있으며, 자손들 중 `name` 이 `pattern` 에 일치하는 첫 번째 자손을 찾아오고, 찾지 못하면 `null`을 반환한다

검색을 해야하기 때문에 비용이 커서 사용이 비추천되며, 사용하더라도 검색한 결과를 변수에 저장하는 것을 추천한다

`Array[Node] find_children(pattern: String, type: String = "", recursive: bool = true, owned: bool = true)`
로 일치하는 모든 자손 노드를 배열로 불러올 수 있다. `type` 을 지정하면 해당 클래스를 상속하는 노드들만 검색한다

`Node find_parent(pattern: String)`
로 부모 노드를 검색할 수도 있다


# 그룹을 이용해 찾기

## `get_nodes_in_group()`

그룹을 이용할 때, 특정 그룹 내의 모든 노드를 찾아올 수 있다.
```
var guards = get_tree().get_nodes_in_group("guards")
```

## `get_first_node_in_group()`

첫 번째 노드만 찾아올 수도 있다
```
var guards = get_tree().get_first_node_in_group("guards")
```