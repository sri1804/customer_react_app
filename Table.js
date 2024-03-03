import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';
import { FaSearch } from 'react-icons/fa';
import SortComponent from './SortComponent';
import Pagination from './Pagination';

const Table = (props) => {
  // Default props
  Table.defaultProps = {
    title: 'Customer Table' // Default title if not provided
  };

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('none'); // Initial sorting option
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sorting order

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter customers based on search query
    const filtered = customers.filter(
      customer =>
        customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered customers
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'none') return 0;
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredCustomers(sorted);
  }, [customers, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = size => {
    setPageSize(size);
    setCurrentPage(1); // Reset current page when page size changes
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h4>{props.title}</h4>
      <div className="search-and-dropdown-container">
        <div className="dropdown-container">
          <div>
            Show{' '}
            <select value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>{' '}
            entries
          </div>
        </div>

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Find What You Want"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <SortComponent sortBy={sortBy} handleSortChange={handleSortChange} toggleSortOrder={toggleSortOrder} sortOrder={sortOrder} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map(customer => (
              <tr key={customer.sno}>
                <td>{customer.sno}</td>
                <td>{customer.customer_name}</td>
                <td>{customer.age}</td>
                <td>{customer.phone}</td>
                <td>{customer.location}</td>
                <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} /> {/* Pagination component */}
    </div>
  );
};

export default Table;
