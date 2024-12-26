import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Set the global worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';  // CDN link for the worker

// Function to extract data from PDF, Image, or Excel (using OCR with Tesseract.js)
export const extractDataFromFile = async (file) => {
  const fileType = file.name.split('.').pop().toLowerCase();

  if (fileType === 'pdf') {
    return await processPDF(file); // Process PDF to extract text
  } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
    return await processImage(file); // Process image directly using Tesseract.js
  } else if (fileType === 'xlsx') {
    return await extractDataFromExcel(file); // Process Excel file using SheetJS
  } else {
    throw new Error('Unsupported file type');
  }
};

// Function to process PDF
const processPDF = async (file) => {
  try {
    console.log('Extracting text from PDF...');
    const pdfData = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument(pdfData).promise;

    const numPages = pdfDoc.numPages;
    let allText = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const content = await page.getTextContent();

      // Extract text from all items on the page
      const pageText = content.items.map((item) => item.str).join('\n');
      allText.push(pageText); // Collect text for each page
    }

    const fullText = allText.join('\n');
    console.log('Extracted text:', fullText);

    if (!fullText.trim()) {
      console.warn('PDF text extraction failed. Falling back to OCR...');
      return await fallbackToOCR(file);
    }

    return processExtractedText(fullText);
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
};

// Fallback to OCR for PDFs
const fallbackToOCR = async (file) => {
  try {
    console.log('Running OCR on PDF...');
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        const imageURL = URL.createObjectURL(blob);

        const extractedData = await processImage(imageURL); // Use OCR on the image
        resolve(extractedData);
      };

      fileReader.onerror = (error) => {
        console.error('Error reading file for OCR:', error);
        reject(error);
      };

      fileReader.readAsArrayBuffer(file); // Read the file for OCR processing
    });
  } catch (error) {
    console.error('Error during OCR fallback:', error);
    throw error;
  }
};

// Function to process image files using Tesseract.js
const processImage = (imageData) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imageData, // The image data (either from PDF or direct image)
      'eng', // Language for OCR (English)
      {
        logger: (m) => console.log(m), // Log progress
      }
    )
      .then(({ data: { text } }) => {
        const extractedData = processExtractedText(text);
        resolve(extractedData);
      })
      .catch((error) => {
        console.error('Error during OCR extraction:', error);
        reject(error);
      });
  });
};


// const normalizeProductTable = (text) => {
//   // Remove excessive spaces and newlines, and collapse fragmented rows
//   const compactText = text.replace(/\s*\n\s*/g, ' ').trim();
//   console.log('Normalized Product Table Text:', compactText);  // Log the normalized text

//   // Extract the product table section
//   const tableStart = compactText.indexOf('Sl Description');
//   const tableEnd = compactText.indexOf('Total Items / Qty');

//   if (tableStart === -1 || tableEnd === -1) {
//     console.warn('Product table boundaries not found.');
//     return [];
//   }

//   const productTable = compactText.slice(tableStart, tableEnd);
//   console.log('Extracted Product Table:', productTable);  // Log the product table content

//   // Split into rows based on consistent patterns (e.g., numbers and text)
//   const rows = productTable.split(/(?=\d+\s)/); // Split when a line starts with a number (Sl No.)

//   return rows.map(row => row.trim()).filter(row => row); // Return cleaned rows
// };


