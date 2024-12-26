import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const InvoiceTable = () => {
  const invoices = useSelector((state) => state.invoices);

  return (
    <div>
      <h2>Invoices</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serial Number</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.serialNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.productName}</TableCell>
              <TableCell>{invoice.quantity}</TableCell>
              <TableCell>{invoice.tax}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
