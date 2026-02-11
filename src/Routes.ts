import { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types'
import { Masters } from './master'

export function registerRoutes (ctx: NapCatPluginContext, Master: Masters) {
  const router = ctx.router
  // 注册主人管理相关的 API
  router.get('/masters', async (req, res) => {
    const list = Master.get
    const data = await Promise.all(list.map(async (userId) => {
      try {
        const info = await ctx.actions.call('get_stranger_info', { user_id: Number(userId) }, ctx.adapterName, ctx.pluginManager.config)
        return {
          userId,
          nickname: info?.nickname || '未知用户',
          avatar: `https://q1.qlogo.cn/g?b=qq&nk=${userId}&s=100`
        }
      } catch (e) {
        return {
          userId,
          nickname: '未知用户',
          avatar: `https://q1.qlogo.cn/g?b=qq&nk=${userId}&s=100`
        }
      }
    }))
    res.json({
      code: 0,
      data
    })
  })
  router.post('/masters/add', (req, res) => {
    const body = req.body as { userId: string } | undefined
    if (!body || !body.userId) {
      return res.status(400).json({ code: -1, message: '缺少 userId 参数' })
    }
    const success = Master.add(body.userId)
    if (success) {
      res.json({ code: 0, message: '添加成功' })
    } else {
      res.status(500).json({ code: -1, message: '添加失败' })
    }
  })
  router.post('/masters/remove', (req, res) => {
    const body = req.body as { userId: string } | undefined
    if (!body || !body.userId) {
      return res.status(400).json({ code: -1, message: '缺少 userId 参数' })
    }
    const success = Master.del(body.userId)
    if (success) {
      res.json({ code: 0, message: '删除成功' })
    } else {
      res.status(500).json({ code: -1, message: '删除失败' })
    }
  })
}
