import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../Context/DataContext';
import { Home } from '../Pages/Home';
import { Login } from '../Pages/Login';
import { Registration } from '../Pages/Registration';
import { Private } from './private';


export const Root = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/home"
            element={
              <Private>
                <Home />
              </Private>
            } />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}