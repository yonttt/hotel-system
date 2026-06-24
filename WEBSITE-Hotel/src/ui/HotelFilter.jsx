import { ChevronDown, Building2 } from 'lucide-react'

/**
 * Reusable "Pilih Hotel" dropdown used across public pages.
 *
 * Props:
 *  - hotels:   array of hotel name strings to choose from
 *  - value:    currently selected hotel name ('' = Semua Hotel)
 *  - onChange: (name) => void
 *
 * Renders nothing when there are no hotels to choose from.
 */
export default function HotelFilter({ hotels = [], value = '', onChange, label = 'Pilih Hotel', className = '' }) {
  if (!hotels || hotels.length === 0) return null

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
        <Building2 size={15} className="text-gold-500" />
        {label}:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-full pl-5 pr-10 py-2.5 text-sm font-semibold
            text-hotel-dark focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 cursor-pointer shadow-sm
            hover:border-gold-300 transition-colors"
        >
          <option value="">Semua Hotel</option>
          {hotels.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
      </div>
    </div>
  )
}
