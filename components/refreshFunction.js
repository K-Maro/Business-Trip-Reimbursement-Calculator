import { setAuthToken } from '../components/setAuthToken.js';
import axios from 'axios';

function refreshFunction() {
  const token = localStorage.getItem("token");
    if(token){
      setAuthToken(token)
    axios.post('http://localhost:8080/auth/refresh-token', {})
      .then(response => {
        localStorage.removeItem('token')
        localStorage.setItem('token', response.data);
        console.log('Zaktualizowano token:', response.data);
      })
      .catch(error => {
        console.error('Błąd podczas odświeżania tokenu:', error);
      });
    }
  }
  
   
  
  export default function scheduleRefresh() {
    
      refreshFunction()
      setInterval(refreshFunction, 4 * 60 * 1000 + 30 * 1000);
    
  }

  