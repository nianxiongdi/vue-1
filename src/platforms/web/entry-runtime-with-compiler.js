/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
// 挂在$mount
/**
 * el解析转换为template
 * 判断是否有render函数   返回
 * 没有话获取template去获取render函数
*/
// runtime-compiler版本执行的$mount
Vue.prototype.$mount = function (
  el?: string | Element, // 可传两种类型
  hydrating?: boolean
): Component {
  // 转换为dom对象
  el = el && query(el)

  /* istanbul ignore if */
  // el不能够挂载document.body或document.documentElement上面，
  // 意思就是对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  /*
  	如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。
    这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，
    无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，
    最终都会转换成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，
    它是调用 compileToFunctions 方法实现的，编译过程我们之后会介绍。
    最后，调用原先原型上的 $mount 方法挂载。
  */
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      // 判断template是否存在
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      // 编译template
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
