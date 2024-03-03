JSX- Javascript extension or Javascript Xml
React creates a virtual DOM in the memory.
The advantage of react is that we can divide a large website/ application into smaller parts-components which are independant of each other making it easier to manage and debug in case of any error. The Logic of each component is different from each other.

npm stands for Node Package Manager
npx stands for Node Package Execute 
node

the difference between npm and npx is that npm is a permanent installer whereas npx is a temporary or one time package installer and each time you want it you need the command again and again.

STEP1: Installation of PostGreSQL, node js and npm
Verigy the installation by typing npm, npx, node.

STEP2: Run this command in your terminal to create a React application named my-react-app:

npx create-react-app my-react-app
The create-react-app will set up everything you need to run a React application.

npm start
Run this in the location of the folder terminal- like go to the location and open the CMD
A new browser window will pop up with your newly created React App! If not, open your browser and type localhost:3000 in the address bar.
and we are shown an other address which is used to access the same website on an other device but the prerequisite is that the device and the laptop on which we have the localhost must be connected on the same Wifi.

Inside the src folder there is a file called App.js and make the changes you want in that page and those will be refleced in the website.
no need to reload the browser and the changes are directly reflected in the browser.

THEORY:
Our goal is to build a SPA- SINGLE PAGE APPLICATION

in index.js of the public folder we have a line div id="root"- this gives the element name 
and the opening point or the entry of the application is index.js of the folder src
in this we have 2 main parts-
	1. <React.StrictMode>
		<App />
	   </React.StrictMode>
	2. A Selector - const root = ReactDOM.createRoot(document.getElementById('root'));- the name of the document element you want to select.

The Task is to build a SPA which satisfies these conditions:
1. Create 50 records in database with the following column fields “sno, customer name, age, phone, location, created_at” and dummy data
2. Create a single page application to display the above data in table format with search option, and pagination with 20 records per page.
3. The created_at column data has to be displayed in two separate columns as “date” and “time”
4. The search functionality will search the data by the column "name" or "location".
5. There should be an option to sort the data either by "date" or by "time".

Task 1:
Open the PostGreSQL connect to the server with the the password and create a table named customers with the given 
-- database.sql
CREATE TABLE customers (
  sno SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  age INT,
  phone VARCHAR(255),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert 50 rows into this table
-- Insert dummy data
INSERT INTO customers (customer_name, age, phone, location) VALUES
  ('John Doe', 30, '1234567890', 'New York'),
  ('Jane Smith', 25, '9876543210', 'Los Angeles'),
  -- Add more dummy data here
  ;

this is one way insering the data
the other way is
const {Pool} =require('pg');
const faker =require('faker');

const pool= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ZitharaDB',
    password: 'root',
    port: 5432,
});

It utilizes the pg module to establish a connection pool to the database and the faker module to generate fake data.

const generateDummyData=()=> {
    const dummyData= [];
    for(let i=0;i<50;i++){
        const record=[
            faker.name.findName(),
            Math.floor(Math.random()*60)+18,
            faker.phone.phoneNumber(),
            faker.address.city(),
            faker.date.recent()
        ];
        dummyData.push(record);
    }
    return dummyData;
};

Inside the loop, it generates random values for name, age, phone number, city, and recent date using methods provided by the faker module.
Each set of fake data is stored as an array and pushed into the dummyData array.

const insertData= async()=>{
    try{
        const client =await pool.connect();
        const dummyData= generateDummyData();
        const insertQuery='INSERT into customers(customer_name, age, phone,location, created_at) VALUES ($1,$2,$3,$4,$5)';
        await Promise.all(dummyData.map(async(record)=>{
            await client.query(insertQuery,record);
        }));
        console.log('success');
        client.release();

    }
    catch(error){
        console.log('error');
    }
    finally{
        pool.end();
    }
};

insertData();

it connects to the database using pool.connect() method, which returns a client from the connection pool. 
It generates dummy data using generateDummyData() function.
Defines an SQL insert query and uses Promise.all() with map() to asynchronously execute multiple insert queries.
After successful insertion, it logs 'success' and releases the client back to the pool.
If there's an error during the insertion process, it logs 'error'.
In the finally block, it ends the connection pool using pool.end().
Calls the insertData() function to start the process of inserting dummy data into the database

after this run the file in which you wrote the code by using the command
node name.js
for me its node insert.js

with this we are done with the task 1 of the assignment

Task2:

i want the complete application to be divided into three components those are
1. header- for this header of the page- a simple header displaying just the title and a margin- this does not have bootstrap but we can use the bootstrap if u want
2.table- to display the data in the format which is collected from the database and in this table we want the date and time to be displayed in two diff columns even though they are taken as one single column
and in this we also include the search property- a search property which searches the content displayed in the table based on  names and location
feature 2- display the above data in table format with search option, and pagination with 20 records per page.
feature 3- There should be an option to sort the data either by "date" or by "time".
3. the footer of the page

the table in turn as 2 component included in this those are pagination- the one which helps in moving from one page to other and
the sort component which is used to sort the data either in ascending or in descending order

