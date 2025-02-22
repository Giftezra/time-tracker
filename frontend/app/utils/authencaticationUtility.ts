/**
 * This is the utility file for the authentication process.
 * It contains the functions for the authentication process and other neccessary states to manage the authentication process..
 * Some of the methods included are 
 * - axiosInstance response interceptor: which is used to intercept every request made within the code block.
 */
import axios from "axios";


import { BASE_URL } from "@/app/utils/urls";

// Create a new axios instance to be used for the authentication process
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});










