/**
 * Shared, token-styled data table. Gives every list page the same header
 * background, row height, zebra/hover, alignment and empty/loading/error
 * states — so tables across the system look identical.
 *
 * columns: array of {
 *   key:     unique id (also used to read row[key] if no render)
 *   header:  column heading text
 *   align?:  'left' | 'center' | 'right'   (default 'left')
 *   width?:  CSS width string (e.g. '60px')
 *   render?: (row, rowIndex) => ReactNode   (custom cell)
 * }
 *
 * Usage:
 *   <DataTable
 *     columns={[
 *       { key: 'no', header: 'No', align: 'center', width: '60px',
 *         render: (_r, i) => startIndex + i + 1 },
 *       { key: 'name', header: 'Name' },
 *       { key: 'amount', header: 'Amount', align: 'right',
 *         render: (r) => formatCurrency(r.amount) },
 *     ]}
 *     data={rows}
 *     loading={loading}
 *     error={error}
 *     rowKey={(r) => r.id}
 *   />
 */
const DataTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  emptyText = 'No data found',
  rowKey,
  loadingText = 'Loading...',
  footer = null,
}) => {
  const colSpan = columns.length;

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`dt-${col.align || 'left'}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={colSpan} className="dt-state">{loadingText}</td></tr>
          ) : error ? (
            <tr><td colSpan={colSpan} className="dt-state dt-error">{error}</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={colSpan} className="dt-state">{emptyText}</td></tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} className={`dt-${col.align || 'left'}`}>
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {footer && !loading && !error && data.length > 0 && (
          <tfoot>{footer}</tfoot>
        )}
      </table>
    </div>
  );
};

export default DataTable;
