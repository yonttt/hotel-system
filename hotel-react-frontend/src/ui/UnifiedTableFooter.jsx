/**
 * Shared "unified-footer" entries-count + pagination bar used by the front
 * office / master data list pages.
 *
 * - showPageNumbers: render numbered page buttons.
 * - pageWindowSize: if set (e.g. 5) and totalPages exceeds it, show a sliding
 *   window of that many numbered buttons centered on the current page
 *   instead of one button per page (matches the windowing already used by
 *   AdjustmentPageTemplate / UbahStatusKamar).
 */
const getPageNumbers = (currentPage, totalPages, pageWindowSize) => {
  if (!pageWindowSize || totalPages <= pageWindowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const half = Math.floor(pageWindowSize / 2);
  let start;
  if (currentPage <= half + 1) {
    start = 1;
  } else if (currentPage >= totalPages - half) {
    start = totalPages - pageWindowSize + 1;
  } else {
    start = currentPage - half;
  }
  return Array.from({ length: pageWindowSize }, (_, i) => start + i);
};

const UnifiedTableFooter = ({
  startIndex,
  endIndex,
  total,
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPageNumbers = false,
  pageWindowSize = null,
  extraInfo = null
}) => (
  <div className="unified-footer">
    <div className="entries-info">
      {`Showing ${total > 0 ? startIndex + 1 : 0} to ${Math.min(endIndex, total)} of ${total} entries`}
      {extraInfo}
    </div>
    <div className="pagination">
      {showFirstLast && (
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>First</button>
      )}
      <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</button>
      {showPageNumbers && getPageNumbers(currentPage, totalPages, pageWindowSize).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={currentPage === pageNum ? 'active' : ''}
          style={currentPage === pageNum ? { background: '#17a2b8', color: 'white', borderColor: '#17a2b8' } : undefined}
        >
          {pageNum}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
      {showFirstLast && (
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
      )}
    </div>
  </div>
);

export default UnifiedTableFooter;
