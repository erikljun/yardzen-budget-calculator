import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase/app';
import BudgetCalculator from './BudgetCalculator';
import reportWebVitals from './reportWebVitals';

firebase.initializeApp({
  apiKey: 'AIzaSyD7NUVfrImccSo8FuCBG7bXVk0oLFqgE-k',
  authDomain: 'yardzen-demo.firebaseapp.com',
  databaseURL: 'https://yardzen-demo.firebaseio.com',
  projectId: 'yardzen-demo',
  storageBucket: 'yardzen-demo.appspot.com',
  messagingSenderId: '509183652730',
  appId: '1:509183652730:web:ba2208f7d8e0882f009cc3',
});

ReactDOM.render(
  <React.StrictMode>
    <BudgetCalculator />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
