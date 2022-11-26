/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)
// 这里会处理平台相关的参数，然后进行聚合
// patch为createPatchFunction函数
export const patch: Function = createPatchFunction({ nodeOps, modules })
