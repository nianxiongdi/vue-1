


```js
<div id="app">
    <ul :class="bindCls" class="list" v-if="isShow"></ul>
</div>

with(this) {
    return _c('div', {
        attrs: {
            "id": "app"
        }
    }, [(isShow) ? _c('ul', {
        staticClass: "list",
        class: bindCls
    }) : _e()]) // createEmptyVNode
}
```


```js
with(this){
  return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
}
```