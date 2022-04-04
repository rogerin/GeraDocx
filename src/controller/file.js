const fs = require("fs");
const path = require("path");
const axios = require('axios');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
// getDataSet?i=IDENTIFICADOR&p=PROCESSO&n=NOME_FILE
module.exports = {
    async upload(req,res ){
        console.log(req.files)
       res.send({ files: req.files})
    },
    testando(req,res){
        res.json({teste: true})
    },


    getFiles(req,res){
        
        let filesInput = [];
        let filesOutput = [];

        const dirPathInput = path.resolve(__dirname, '../../docx/input');
        const dirPathOutput = path.resolve(__dirname, '../../docx/output');

        filenames = fs.readdirSync(dirPathInput);
        filenames.forEach(file => {
            filesInput.push( {name: file});
        });
        filenamesOut = fs.readdirSync(dirPathOutput);
        filenamesOut.forEach(file => {
            if(file === '.DS_Store') {
                fs.unlinkSync(dirPathOutput+file);
            } else {
                filesOutput.push({name: file});
            } 
        });

        res.json({filesInput, filesOutput})
    },

    async getIdentificadores(req,res) {
        let { identificador, processo } = req.body;
        

        console.log('aqui')

        const instance = axios.create({
            // baseURL: `${process.env.SESUITE_URL_BASE}${process.env.SESUITE_URL_API_GETEWAY}`,
            baseURL: "https://sesuitet.pedrasdefogo.pb.gov.br/apigateway/v1/dataset-integration",
            // headers: { 'Authorization': process.env.AUTHORIZATION_API_GATEWAY }
            // headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDMyMDExMzIsImV4cCI6MTc2NzIyNTU0MCwiaWRsb2dpbiI6ImFwaS5zZXN1aXRlIiwicmF0ZWxpbWl0IjoxMjAsInF1b3RhbGltaXQiOjEwMDAwMH0.1TNgxLhDSi_qJrCljsQULqDu_vv23p_7S5rHTe1LK3U" }
            headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDcwMjI0MDUsImV4cCI6MTc2NzIyNTU0MCwiaWRsb2dpbiI6ImFwaS5zZXN1aXRlIiwicmF0ZWxpbWl0IjoxMjAsInF1b3RhbGltaXQiOjEwMDAwMH0.Pf063X_KKgxKZC2fBWD_1veleYwomjSWcRkqLCS6xW0" }
        });
        console.log(`/${identificador}?processo=${processo}`)
        const response = await instance.post(`/${identificador}`, {processo} ).catch(console.log);

        res.json(response.data)
    },

    async download(req,res) {
        
            let { file, processo, nameFile } = req.body;   
            
            let { c, a } = req.query

            let config = require(`../config/${c}.${a}.json`);
            
            let identifier = file.split('.')

            const content = fs.readFileSync(
                path.resolve(`docx/input/${file}`),
                "binary"
            );
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,

            });
        
            const instance = axios.create({
                baseURL: config.baseURL,
                headers: { "Authorization": config.Authorization }
            });
    
            const response = await instance.post(`/${identifier[0]}`, {processo}).catch(console.log);

            doc.render(response.data[0]);
            
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });
            
            fs.writeFileSync(path.resolve(`docx/output/${nameFile}.docx`), buf);
            console.log(`docx/output/${nameFile}.docx`)
            res.set("Content-Type", "application/octet-stream");
            
            console.log(`docx/output/${nameFile}.docx`)
            res.download(`docx/output/${nameFile}.docx`, `${nameFile}.docx`)
    },
    async getDataSet(req,res) {
        
        let { c, a, i, p, n } = req.query

        console.log(req.headers)

        console.log("##LOG", c, a, i, p, n )
        
        let config = require(`../config/${c}.${a}.json`);
        
        console.log(config )
        

        const content = fs.readFileSync(
            path.resolve(`docx/input/${i}.docx`),
            "binary"
        );
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,

        });
    
        const instance = axios.create({
            baseURL: config.baseURL,
            headers: { "Authorization": config.Authorization }
        });

        const response = await instance.post(`/${i}`, {processo:p}).catch(console.log);
      
        doc.render(response.data[0]);
        
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });
        
        fs.writeFileSync(path.resolve(`docx/output/${n}.docx`), buf);
        res.set("Content-Type", "application/octet-stream");
       
        res.download(`docx/output/${n}.docx`)
    }
}