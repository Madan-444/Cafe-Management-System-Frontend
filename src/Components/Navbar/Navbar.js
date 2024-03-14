import React, { useEffect, useRef, useState } from 'react'

import Logo from './images/logo.png'
import Link from 'antd/es/typography/Link'
import { useNavigate } from 'react-router'

const Navbar = () => {
    const [showLogout,setLogout] = useState(false)
    const wrapperRef = useRef(null);
    const history = useNavigate()

    useEffect(() => {
        if (showLogout) {
          function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
              setLogout(!showLogout);
            }
          }
    
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }
      }, [showLogout]);

    const handleLogout = ()=> {
        localStorage.removeItem('token')
        history('/login')
    }

  return (
   <>
    <div className='Navwrapper'>
    <Link to='/'>
        <div className='logo'>
            <img src = {Logo} alt = ""/>
           
        </div>
        </Link>

        <div className='profile'>
            <p onClick={()=> setLogout(true)}>Profile</p>
            <div className={`profile-modal ${showLogout && 'active'}`} ref={wrapperRef} onClick={handleLogout}>
                <p>Log Out</p>
            </div>
        </div>
       
    </div>

        

   </>
  )
}

export default Navbar


