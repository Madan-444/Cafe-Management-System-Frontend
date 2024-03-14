import React from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

const Layout = ({ children }) => {
  return (
    <div className='main-layout'>
      <Navbar />
      <Sidebar />
      {children}

      <Footer />

    </div>
  )
}

export default Layout