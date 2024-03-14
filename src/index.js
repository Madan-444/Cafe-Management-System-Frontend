import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom";
import PageRoute from './Routes/PageRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
// define queryClient
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>

    <QueryClientProvider client={queryClient}>
      
    <BrowserRouter> 
      <RecoilRoot>
        <ToastContainer />


         <PageRoute/>

       </RecoilRoot>
    </BrowserRouter>
   
     
    </QueryClientProvider>


  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
