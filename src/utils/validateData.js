export const validateInvoiceData = (invoice) => {
    const requiredFields = ['serialNumber', 'customerName', 'productName', 'quantity', 'tax', 'totalAmount', 'date'];
    for (let field of requiredFields) {
      if (!invoice[field]) {
        return false;
      }
    }
    return true;
  };
  
  export const validateProductData = (product) => {
    const requiredFields = ['name', 'quantity', 'unitPrice', 'tax', 'priceWithTax'];
    for (let field of requiredFields) {
      if (!product[field]) {
        return false;
      }
    }
    return true;
  };
  
  export const validateCustomerData = (customer) => {
    const requiredFields = ['name', 'phone', 'totalPurchase'];
    for (let field of requiredFields) {
      if (!customer[field]) {
        return false;
      }
    }
    return true;
  };
  