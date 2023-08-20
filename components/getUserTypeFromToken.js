import jwt from 'jwt-decode'

export const getUserTypeFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt(token);
      return decodedToken.sub;
    } else {
      console.log('JWT token not found in localStorage');
      return null;
    }
  };