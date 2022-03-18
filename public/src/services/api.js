import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3333'
});
// let token = localStorage.getItem('userToken') ? JSON.parse(localStorage.getItem('userToken')) : { token: null }
// api.defaults.headers.token =  token.token


export const uploadFile = async (data) => {
    return api.post('/upload', {...data})
};


export const getFiles = async () => {
    return api.get('/getFiles')
};

export const downloadFile = async (file) => {
    console.log(file)
    return api.post(`/download`, { file: file })
}
