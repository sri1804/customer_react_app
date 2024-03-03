import React from 'react';

const SortComponent = ({ sortBy, handleSortChange, toggleSortOrder, sortOrder }) => {
  return (
    <div className="sort-container">
      Sort by:
      <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="none">None</option>
        <option value="date">Date</option>
      </select>
      {sortBy !== 'none' && <button onClick={toggleSortOrder}>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</button>}
    </div>
  );
};

export default SortComponent;
