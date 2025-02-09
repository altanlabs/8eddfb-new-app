import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PDFViewer } from '@/components/blocks/pdf-viewer';
import { pdfService } from '@/services/pdf.service';
import { chatService } from '@/services/chat.service';
import {
  selectActiveDocument,
  selectActiveConversation,
  selectMessages,
  setActiveDocument,
  setActiveConversation,
  setMessages,
} from '@/redux/slices/tables';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PDFChatPage() {
  const dispatch = useDispatch();
  const activeDocument = useSelector(selectActiveDocument);
  const activeConversation = useSelector(selectActiveConversation);
  const messages = useSelector(selectMessages);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeConversation) {
      loadMessages();
    }
  }, [activeConversation]);

  const loadMessages = async () => {
    if (!activeConversation) return;
    try {
      const messages = await chatService.getMessages(activeConversation);
      dispatch(setMessages(messages));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setLoading(true);
      try {
        const uploadedDoc = await pdfService.uploadPDF(file);
        dispatch(setActiveDocument(uploadedDoc.id));
        setUploadedFileUrl(uploadedDoc.fileUrl);
        
        // Create a new conversation for this document
        const conversation = await chatService.createConversation(uploadedDoc.id);
        dispatch(setActiveConversation(conversation.id));
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && activeConversation) {
      try {
        const newMessage = await chatService.sendMessage(activeConversation, inputMessage);
        dispatch(setMessages([...messages, newMessage]));
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-black">PDF Chat Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Upload and View Section */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-black">Upload PDF</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-sm text-gray-600"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span>{loading ? 'Uploading...' : 'Drop PDF here or click to upload'}</span>
                  </div>
                </label>
              </div>
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          {uploadedFileUrl && (
            <PDFViewer file={uploadedFileUrl} />
          )}
        </div>

        {/* Chat Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Chat</h2>
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 mb-4 p-4 border rounded-lg overflow-y-auto">
              {messages.map((message: Message, index: number) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white text-black border-gray-200"
                rows={3}
                disabled={!activeConversation}
              />
              <Button
                onClick={handleSendMessage}
                className="self-end bg-blue-500 text-white hover:bg-blue-600"
                disabled={!activeConversation || !inputMessage.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}