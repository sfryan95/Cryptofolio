import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

root.render(<App />);
