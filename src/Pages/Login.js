import React from 'react'

import Cafe from '../Assets/cafe.jpeg'
// import { useRecoilState } from 'recoil'
// import { updateCount } from '../Recoil/count.recoil'
import { useForm } from 'react-hook-form';
import useAxiosPrivate from '../CustomHooks/useAxiosPrivate';
import { useMutation } from 'react-query';
import { apiRequest } from '../api/api.services';
// import useLocalStorage from '../CustomHooks/useLocalStorage';
import {  toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const Login = () => {
    const history = useNavigate()
    const axiosPrivate = useAxiosPrivate()

    //for recoil
    // const [count,setCount] = useRecoilState(updateCount);

    // const handleClick = ()=> {
    //     setCount({
    //         count: count.count + 1
    //     })
    // }
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const handleLogin = (data)=> {
      console.log("the data igotot",data)
            //  alert(`Username is ${data.Username} and password is ${data.Password}`)
      postData(data)
    }

    const {
      mutate: postData,
      isLoading,
      data,
    } = useMutation(
      (data) =>
        apiRequest(axiosPrivate, {
          url: `/user/login`,
          method: "post",
          data,
        }),
      {
        onSuccess: (res) => {
          toast("Login Sucessfully")
          history('/')
          localStorage.setItem("token",res.data.token)
        },
         onError: (e) => {
          console.log("the errr",e)
        },
      }
    );

  return (
    <>
     <div className='Login'>
      <form onSubmit={handleSubmit(handleLogin)}>
      <div className="logincontainer">
        <div className="logincontainerimage">
         <img src ={Cafe} />
        </div>
        <div className="logincontainerform">
          <p>Layana Cafe and Service</p>
          <h2>Login</h2>
        <div className="login-form">
          <div className='login-form-item'> 
            <input type = "text" {...register("email", {required: true})}  placeholder='User Name'/>      
          </div>
          
          {errors.email && <p className='error'> Email is required.</p>}
         
        
          <div className='login-form-item'>
            <input type = "password"  {...register("password", {required: true})} placeholder='Password'/>
          </div>
          <div className='errors'>

          {errors.password && <p className='error'> Password is required.</p>}
          </div>
         
        </div>
        <div className="sign">
          <button className='button-submit' type='submit'>SIGN IN</button>
        </div>
        {isLoading ? "loading...." : " "}
        <div className="forgot-psd">
          <p>Forgot User name / Password?</p>
        </div>
        </div>
      </div> 
      </form>
      </div>
    </>
  )
}

export default Login