import { OB11Message } from 'napcat-types'
import { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types'
import { isMaster } from './index'

interface PluginType {
  /** 插件正则 */
  reg: RegExp
  /** 插件回调函数 */
  handler: (event: OB11Message, ctx: NapCatPluginContext) => any | Promise<any>
  /** 插件名称 */
  name?: string
  /** 插件优先级 */
  priority: number
  /** 插件权限 */
  permission: 'master' | 'all'
}
/** 创建插件 */
export function createPlugin (
  reg: RegExp,
  handler: (event: OB11Message, ctx: NapCatPluginContext) => any | Promise<any>,
  options?: {
    name?: string
    priority?: number
    permission?: 'master' | 'all'
  }
): PluginType {
  return {
    /** 插件正则 */
    reg,
    /** 插件回调函数 */
    handler,
    /** 插件名称 */
    name: options?.name,
    /** 插件优先级 */
    priority: options?.priority ?? 100,
    /** 插件权限 */
    permission: options?.permission ?? 'all'
  }
}

export class PluginManager {
  #plugins: PluginType[] | null = null

  async loadPlugins () {
    const plugins = await import('./func')
    this.#plugins = Object.values(plugins).filter(
      (v): v is PluginType => v && typeof v === 'object' &&
        v.reg instanceof RegExp &&
        typeof v.handler === 'function'
    )
    this.#plugins.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
  }

  async onMessage (ctx: NapCatPluginContext, event: OB11Message) {
    if (!this.#plugins) return false

    for (const plugin of this.#plugins) {
      if (plugin.reg.test(event.raw_message)) {
        if (plugin.permission === 'master' && !isMaster(event.user_id.toString())) {
          continue
        }

        try {
          const result = await plugin.handler(event, ctx)
          if (result === true || result === undefined) {
            return true
          }
        } catch (error) {
          ctx.logger.error(`(╥﹏╥) 插件 ${plugin.name || '未命名'} 执行出错:`, error)
        }
      }
    }
    return false
  }
}
