import axios from 'axios';


const VITE_BACKEND_API = import.meta.env.VITE_BACKEND_API as string;


export const sheriaAPI = axios.create({
    baseURL: VITE_BACKEND_API,
    headers: {
        'Content-Type': 'application/json',
    },

});