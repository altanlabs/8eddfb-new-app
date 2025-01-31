import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './theme/theme-provider';
import PDFChatPage from './pages/index';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <PDFChatPage />
      </ThemeProvider>
    </Provider>
  );
}

export default App;