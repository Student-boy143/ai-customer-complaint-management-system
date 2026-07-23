import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

/**
 * Primary layout wrapper used by all authenticated/public pages.
 * Provides consistent navigation and content area.
 */
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
