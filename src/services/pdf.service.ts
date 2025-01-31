import axios from '@/utils/axios';

export interface UploadedDocument {
  id: string;
  name: string;
  fileUrl: string;
  uploadDate: string;
  userId: string;
  content: string;
}

export const pdfService = {
  async uploadPDF(file: File): Promise<UploadedDocument> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async getDocuments(): Promise<UploadedDocument[]> {
    const response = await axios.get('/documents');
    return response.data;
  },

  async getDocument(id: string): Promise<UploadedDocument> {
    const response = await axios.get(`/documents/${id}`);
    return response.data;
  },
};