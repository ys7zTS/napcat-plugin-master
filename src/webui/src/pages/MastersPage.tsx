import { useState, useEffect, useCallback } from 'react'
import { authFetch } from '../utils/api'
import { showToast } from '../hooks/useToast'
import { IconRefresh, IconX } from '../components/icons'

export default function MastersPage () {
  const [masters, setMasters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [newUserId, setNewUserId] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const fetchMasters = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch<string[]>('/masters')
      if (res.code === 0 && res.data) {
        setMasters(res.data)
      }
    } catch {
      showToast('获取主人列表失败', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMasters() }, [fetchMasters])

  const handleAdd = async () => {
    if (!newUserId) {
      showToast('请输入 QQ 号', 'warning')
      return
    }
    if (!/^\d{5,10}$/.test(newUserId)) {
      showToast('QQ 号需为 5-10 位纯数字', 'warning')
      return
    }
    try {
      const res = await authFetch('/masters/add', {
        method: 'POST',
        body: JSON.stringify({ userId: newUserId }),
      })
      if (res.code === 0) {
        showToast('添加成功', 'success')
        setNewUserId('')
        setIsAdding(false)
        fetchMasters()
      } else {
        showToast(res.message || '添加失败', 'error')
      }
    } catch {
      showToast('请求失败', 'error')
    }
  }

  const handleRemove = async (userId: string) => {
    try {
      const res = await authFetch('/masters/remove', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      })
      if (res.code === 0) {
        showToast('已移除', 'success')
        fetchMasters()
      } else {
        showToast(res.message || '移除失败', 'error')
      }
    } catch {
      showToast('请求失败', 'error')
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='loading-spinner text-primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6 animate-fade-in-up'>
      <div className='flex justify-end items-center'>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-400 font-medium'>
            {masters.length}/100
          </span>
          {isAdding
            ? (
              <div className='flex items-center gap-2 animate-fade-in-right'>
                <input
                  type='text'
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  placeholder='输入 QQ 号'
                  className='px-3 py-1.5 bg-white dark:bg-[#1e1e20] border border-gray-200 dark:border-gray-800 rounded-md text-sm w-32 focus:outline-none focus:border-primary transition-colors'
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  className='px-4 py-1.5 bg-primary hover:bg-brand-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm'
                >
                  确定
                </button>
                <button
                  onClick={() => { setIsAdding(false); setNewUserId('') }}
                  className='px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                >
                  取消
                </button>
              </div>
            )
            : (
              <button
                onClick={() => setIsAdding(true)}
                className='px-6 py-1.5 bg-primary hover:bg-brand-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm'
              >
                添加主人
              </button>
            )}
          <button
            onClick={fetchMasters}
            className='p-1.5 text-gray-400 hover:text-primary transition-colors'
            title='刷新数据'
          >
            <IconRefresh size={18} />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {masters.map((master) => (
          <div
            key={master}
            className='flex items-center justify-between bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] rounded-xl px-3 py-1.5 hover:shadow-sm transition-all group'
          >
            <span className='text-gray-700 dark:text-gray-200 font-mono text-sm'>{master}</span>
            <button
              onClick={() => handleRemove(master)}
              className='w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm'
              title='删除主人'
            >
              <IconX size={12} />
            </button>
          </div>
        ))}

        {masters.length === 0 && (
          <div className='col-span-full py-20 text-center text-gray-400 bg-gray-50/50 dark:bg-white/[0.01] border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl'>
            暂无主人配置
          </div>
        )}
      </div>

      <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800'>
        <div className='bg-brand-50/50 dark:bg-brand-900/5 p-4 rounded-xl'>
          <p className='text-xs text-brand-600/70 dark:text-brand-400/50 leading-relaxed font-medium'>
            * 主人拥有插件的最高权限，请谨慎添加。修改实时生效，无需重启插件。
          </p>
        </div>
      </div>
    </div>
  )
}
