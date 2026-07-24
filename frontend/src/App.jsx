import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import ComplaintsPage from './pages/ComplaintsPage'
import NewComplaintPage from './pages/NewComplaintPage'
import EditComplaintPage from './pages/EditComplaintPage'
import { ROUTES } from './utils/constants'

/**
 * Root application component.
 * Defines client-side routing for all pages.
 */
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.COMPLAINTS} element={<ComplaintsPage />} />
            <Route path={ROUTES.NEW_COMPLAINT} element={<NewComplaintPage />} />
            <Route path={ROUTES.EDIT_COMPLAINT} element={<EditComplaintPage />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
