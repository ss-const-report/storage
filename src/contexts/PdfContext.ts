// contexts/PdfContext.js
import React from 'react';

const PdfContext = React.createContext({
  pdfName: '',
  setPdfName: (name: string) => {}
});

export default PdfContext;
