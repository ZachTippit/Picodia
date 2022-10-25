import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import './animations.css';
import './Components/slider.css';
import App from './App';
import { Provider } from 'react-redux'
import { store } from './app/store'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
    ,  document.getElementById('root')
);

reportWebVitals(undefined);
