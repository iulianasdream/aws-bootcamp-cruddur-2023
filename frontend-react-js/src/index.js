import './tracing.js'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const el_main = document.getElementsByTagName('main')[0];
const root = ReactDOM.createRoot(el_main);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { trace, context, } from '@opentelemetry/api';

const tracer = trace.getTracer();

const rootSpan = tracer.startActiveSpan('document_load', span => {
  //start span when navigating to page
  span.setAttribute('pageUrlwindow', window.location.href);
  window.onload = (event) => {
    // ... do loading things
    alert("Your page is loaded");
    // ... attach timing information
    span.end(); //once page is loaded, end the span
  };

  button.clicked = (event) => {
    tracer.startActiveSpan('app.button_clicked', btnSpan => {
      // Add your attributes to describe the button clicked here
      btnSpan.setAttribute('app.attr.signup', 'app.val.clicked');

      btnSpan.end();
    });
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
