import { useState, useRef, useEffect } from 'react'

const SearchableSelect = ({ 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...",
  className = "form-select",
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options)
    } else {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
    }
  }, [searchTerm, options])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get display value
  const getDisplayValue = () => {
    const selectedOption = options.find(option => option.value === value)
    return selectedOption ? selectedOption.label : ''
  }

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }

  const handleOptionSelect = (optionValue) => {
    onChange({
      target: {
        name,
        value: optionValue
      }
    })
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredOptions.length === 1) {
        handleOptionSelect(filteredOptions[0].value)
      }
    }
  }

  return (
    <div className="searchable-select" ref={dropdownRef}>
      <div 
        className={`searchable-select-input ${className} ${disabled ? 'disabled' : ''}`}
        onClick={handleInputClick}
      >
        <span className={`searchable-select-value ${!value ? 'placeholder' : ''}`}>
          {getDisplayValue() || placeholder}
        </span>
        <span className="searchable-select-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="searchable-select-dropdown">
          <div className="searchable-select-search">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="searchable-select-search-input"
            />
          </div>
          <div className="searchable-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value || index}
                  className={`searchable-select-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="searchable-select-no-options">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect