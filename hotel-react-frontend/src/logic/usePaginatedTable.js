import { useState, useEffect, useMemo } from 'react';

/**
 * Shared search + hotel-filter + pagination state for the unified list pages.
 * Each page still owns its own fetch/columns/modals — this only replaces the
 * searchTerm/currentPage/showEntries/selectedHotel state, the filter
 * predicate, and the slicing math that was copy-pasted across ~20 pages.
 *
 * options:
 *  - searchFields: string[]   fields checked (case-insensitive substring) against searchTerm
 *  - hotelField: string | (item, selectedHotel) => boolean   field name to match against the
 *    hotel dropdown (default 'hotel_name'), or a custom matcher for items that store the hotel
 *    under more than one possible field
 *  - initialShowEntries: number
 *  - extraFilter: (item) => boolean   additional predicate (e.g. status, date range)
 */
const usePaginatedTable = (items, options = {}) => {
  const {
    searchFields = [],
    hotelField = 'hotel_name',
    initialShowEntries = 10,
    extraFilter = null
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(initialShowEntries);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedHotel !== 'ALL') {
        const hotelMatches = typeof hotelField === 'function'
          ? hotelField(item, selectedHotel)
          : item[hotelField] === selectedHotel;
        if (!hotelMatches) return false;
      }
      if (extraFilter && !extraFilter(item)) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return searchFields.some((field) => {
          const value = item[field];
          return value != null && String(value).toLowerCase().includes(search);
        });
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, searchTerm, selectedHotel, hotelField, extraFilter, ...searchFields]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentData = filteredItems.slice(startIndex, endIndex);

  return {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems, currentData,
    totalPages, startIndex, endIndex
  };
};

export default usePaginatedTable;
