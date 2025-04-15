const url = 'https://school-managment-system-server.vercel.app/api/';
// const url = 'http://localhost:4000/api/';

import axios from "axios";

export const api = axios.create({
  baseURL: url,
});