// Function to process the extracted text from OCR results
// Function to process the extracted text from OCR results
const processExtractedText = (text) => {
  // Normalize the text: Remove excessive whitespace and newlines
  const normalizedText = text
  .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
  .replace(/\n\s*\n/g, '\n')  // Remove extra blank lines
  .replace(/\*+/g, '')  // Remove asterisks
  .trim();
  const invoices = [];
  const products = [];
  const customers = [];

  // Extract Invoice Details
  const invoiceNumberMatch = normalizedText.match(/Invoice #:\s*(\S+)/);
  const invoiceDateMatch = normalizedText.match(/Invoice Date:\s*([\d\w\s]+?)\s*Place of Supply/);
  const totalAmountMatch = normalizedText.match(/Total\s+₹\s*([\d,.]+)/);

  const invoiceDetails = {
    serialNumber: invoiceNumberMatch ? invoiceNumberMatch[1] : null,
    customerName: '',
    date: invoiceDateMatch ? invoiceDateMatch[1].trim() : null,
    totalAmount: totalAmountMatch ? parseFloat(totalAmountMatch[1].replace(/,/g, '')) : null,
  };

  invoices.push(invoiceDetails);

  // Extract Customer Name and Phone Number
// Adjusting the regex to make it more flexible for both cases
  // const consigneeMatch = normalizedText.match(/Consignee:\s*([^\n]+)/); // Captures the line after "Consignee:" (first non-empty line)
  const phoneMatch = normalizedText.match(/Ph:\s*(\d+)/);

  const consigneeMatch = normalizedText.match(/Consignee:\s*([^\n]*?)(?=\s*(Buyer|Ph:|\n|:))/);
  // const consigneeMatch = normalizedText.match(/Consignee:\s*([A-Za-z\s]+)(?=\s*(?:NextSpeed|GSTIN|Ph:|[0-9]))/);

    if (consigneeMatch) {
        // Trim and clean up the extracted name
        invoiceDetails.customerName = consigneeMatch[1].trim();
      }


  const customer = {
    customerName: consigneeMatch ? consigneeMatch[1].trim() : 'Unknown', // Extracted customer name
    phoneNumber: phoneMatch ? phoneMatch[1] : 'Unknown', // Extracted phone number
    totalPurchase: totalAmountMatch ? parseFloat(totalAmountMatch[1].replace(/,/g, '')) : 0, // Total purchase amount
  };

  customers.push(customer);




 // Extract Product Table Section
 const productTableStart = normalizedText.indexOf('Sl Description');
 const productTableEnd = normalizedText.indexOf('Total Items / Qty');

 if (productTableStart !== -1 && productTableEnd !== -1) {
   const productTableText = normalizedText.slice(productTableStart, productTableEnd).trim();
   console.log('Product Table Text:', productTableText);

   const lines = productTableText.split(/\s+(?=\d+\s)/); // Split by spaces where rows seem to break
   console.log('Split Lines:', lines);

   let currentRow = [];
   lines.forEach((line, index) => {
     const parts = line.trim().split(/\s+/);

     if (index === 0 || parts[0] === 'Sl' || parts.includes('Description')) return;

     if (/^\d/.test(parts[0])) {
       if (currentRow.length > 0) {
         const product = parseProductRow(currentRow);
         if (product) products.push(product);
       }
       currentRow = parts; // Start new row
     } else {
       currentRow = currentRow.concat(parts);
     }
   });

   if (currentRow.length > 0) {
     const product = parseProductRow(currentRow);
     if (product) products.push(product);
   }
 } else {
   console.warn('Product table boundaries not found.');
 }

  console.log('Extracted customers:', customers);
  return { invoices, products, customers };
};

// Helper function to parse a row into a product object
// Helper function to parse a row into a product object
// Helper function to parse a row into a product object
const parseProductRow = (row) => {
  try {
    // Adjust for the length of the name and numeric columns
    const nameEndIndex = row.length - 6; // Adjusted for the last 5 numeric columns
    const name = row.slice(1, nameEndIndex+0).join(' '); // Combine name parts (e.g., "GEMS CHOCLATE POUCH")

    // Extract numeric values
    const unitPrice = parseFloat(row[nameEndIndex+0].replace(/,/g, '')) || 0; // Unit Price
    const quantity = parseFloat(row[nameEndIndex + 1].replace(/,/g, '')) || 0; // Quantity
    const taxableValue = parseFloat(row[nameEndIndex + 2].replace(/,/g, '')) || 0; // Taxable Value

   // Extract and sanitize tax percentage and amount
    const taxRawAmount = row[nameEndIndex + 3]; // E.g., "238.10"
    const taxRawPercentage = row[nameEndIndex + 4]; // E.g., "(5%)"
    const taxRaw = `${taxRawAmount} ${taxRawPercentage}`.trim(); // Combine both parts
    const taxAmountMatch = taxRaw.match(/^([\d,.]+)/); // Match the tax amount (e.g., "238.10")
    const taxPercentageMatch = taxRaw.match(/\((\d+)%\)/); // Match the tax percentage (e.g., "(5%)")

    const taxAmount = taxAmountMatch ? parseFloat(taxAmountMatch[1].replace(/,/g, '')) : 0;
    const taxPercentage = taxPercentageMatch ? `${taxPercentageMatch[1]}` : '0%';

    // Extract the price with tax
    const priceWithTax = parseFloat(row[nameEndIndex + 5].replace(/,/g, '')) || 0;

    // Return the structured product object
    return {
      name: name.trim(),
      unitPrice: unitPrice.toFixed(4), // Match the exact decimal format for unit price
      quantity: quantity.toLocaleString('en-IN'), // Match the exact thousand separator
      taxableValue: taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }), // Match the format
      tax: `${taxAmount.toFixed(2)} (${taxPercentage})`, // Combine tax amount and percentage
      priceWithTax: priceWithTax.toLocaleString('en-IN', { minimumFractionDigits: 2 }), // Match the format
    };
  } catch (error) {
    console.warn('Error parsing row:', row, error);
    return null;
  }
};




// Function to extract data from Excel files using SheetJS
const extractDataFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Assuming data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Read sheet as array of arrays

      const extractedData = processExtractedExcelData(data);
      resolve(extractedData);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

// Function to process the extracted Excel data
const processExtractedExcelData = (data) => {
  const invoices = data[0].map((row) => ({
    serialNumber: row[0],
    customerName: row[1],
    totalAmount: row[2],
    date: row[3],
  }));

  const products = data[1].map((row) => ({
    name: row[0],
    quantity: row[1],
    unitPrice: row[2],
    tax: row[3],
    priceWithTax: row[4],
  }));

  return { invoices, products };
};



