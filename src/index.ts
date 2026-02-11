/**
 * NapCat 插件模板 - 主入口
 *
 * 导出 PluginModule 接口定义的生命周期函数，NapCat 加载插件时会调用这些函数。
 *
 * 生命周期：
 *   plugin_init        → 插件加载时调用（必选）
 *   plugin_onmessage   → 收到事件时调用（需通过 post_type 判断事件类型）
 *   plugin_onevent     → 收到所有 OneBot 事件时调用
 *   plugin_cleanup     → 插件卸载/重载时调用
 *
 * 配置相关：
 *   plugin_config_ui          → 导出配置 Schema，用于 WebUI 自动生成配置面板
 *   plugin_get_config         → 自定义配置读取
 *   plugin_set_config         → 自定义配置保存
 *   plugin_on_config_change   → 配置变更回调
 *
 * @author Your Name
 * @license MIT
 */

import type {
  PluginModule,
  NapCatPluginContext,
} from 'napcat-types/napcat-onebot/network/plugin/types'
import { EventType } from 'napcat-types/napcat-onebot/event/index'

import { Masters } from './master'
import { registerRoutes } from './Routes'
import { PluginManager } from './plugin'

/**
 * 是否是主人
 * @param userId 用户 ID
 */
export let isMaster = (_userId: string): boolean => { throw new Error('未初始化') }
/** 获取主人列表 */
export let getMasterList: string[] = []
export let Master: Masters | null = null
let Plugin

/** 函数主方法 */
// eslint-disable-next-line camelcase
export const plugin_init: PluginModule['plugin_init'] = async (ctx) => {
  try {
    ctx.logger.info('(｡･ω･｡) 插件初始化中...')
    Master = new Masters(ctx)
    isMaster = (userId: string) => Master!.isMaster(userId)
    getMasterList = Master!.get
    Plugin = new PluginManager()
    await Plugin.loadPlugins()

    registerWebUI(ctx)
    registerRoutes(ctx, Master)

    ctx.logger.info('(≧▽≦) 插件初始化完成')
  } catch (error) {
    ctx.logger.error('(╥﹏╥) 插件初始化失败:', error)
  }
}

/**
 * 消息/事件处理（可选）
 * 收到事件时调用，需通过 post_type 判断是否为消息事件
 */
// eslint-disable-next-line camelcase
export const plugin_onmessage: PluginModule['plugin_onmessage'] = async (ctx, event) => {
  // 仅处理消息事件
  if (event.post_type !== EventType.MESSAGE) return

  // 委托给插件管理器
  await Plugin!.onMessage(ctx, event)
}

// ==================== 内部函数 ====================

/**
 * 注册 WebUI 页面和静态资源
 */
function registerWebUI (ctx: NapCatPluginContext): void {
  const router = ctx.router

  // 托管前端静态资源（构建产物在 webui/ 目录下）
  // 访问路径: /plugin/<plugin-id>/files/static/
  router.static('/static', 'webui')

  // 注册仪表盘页面（显示在 NapCat WebUI 侧边栏）
  // 访问路径: /plugin/<plugin-id>/page/dashboard
  router.page({
    path: 'dashboard',
    title: '主人列表管理',
    htmlFile: 'webui/index.html',
    description: '管理插件的主人列表',
  })

  ctx.logger.debug('WebUI 路由注册完成')
}
