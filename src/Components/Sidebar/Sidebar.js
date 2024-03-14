import React from 'react'
import {Link} from "react-router-dom"
const Sidebar = () => {

  
  const datas = [

    {
      name:"Dashboard",
      link:""
    },
    {
      name:"Category",
      link:"category"
    },
    {
      name:"Menu List",
      link:"menu"
    },
    {
      name:"Orders",
      link:"orders"
    },
    {
      name:"Reports",
      link:"reports"
    }
    
       ]
  return (
    <div className='Sidebarwrapper'>
    <div className='links'>
          {datas.map((el,index)=>(
            <Link key = {index} to ={`/${el.link}`} style={{textDecoration: "none"}}><li>  {el.name}</li></Link>
          
          ))}
   </div>
        
    </div>
  )
}

export default Sidebar