import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Component/Resister/Them';
import { Provider } from 'react-redux';
import store from './app/store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
//   <React.StrictMode>
//   <ThemeProvider theme={theme}>
//   <App />
// </ThemeProvider>,
//   </React.StrictMode>
<Provider store={store}>
<ThemeProvider theme={theme}>
<App />
</ThemeProvider>
</Provider>,
document.getElementById('root')
);


reportWebVitals();
