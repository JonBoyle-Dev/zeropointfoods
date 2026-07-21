import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/today', label: 'Today', icon: '◎' },
  { to: '/log', label: 'Log', icon: '＋' },
  { to: '/library', label: 'Library', icon: '⬚' },
  { to: '/recipes', label: 'Recipes', icon: '☰' },
  { to: '/reports', label: 'Reports', icon: '▤' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 border-t border-[#DADFD7] bg-white px-2 pb-3.5 pt-2.5">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            'flex flex-1 flex-col items-center gap-0.5 text-[10.5px] font-medium ' +
            (isActive ? 'text-[#2B6E63]' : 'text-[#5B665D]')
          }
        >
          <span className="text-[19px]">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
