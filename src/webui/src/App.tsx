import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ToastContainer from './components/ToastContainer'
import MastersPage from './pages/MastersPage'
import { useTheme } from './hooks/useTheme'

export type PageId = 'masters'

const pageConfig: Record<PageId, { title: string; desc: string }> = {
  masters: { title: '主人列表管理', desc: '管理 Bot 的主人列表，主人拥有最高权限' }
}

function App () {
  const [currentPage, setCurrentPage] = useState<PageId>('masters')
  const [isScrolled, setIsScrolled] = useState(false)

  useTheme()

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 10)
  }

  const renderPage = () => {
    return <MastersPage />
  }

  return (
    <div className='flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#18191C] text-gray-800 dark:text-gray-200 transition-colors duration-300'>
      <ToastContainer />
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-y-auto' onScroll={handleScroll}>
          <Header
            title={pageConfig[currentPage].title}
            description={pageConfig[currentPage].desc}
            isScrolled={isScrolled}
            currentPage={currentPage}
          />
          <div className='px-4 md:px-8 pb-8'>
            <div key={currentPage} className='page-enter'>
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
