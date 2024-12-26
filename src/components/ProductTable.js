import React from 'react';
import { useSelector } from 'react-redux';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const ProductTable = () => {
  const products = useSelector((state) => state.products);

  return (
    <div>
      <h2>Products</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Taxable Value</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Price with Tax</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                No products found. Upload a file to extract product details.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>{product.taxableValue}</TableCell>
                <TableCell>{product.tax}%</TableCell>
                <TableCell>{product.priceWithTax}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

      </Table>
    </div>
  );
};

export default ProductTable;
