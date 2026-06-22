/**
 * Shared "unified-header-controls" toolbar used by the front office / master
 * data list pages: title (+ optional action button) and hotel filter on the
 * top row, search and "show entries" on the bottom row.
 *
 * Pass `hotels` to show the hotel filter; omit it for hotel-agnostic lists
 * (e.g. group booking lists, user lists).
 */
const UnifiedTableHeader = ({
  title,
  actions,
  hotels,
  selectedHotel,
  onHotelChange,
  searchTerm,
  onSearchChange,
  showEntries,
  onEntriesChange,
  extraFilters,
  topRightExtra,
  searchPlaceholder = 'Search here...'
}) => (
  <div className="unified-header-controls">
    <div className="header-row header-row-top">
      <div className="unified-header-left">
        <div className="header-title" style={actions ? { display: 'flex', alignItems: 'center', gap: '15px' } : undefined}>
          <span>{title}</span>
          {actions}
        </div>
      </div>
      {(hotels || topRightExtra) && (
        <div className="unified-header-right">
          {hotels && (
            <div className="hotel-select">
              <label>Hotel :</label>
              <select
                className="header-hotel-select"
                value={selectedHotel}
                onChange={(e) => onHotelChange(e.target.value)}
              >
                <option value="ALL">ALL</option>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {topRightExtra}
        </div>
      )}
    </div>
    <div className="header-row header-row-bottom">
      <div className="unified-header-left">
        <div className="search-section">
          <label>Search :</label>
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {extraFilters}
      </div>
      <div className="unified-header-right">
        <div className="entries-control">
          <span className="entries-label">Show entries:</span>
          <select
            className="entries-select"
            value={showEntries}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default UnifiedTableHeader;
