import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 关键的地方
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    // new 必须通过new的实例化
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // init
  this._init(options) // 和23行代码有关
}

// class 是一个大文件

// 原型上挂在Vue.prototype._init
initMixin(Vue)
// Vue.prototype.$set = set
// Vue.prototype.$delete = del
// Vue.prototype.$watch
// 原型上挂载$set、$delete、$watch等
stateMixin(Vue)
// 初始化事件 Vue.prototype.$on Vue.prototype.$once Vue.prototype.$off Vue.prototype.$emit
eventsMixin(Vue)
// 初始化声明周期 Vue.prototype._update Vue.prototype.$forceUpdate Vue.prototype.$destroy
lifecycleMixin(Vue)
// 初始化渲染函数 Vue.prototype.$nextTick Vue.prototype._render
renderMixin(Vue)

export default Vue
