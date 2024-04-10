import type { NextApiRequest, NextApiResponse } from 'next';

const uploadPdf = async (req: NextApiRequest, res: NextApiResponse) => {
  const placeCode = 'smartsolar';
  const siteCode = req.query.siteCode;
  const token = 'a097eeaa2ad6227d95066c433608e369';

  console.log("sitecode", siteCode);


  // Assuming `file` is the PDF buffer you've fetched or the file that has been uploaded to your Next.js API route.
  const pdfBuffer = req.body.file; // You may need to adjust this line according to how you're receiving the file.

  const formData = new FormData();
  formData.append('file_type', '各種図面');
  // Append the PDF buffer or stream directly, with a filename.
  formData.append('data[files][]', new Blob([pdfBuffer], { type: 'application/pdf' }), 'report.pdf');
  formData.append('update_crew', '90810');

  try {
    const response = await fetch(`https://stg.dandoli.jp/api/co/places/${placeCode}/sites/${siteCode}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Server responded with status code ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  
    res.status(200).json({ message: 'File uploaded successfully', result });
  } catch (error) {
    console.error('File upload failed:', error);

    // Decide on how you want to handle the error response
    // Here is an example:
    res.status(500).json({ message: 'File upload failed', error: error });
  }
};

export default uploadPdf;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Set desired value here
    },
    responseLimit: false,
  },
  maxDuration: 120,
};

