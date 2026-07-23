import { NavLink } from 'react-router-dom'
import { APP_NAME, ROUTES } from '../utils/constants'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-100 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

/**
 * Top navigation bar with links to main application routes.
 */
function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to={ROUTES.HOME} className="text-lg font-semibold text-indigo-600">
          {APP_NAME}
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to={ROUTES.HOME} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.COMPLAINTS} className={navLinkClass}>
            Complaints
          </NavLink>
          <NavLink to={ROUTES.NEW_COMPLAINT} className={navLinkClass}>
            New Complaint
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
