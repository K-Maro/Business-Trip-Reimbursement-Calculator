import axios from 'axios';

export const setAuthToken = token => {
    if (token) {
        axios.interceptors.request.use(
            config => {

                
                config.headers['Authorization'] = 'Bearer ' + token;
                
                config.headers['Content-Type'] = 'application/json';
                return config;
            },
            error => {
                Promise.reject(error)
        });
       
    }
    else
        delete axios.defaults.headers.common["Authorization"];
 }