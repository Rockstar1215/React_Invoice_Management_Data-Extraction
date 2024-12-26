import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const Invoices = () => {
  const invoices = useSelector((state) => state.invoices);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Serial Number</TableCell>
          <TableCell>Customer Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Total Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={invoice.serialNumber || index}> {/* Unique key */}
            <TableCell>{invoice.serialNumber}</TableCell>
            <TableCell>{invoice.customerName}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Invoices;
