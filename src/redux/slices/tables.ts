import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Table IDs from the database
const DOCUMENTS_TABLE_ID = '28dcc0ef-1743-4937-b518-3ebc1ec11ed5';
const CONVERSATIONS_TABLE_ID = '8d89eff1-ec76-49b2-834b-ec6affe07a8b';
const MESSAGES_TABLE_ID = 'c78f3893-0684-4682-9aea-68a1cb26e141';
const USERS_TABLE_ID = '3b64d0eb-d481-45f7-9b5d-5a18d6aa93cc';

interface TablesState {
  activeDocument: string | null;
  activeConversation: string | null;
  documents: any[];
  conversations: any[];
  messages: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TablesState = {
  activeDocument: null,
  activeConversation: null,
  documents: [],
  conversations: [],
  messages: [],
  loading: false,
  error: null,
};

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setActiveDocument: (state, action: PayloadAction<string | null>) => {
      state.activeDocument = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
    },
    setDocuments: (state, action: PayloadAction<any[]>) => {
      state.documents = action.payload;
    },
    setConversations: (state, action: PayloadAction<any[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setActiveDocument,
  setActiveConversation,
  setDocuments,
  setConversations,
  setMessages,
  setLoading,
  setError,
} = tablesSlice.actions;

// Selectors
export const selectActiveDocument = (state: RootState) => state.tables.activeDocument;
export const selectActiveConversation = (state: RootState) => state.tables.activeConversation;
export const selectDocuments = (state: RootState) => state.tables.documents;
export const selectConversations = (state: RootState) => state.tables.conversations;
export const selectMessages = (state: RootState) => state.tables.messages;
export const selectLoading = (state: RootState) => state.tables.loading;
export const selectError = (state: RootState) => state.tables.error;

// Export table IDs
export const tableIds = {
  DOCUMENTS_TABLE_ID,
  CONVERSATIONS_TABLE_ID,
  MESSAGES_TABLE_ID,
  USERS_TABLE_ID,
};

export default tablesSlice.reducer;