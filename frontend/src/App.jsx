import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ComplaintsPage from './pages/ComplaintsPage'
import NewComplaintPage from './pages/NewComplaintPage'
import { ROUTES } from './utils/constants'

/**
 * Root application component.
 * Defines client-side routing for all pages.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COMPLAINTS} element={<ComplaintsPage />} />
          <Route path={ROUTES.NEW_COMPLAINT} element={<NewComplaintPage />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
