import React from 'react';
import {useState} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '/components/register.css';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import { setAuthToken } from '../setAuthToken';
import { SHA256 } from 'crypto-js';
import jwt from 'jwt-decode'
import { getUserTypeFromToken } from '../getUserTypeFromToken';

export default function Login() {


    const [type, setType]=useState('password');
    const [icon, setIcon]=useState(eyeOff);
    const { register, handleSubmit, formState: { errors } } = useForm();

    function checkAndSetAuthToken() {
      const token = localStorage.getItem("token");
      if (token) {
          const decodedToken = jwt(token);
          if (decodedToken.exp && Date.now() / 1000 < decodedToken.exp) {
              console.log('JWT token is valid and not expired');
              setAuthToken(token);
          } else {
              console.log('JWT token is expired');
          }
      } else {
          console.log('JWT token not found in localStorage');
      }
    }
    
    const handleToggle=()=>{    
        if(type==='password'){
          setIcon(eye);      
          setType('text');
        }
        else{
          setIcon(eyeOff);     
          setType('password');
        }
      }
      
      

    // const onSubmit = data => console.log(data);
    const onSubmit = async (data) => {
        const hashedPassword = SHA256(data.password).toString();
        // console.log({hashedPassword})
        await axios
          .post('http://localhost:8080/auth/login', {
            username: data.username,
            password: hashedPassword, 
          })
          .then((response) => {
            localStorage.removeItem('token')
            localStorage.setItem('token', response.data);
            checkAndSetAuthToken()
            const userType = getUserTypeFromToken()
            if(userType){
              console.log(userType)
              if(userType == 'ADMIN'){
                window.location.href = '/Admin';
              }else if(userType == 'USER'){
                window.location.href = '/HomePage';
              }
            }
          })
          .catch((err) => console.log(err));
      };


    return (
        <section className='Section_register'>
            <div className="register">
                <div className="col-1">
                    <h2 className='h2-login'>Log in</h2>
                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <div className="password">
                            <input type="text" {...register("username" , { required: true })} placeholder='Username' />
                        </div>
                        {errors.username?.type === 'required' && <span className='Error'>Username is required</span>}
                        <div className="password">
                            <input type={type} {...register("password", { required: true })} placeholder='Password' />
                            <span onClick={handleToggle}><Icon icon={icon} size={25}/></span>
                        </div>
                        {errors.password?.type === 'required' && <span className='Error'>Password is required</span>}
                        <button className='btn' type="submit">Log in</button>
                    </form>
                </div>
            </div>
        </section>
    );
}