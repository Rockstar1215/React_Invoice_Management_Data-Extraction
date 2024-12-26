import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input } from '@mui/material';
import { extractDataFromFile } from '../services/dataExtractionService'; // Correct import
import { setInvoices } from '../redux/slices/invoiceSlice';
import { setProducts } from '../redux/slices/productSlice';
import { setCustomers } from '../redux/slices/customerSlice';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        // Extract data from the file (PDF, image, or Excel)
        const extractedData = await extractDataFromFile(file);
        console.log('Extracted Products:', extractedData.products);

        // Dispatch extracted data to Redux store
        dispatch(setInvoices(extractedData.invoices));
        dispatch(setProducts(extractedData.products));
        dispatch(setCustomers(extractedData.customers));

      } catch (error) {
        console.error('Error during file processing:', error);
        alert('An error occurred during file processing.');
      }
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload and Extract
      </Button>
    </div>
  );
};

export default FileUpload;