app.js => 
|--header
|--table
--|-sortcomponent
--|-pagination
|--footer

lets start with the app.js
lets implement the structure which i described just now

import the header, table and footer.js files and also include the app.css file which helps in styling the main page and the only reason i used it is for implementing a background image which i wanted to use

import Header from './Header';
import './App.css';
import Table from './Table';
import {Footer} from './Footer';

and in each of these files we use a export statement either at the beginning or at the end of the file- this export states that we are using this component somewhere else- using it in a diff module
When you define a component, function, or variable in a file, it belongs to that file's module scope by default. To use that component or function in another file, you need to export it using the export keyword.

and now if you notice this is a difference between the syntaxes uses for the importing both footer and the rest

the reason is because of usage of a simple keyword- default

In JavaScript and React, when exporting a component using export default, you can import it using any name you want when importing. For example:

const Header = () => {
};

export default Header;

You can import Header in another file like this:

import MyCustomHeader from './Header';
Here, MyCustomHeader is just a name you choose to reference the exported Header component.

However, if you export multiple components from a file using named exports, you need to import them using their exact names. For example:

export const Footer = () => {
};

export const SomeOtherComponent = () => {
};
You must import Footer and SomeOtherComponent using their exact names:

import { Footer } from './Footer';
import { SomeOtherComponent } from './SomeOtherComponent';

and in this file at the end we used the export default app becoz we are using this component in the index.js file.

and in this file we are using a function component - we basically have 2 components - class component and the functional component

A functional component is a JavaScript function that returns JSX, while a class component is a JavaScript class that extends React.Component and defines a render() method to return JSX.

and the functional components can take the props as the parameter, it is also called as the stateless component because they do not hold or manage state

we are calling head.js in this
coming to header.js

// Header.js
import React from 'react';
This line imports the React library from the 'react' package. React is necessary for creating and working with React components.

import './Header.css'; 

const Header = ({ title }) => {
This line defines a functional component named Header. It receives props as an object and the title prop from App.js.

  return (
    <header className="header-container">
      <h1 className="header-title">{title}</h1>
      <div className="header-line"></div>
    </header>
  );
};

export default Header;
This line exports the Header component as the default export of this module. 

btw props are properties . they are read only components. it is an object which stores the value of attribute. its an object which is passed from a parent component to a child component.
in case we forget to set the values of the props we can set is using default props
the major use of these props are for validation- validating the types of value passed.
i will tell in detail about it table.js for now in header.js i just used the basic parameter passing that is in app.js i displayed the parameter value and in header.js i wrote the value in {}. in javascript the the value enclosed in {} is the variable.

and like in html we cannot directly write these header or h1 tags its an error to write like that . in jsx we always need to wrap in someti=hing either in a div or an empty <>,</>

coming to second component in app.js- table.js

import React, { useState, useEffect } from 'react';
Imports the necessary modules from React, including the useState and useEffect hooks.

import axios from 'axios';
Axios library for making HTTP requests.

import './Table.css';
import { FaSearch } from 'react-icons/fa';
import SortComponent from './SortComponent';
import Pagination from './Pagination';

