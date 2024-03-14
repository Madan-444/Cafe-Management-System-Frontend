import React from 'react'
import { Outlet } from 'react-router'
import { checkIsAuthorized } from '../Utils/isAuth'
import RedirectPage from './RedirectPage'

function PrivateRoutes() {
    let count = 90
    return (
        checkIsAuthorized() ?
        <Outlet />
     : 
        <RedirectPage />
    )
    
}

export default PrivateRoutes