import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import App from './client/Components/App.jsx';
import {CookiesProvider} from 'react-cookie'


ReactDOM.render(


  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        
        <App />
      </CookiesProvider>
          

    </BrowserRouter>
   
  
 
   
  </React.StrictMode>,
  document.getElementById('root')
);


