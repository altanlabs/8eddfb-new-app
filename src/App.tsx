import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './theme/theme-provider';
import PDFChatPage from './pages/index';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light">
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
          <main className="main-content">
            <PDFChatPage />
          </main>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;