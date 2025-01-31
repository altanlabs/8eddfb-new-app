import { combineReducers } from '@reduxjs/toolkit';
import tablesReducer from './slices/tables';

const rootReducer = combineReducers({
  tables: tablesReducer,
});

export default rootReducer;