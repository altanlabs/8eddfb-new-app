import { Provider } from 'react-redux';
import { store } from './redux/store';
import PDFChatPage from './pages/index';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white text-black">
        <main className="main-content">
          <PDFChatPage />
        </main>
      </div>
    </Provider>
  );
}

export default App;