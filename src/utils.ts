import { OB11Message, OB11PostSendMsg } from 'napcat-types'
import { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types'
import { Masters } from './master'
import { PluginManager } from './plugin'

/** 发送回复消息 */
export async function sendReply (ctx: NapCatPluginContext, event: OB11Message, message: string) {
  const params: OB11PostSendMsg = {
    message_type: event.message_type,
    user_id: event.user_id?.toString(),
    group_id: event.group_id?.toString(),
    message
  }
  return await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config)
}
/** 主人管理实例 */
export let MasterInstance: Masters
/** 插件管理实例 */
export let PluginManagerInstance: PluginManager

export function setPluginManagerInstance (instance: PluginManager) {
  PluginManagerInstance = instance
}
