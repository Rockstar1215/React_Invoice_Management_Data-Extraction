import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const CustomerTable = () => {
  const customers = useSelector((state) => state.customers);

  return (
    <div>
      <h2>Customers</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Total Purchase Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
              <TableCell>
                {customer.totalPurchase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
