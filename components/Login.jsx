import React from 'react';
import {useState} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './register.css';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import { setAuthToken } from './setAuthToken';
import { SHA256 } from 'crypto-js';
export default function Login() {


    const [type, setType]=useState('password');
    const [icon, setIcon]=useState(eyeOff);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const token = localStorage.getItem("token");
    if (token) {
        setAuthToken(token);
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
          .post('https://53c5-83-0-32-68.ngrok-free.app/auth/login', {
            login: data.login,
            password: hashedPassword, 
          })
          .then((response) => {
            const token = response.data.token;
            localStorage.setItem('token', token);
            setAuthToken(token);
            window.location.href = '/Admin';
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
                            <input type="text" {...register("login" , { required: true })} placeholder='Username' />
                        </div>
                        {errors.login?.type === 'required' && <span className='Error'>Username is required</span>}
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