const Table = (props) => {
  // Default props
  Table.defaultProps = {
    title: 'Customer Table' // Default title if not provided
  };

this is the default props that i told before . these are defult and used when their value is not provided in the parent functionand that is in our case they are used the title is going to be customer table if its not given as input in the app.js 
as for the part of validation when some of the props are passed with an invalid type , we get warnings on the console.
few props are
 PropType.any- this shows that the props can be of any datatype
PropTYpes.array-
PropTypes.bool
PropTypes.func
PropTypes.number
PropTypes.string

we mention or write these as show below- 
default Props Header.PropTypes={title:PropTypes.String;}

now before going forward lets know about the hooks and states in jsx
state:

Components in React can be stateful or stateless.

A stateful component declares and manages local state in it.
A stateless component is a pure function that doesn't have a local state and side-effects to manage.
A pure function is a function without any side-effects. This means that a function always returns the same output for the same input.

If we take out the stateful and side-effects logic from a functional component, we have a stateless component. Also, the stateful and side-effects logic can be reusable elsewhere in the app. So it makes sense to isolate them from a component as much as possible
this is what we did in the code
With React Hooks, we can isolate stateful logic and side-effects from a functional component
Hooks:
A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components and as we know before functional components are stateless we use these. we uses usestate functional coponent for setting and retrieving the state
major rules we must always follow.

Never call Hooks from inside a loop, condition or nested function
Hooks should sit at the top-level of your component
Only call Hooks from React functional components
Never call a Hook from a regular function
Hooks can call other Hooks

few basic and main hooks are
React provides a bunch of standard in-built hooks:

useState: To manage states. Returns a stateful value and an updater function to update it.
useEffect: To manage side-effects like API calls, subscriptions, timers, mutations, and more.
useContext: To return the current value for a context.

now coming back 

The useState() hook takes the first (initial) value of the state variable as its argument. The second value then sets your state, which is why it's always initiated as setState. 

const [state, setState] = useState(initial values goes here)
set state-used to update the state of the component.


  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('none'); // Initial sorting option
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sorting order

Defines various state variables using the useState hook to manage the component's state. These include customers, filteredCustomers, loading, error, searchQuery, currentPage, pageSize, sortBy, and sortOrder.


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

asynchronous function fetchData to make an HTTP GET request using Axios to fetch customer data from the specified API endpoint.
Sets the retrieved data to the customers state variable and updates the loading state accordingly.
Handles errors by setting the error state and updating the loading state.
 and i will show the backend code in detail afte completing the front end


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


useEffect hook runs every time there is a change in the customers, searchQuery, sortBy, or sortOrder.
It filters the customers array based on the searchQuery entered by the user. If the customer_name or location includes the search query (case insensitive), they are included in the filtered result.
It sorts the filtered customers based on the sortBy and sortOrder state variables. If sortBy is set to 'none', no sorting is applied. Otherwise, it sorts the customers based on the created_at property in ascending or descending order.
The sorted array is then set as the value of the filteredCustomers state variable.

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
Calculates the total number of pages required for pagination based on the length of the filteredCustomers array and the selected pageSize.

  const handlePageChange = page => {
    setCurrentPage(page);
  };
Defines a function handlePageChange to update the currentPage state variable when the user selects a different page.

  const handlePageSizeChange = size => {
    setPageSize(size);
    setCurrentPage(1); // Reset current page when page size changes
  };
Defines a function handlePageSizeChange to update the pageSize state variable and reset the currentPage to 1 when the user changes the page size.

  const handleSortChange = (option) => {
    setSortBy(option);
  };
Defines a function handleSortChange to update the sortBy state variable when the user selects a different sorting option.

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
Defines a function toggleSortOrder to toggle between ascending and descending sorting orders when the user clicks on the sorting option.

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
Slices the filteredCustomers array to obtain a subset of customers for the current page based on the currentPage and pageSize.

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
Checks if the data is still loading or if an error occurred. Renders a loading message or an error message accordingly.


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

This is the table.js from this it is linked to sort.js and paginated .js
let me show the sort.js

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

When clicked, the button calls the toggleSortOrder function. The text of the button depends on the value of sortOrder: if sortOrder is 'asc', it displays 'Ascending', otherwise, it displays 'Descending'.


    </div>
  );
};

export default SortComponent;

this is pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {

This line defines a functional component named Pagination. It receives props as an object and uses object destructuring to extract specific props: currentPage, totalPages, and handlePageChange.

  return (
    <div className="bottom-controls">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>

This line creates a button labeled 'Previous'. When clicked, it calls the handlePageChange function with the argument currentPage - 1, effectively navigating to the previous page. The disabled attribute is set to true if currentPage is equal to 1, preventing users from clicking the button when they are already on the first page.

        Previous
      </button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}

This line generates buttons for each page in the pagination sequence. It uses Array.from() to create an array with a length equal to totalPages. It then maps over this array, generating a button for each index (page).
The key attribute is set to index to provide a unique identifier for each button.
The onClick event is attached to each button, calling the handlePageChange function with the argument index + 1 to navigate to the corresponding page.
The className is conditionally set to 'active' if the current page (currentPage) is equal to the index plus one, indicating that the button represents the current page.
The text content of each button is set to the index plus one, representing the page number.

      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;



now we are done with frontend and in the backend we need to connect to the database and bring the data from the database to this interface

for the backend i have created a folder named as backend- in this i created a file index.js

index.js

const express = require('express');
This line imports the express module, which is a Node.js web application framework for building web applications and APIs.

const bodyParser = require('body-parser');
const { Pool } = require('pg');
This line imports the Pool class from the pg module. The pg module is a PostgreSQL client for Node.js. The Pool class allows you to create a pool of connections to the PostgreSQL database

const cors = require('cors'); // Import cors module
This line imports the cors module, which is middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.js. CORS is a security feature implemented by browsers to restrict access to resources on a web server from another domain.

const app = express();
const port = 5000;
This line defines the port number on which the Express server will listen for incoming requests.

// Middleware
app.use(cors()); // Use cors middleware before defining routes
This line adds the cors middleware to the Express application. It allows the server to respond to requests from different origins.

app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ZitharaDB',
  password: 'root',
  port: 5432,
});
This line creates a new instance of the Pool class, establishing a connection pool to the PostgreSQL database specified by the provided configuration options (user, host, database, password, port).


// Route to fetch customers data
app.get('/api/customers', async (req, res) => {
his line defines a route handler for the HTTP GET requests to the '/api/customers' endpoint.

  try {
    const result = await pool.query('SELECT * FROM customers');
his line executes an SQL query using the pool.query() method provided by the pg module. It selects all columns (*) from the 'customers' table in the PostgreSQL database. The await keyword is used to wait for the query to complete and return the result.

    res.json(result.rows);
res.json(result.rows);: This line sends the query result back to the client as a JSON response. result.rows contains the rows returned by the SQL query.

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log('Server is running on port 5000');
});
This line starts the Express server and makes it listen for incoming HTTP requests on the specified port (port). When the server starts listening, it logs a message indicating that the server is running and listening on the specified port.

