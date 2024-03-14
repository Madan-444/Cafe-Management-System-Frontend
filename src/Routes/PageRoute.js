import React from 'react'
import { Route, Routes } from "react-router-dom"
import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import Page from '../Pages/Error'
import Category from '../Components/Category/Category'
import PrivateRoutes from './PrivateRoutes'
import Menu from '../Components/Menu/Menu'
import TakeOrder from '../Components/Orders/TakeOrder'
import OrderList from '../Components/Orders/OrderList'
import OrderDetails from '../Components/Orders/OrderDetails'
import Reports from '../Components/Reports/Reports'


const PageRoute = () => {
  return (
    <div>
       <Routes>
        <Route path = "/login" element = {<Login/>}/>  
        <Route element={<PrivateRoutes />}>
          <Route path = "/" element = {<Dashboard/>}/>
          <Route path = "/category" element = {<Category/>}/>
          <Route path = "/menu" element = {<Menu/>}/>
          <Route path = "/take-order" element = {<TakeOrder/>}/>
          <Route path = "/orders" element = {<OrderList/>}/>
          <Route path = "/order-details/:orderId" element = {<OrderDetails/>}/>
          <Route path = "/reports" element = {<Reports/>}/>
        </Route>
        <Route path="*" element={<Page/>}/>
       </Routes>
    </div>
  )
}

export default PageRoute