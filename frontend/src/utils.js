import { jwtDecode } from 'jwt-decode';

export const checkAdmin = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log(decoded)
    return decoded.user_id===1;  // Adjust this according to your token structure
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};