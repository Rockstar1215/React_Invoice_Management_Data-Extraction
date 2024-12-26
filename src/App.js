import React from 'react';
import FileUpload from './components/FileUpload';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import Customers from './pages/Customers';
import { Tabs, Tab } from '@mui/material';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <h1>Automated Data Extraction and Management</h1>
      <FileUpload />
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Invoices" />
        <Tab label="Products" />
        <Tab label="Customers" />
      </Tabs>

      {value === 0 && <Invoices />}
      {value === 1 && <Products />}
      {value === 2 && <Customers />}
    </div>
  );
}

export default App;
