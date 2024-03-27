import { createRoot } from 'react-dom/client';
// import { Provider } from 'react-redux';

// import store from './store/index.js';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

root.render(<App />);

{
  /* <Provider store={store}>
  <App />
</Provider>; */
}

// import ReactDOM from 'react-dom/client';

// function App() {
//   return <h1>Rick and Morty</h1>;
// }

// const container = document.getElementById('root');
// const root = ReactDOM.createRoot(container);
// root.render(<App />);
