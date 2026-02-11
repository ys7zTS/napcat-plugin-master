import { OB11Message, OB11MessageData, OB11PostSendMsg } from 'napcat-types'
import { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types'

export async function sendMsg (ctx: NapCatPluginContext, event: OB11Message, message: OB11MessageData | string) {
  const params: OB11PostSendMsg = {
    message_type: event.message_type,
    user_id: event.user_id?.toString(),
    group_id: event.group_id?.toString(),
    message
  }
  return await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config)
}

export const segment = {
  at: (userId: string) => ({ type: 'at', data: { qq: userId } }),
  text: (text: string) => ({ type: 'text', data: { text } }),
  reply: (messageId: string) => ({ type: 'reply', data: { id: messageId } })
}
