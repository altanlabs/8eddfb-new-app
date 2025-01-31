import axios from '@/utils/axios';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  documentContext?: string;
}

export interface Conversation {
  id: string;
  documentId: string;
  userId: string;
  startTime: string;
  lastUpdated: string;
}

export const chatService = {
  async createConversation(documentId: string): Promise<Conversation> {
    const response = await axios.post('/conversations', { documentId });
    return response.data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await axios.get(`/conversations/${id}`);
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await axios.get(`/messages?conversationId=${conversationId}`);
    return response.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await axios.post('/messages', {
      conversationId,
      content,
      role: 'user',
    });
    return response.data;
  },
};