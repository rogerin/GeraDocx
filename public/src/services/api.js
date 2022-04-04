import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3333'
});
// let token = localStorage.getItem('userToken') ? JSON.parse(localStorage.getItem('userToken')) : { token: null }
// api.defaults.headers.token =  token.token


export const uploadFile = async (file) => {
    var data = new FormData();
    data.append("file", file);


 console.log('file', data)

    return api.post('/upload', data, {
        'Content-Type': 'multipart/form-data;',
    })
};


export const getFiles = async () => {
    return api.get('/getFiles')
};

export const getIdentificadores = async (identificador, processo) => {
    return api.post(`/getIdentificadores`, {identificador, processo})
};


export const downloadFile = async (file, processo, nameFile) => {
    return api.post(`/download`, { file, processo, nameFile }, {
        responseType: 'blob'
    })
}

