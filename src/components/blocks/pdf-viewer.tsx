import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File;
  onLoadSuccess?: (numPages: number) => void;
}

export function PDFViewer({ file, onLoadSuccess }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onLoadSuccess?.(numPages);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center">
        <Document
          file={file}
          onLoadSuccess={handleLoadSuccess}
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            width={window.innerWidth < 768 ? window.innerWidth - 32 : 600}
          />
        </Document>
        
        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={() => setPageNumber(page => Math.max(1, page - 1))}
            disabled={pageNumber <= 1}
            variant="outline"
          >
            Previous
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          
          <Button
            onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
            disabled={pageNumber >= numPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}