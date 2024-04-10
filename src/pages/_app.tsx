import '@/styles/globals.css'
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import PdfContext from '@/contexts/PdfContext';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [pdfName, setPdfName] = useState('default.pdf'); // Set a default or initial value

  return (
    <PdfContext.Provider value={{ pdfName, setPdfName }}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </PdfContext.Provider>
  );
}
