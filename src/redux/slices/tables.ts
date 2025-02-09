import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from '@/utils/axios';

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
  tableRecords: Record<string, any[]>;
  tableSchema: Record<string, any>;
  isLoading: boolean;
  schemaLoading: boolean;
}

const initialState: TablesState = {
  activeDocument: null,
  activeConversation: null,
  documents: [],
  conversations: [],
  messages: [],
  loading: false,
  error: null,
  tableRecords: {},
  tableSchema: {},
  isLoading: false,
  schemaLoading: false,
};

// Async thunks
export const initializeTables = createAsyncThunk(
  'tables/initialize',
  async () => {
    const response = await axios.get('/tables');
    return response.data;
  }
);

export const fetchTableRecords = createAsyncThunk(
  'tables/fetchRecords',
  async ({ tableName, queryParams }: { tableName: string; queryParams: any }) => {
    const response = await axios.get(`/tables/${tableName}`, { params: queryParams });
    return { tableName, records: response.data };
  }
);

export const fetchTableSchema = createAsyncThunk(
  'tables/fetchSchema',
  async ({ tableName }: { tableName: string }) => {
    const response = await axios.get(`/tables/${tableName}/schema`);
    return { tableName, schema: response.data };
  }
);

export const createRecord = createAsyncThunk(
  'tables/createRecord',
  async ({ tableName, record }: { tableName: string; record: any }) => {
    const response = await axios.post(`/tables/${tableName}`, record);
    return { tableName, record: response.data };
  }
);

export const updateRecord = createAsyncThunk(
  'tables/updateRecord',
  async ({ tableName, recordId, updates }: { tableName: string; recordId: string; updates: any }) => {
    const response = await axios.patch(`/tables/${tableName}/${recordId}`, updates);
    return { tableName, record: response.data };
  }
);

export const deleteRecord = createAsyncThunk(
  'tables/deleteRecord',
  async ({ tableName, recordId }: { tableName: string; recordId: string }) => {
    await axios.delete(`/tables/${tableName}/${recordId}`);
    return { tableName, recordId };
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(initializeTables.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeTables.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initializeTables.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchTableRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTableRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableRecords[action.payload.tableName] = action.payload.records;
      })
      .addCase(fetchTableSchema.pending, (state) => {
        state.schemaLoading = true;
      })
      .addCase(fetchTableSchema.fulfilled, (state, action) => {
        state.schemaLoading = false;
        state.tableSchema[action.payload.tableName] = action.payload.schema;
      });
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
export const selectIsLoading = (state: RootState) => state.tables.isLoading;
export const selectSchemaLoading = (state: RootState) => state.tables.schemaLoading;
export const selectTableRecords = (state: RootState, tableName: string) => state.tables.tableRecords[tableName];
export const selectTableSchema = (state: RootState, tableName: string) => state.tables.tableSchema[tableName];

// Export table IDs
export const tableIds = {
  DOCUMENTS_TABLE_ID,
  CONVERSATIONS_TABLE_ID,
  MESSAGES_TABLE_ID,
  USERS_TABLE_ID,
};

export default tablesSlice.reducer;