import axios from "axios"

// Axios is a popular JavaScript library for making HTTP requests in web applications. 
// It simplifies the process of sending asynchronous requests and handling responses.
//  It is commonly used with Node.js and in browser-based projects and can be installed via 
//  NPM (Node Package Manager).

export const axiosInstance=axios.create({});

export const apiConnector=(method,url,bodyData,headers,params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData?bodyData:null,
        headers:headers?headers:null,
        params:params?params:null
    });
}