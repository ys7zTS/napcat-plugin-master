import { createPlugin } from './plugin'
import { MasterInstance, sendReply } from './utils'

export const addMaster = createPlugin(/^#添加主人(\d{5,10})$/, async (event, ctx) => {
  const match = event.raw_message.match(/^#添加主人(\d{5,10})$/)
  if (!match) return false
  const userId = match[1]
  const success = MasterInstance.add(userId)
  if (success) {
    await sendReply(ctx, event, `(｡･ω･｡) 已成功添加主人: ${userId}`)
  } else {
    await sendReply(ctx, event, '(╥﹏╥) 添加主人失败，请检查日志')
  }
  return true
}, { name: '添加主人', permission: 'master' })

export const delMaster = createPlugin(/^#删除主人(\d{5,10})$/, async (event, ctx) => {
  const match = event.raw_message.match(/^#删除主人(\d{5,10})$/)
  if (!match) return false
  const userId = match[1]
  const success = MasterInstance.del(userId)
  if (success) {
    await sendReply(ctx, event, `(｡･ω･｡) 已成功删除主人: ${userId}`)
  } else {
    await sendReply(ctx, event, '(╥﹏╥) 删除主人失败，请检查日志')
  }
  return true
}, { name: '删除主人', permission: 'master' })

export const listMaster = createPlugin(/^#主人列表$/, async (event, ctx) => {
  const masters = MasterInstance.get
  if (masters.length === 0) {
    await sendReply(ctx, event, '(｡･ω･｡) 当前暂无主人')
  } else {
    const list = masters.join('\n')
    await sendReply(ctx, event, `(≧▽≦) 当前主人列表:\n${list}`)
  }
  return true
}, { name: '主人列表', priority: 10 })

export const setMaster = createPlugin(/^#设置主人$/, async (event, ctx) => {
  await sendReply(ctx, event, '(｡･ω･｡) #设置主人 功能暂未实现')
  return true
}, { name: '设置主人' })
