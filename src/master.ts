import { NapCatPluginContext } from 'napcat-types/napcat-onebot/network/plugin/types'
import path from 'path'
import fs from 'node:fs'

export class Masters {
  #init = false
  /** 主人列表路径 */
  Path: string
  /** 缓存 */
  Cache: string[] | null = null
  /** 文件变更监听 */
  Watcher: fs.FSWatcher | null = null
  ctx: NapCatPluginContext
  constructor (ctx: NapCatPluginContext) {
    this.ctx = ctx
    this.Path = path.join(ctx.dataPath, 'masters.json')
    this.init()
  }

  init () {
    if (this.#init) return
    this.#init = true
    if (!fs.existsSync(this.Path)) {
      fs.mkdirSync(this.ctx.dataPath, { recursive: true })
      fs.writeFileSync(this.Path, JSON.stringify([]), 'utf-8')
    }
    this.watch()
    return true
  }

  get get (): string[] {
    try {
      if (this.Cache) return this.Cache
      const data = fs.readFileSync(this.Path, 'utf-8')
      this.Cache = JSON.parse(data) as string[]
      return this.Cache
    } catch (e) {
      return []
    }
  }

  isMaster (userId: string): boolean {
    return this.get.includes(userId)
  }

  add (userId: string): boolean {
    const masters = this.get
    if (masters.includes(userId)) return true
    masters.push(userId)
    return this.save(masters)
  }

  del (userId: string): boolean {
    const masters = this.get
    const index = masters.indexOf(userId)
    if (index === -1) return true
    masters.splice(index, 1)
    return this.save(masters)
  }

  save (data: string[]): boolean {
    try {
      fs.writeFileSync(this.Path, JSON.stringify(data, null, 2), 'utf-8')
      return true
    } catch (e) {
      this.ctx.logger.error('保存主人列表失败:', e)
      return false
    }
  }

  watch () {
    if (this.Watcher) return
    this.Watcher = fs.watch(this.Path, () => {
      this.ctx.logger.info('主人列表文件发生变化，已更新缓存')
      this.Cache = null
    })
  }
}
