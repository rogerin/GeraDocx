const fs = require("fs");
const path = require("path");
const axios = require('axios');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");


module.exports = {
    testando(req,res){
        res.json({teste: true})
    },

    getFiles(req,res){
        
        let filesInput = [];
        let filesOutput = [];
        
        
    // Function to get current filenames
    // in directory
        filenames = fs.readdirSync('./docx/input');
        console.log('filenames', filenames)
        filenames.forEach(file => {
            filesInput.push( {name: file});
        });
        
        filenamesOut = fs.readdirSync('./docx/output');

        filenamesOut.forEach(file => {
            if(file === '.DS_Store') {
                fs.unlinkSync('./docx/output/'+file);
            } else {
                filesOutput.push({name: file});
            } 
        });

        res.json({filesInput, filesOutput})
        
    },

    async download(req,res) {
        
            let { file } = req.body;
         
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
                // baseURL: `${process.env.SESUITE_URL_BASE}${process.env.SESUITE_URL_API_GETEWAY}`,
                baseURL: "http://localhost:3000/api/dataset",
                // headers: { 'Authorization': process.env.AUTHORIZATION_API_GATEWAY }
                // headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDMyMDExMzIsImV4cCI6MTc2NzIyNTU0MCwiaWRsb2dpbiI6ImFwaS5zZXN1aXRlIiwicmF0ZWxpbWl0IjoxMjAsInF1b3RhbGltaXQiOjEwMDAwMH0.1TNgxLhDSi_qJrCljsQULqDu_vv23p_7S5rHTe1LK3U" }
                headers: { "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDcwMjI0MDUsImV4cCI6MTc2NzIyNTU0MCwiaWRsb2dpbiI6ImFwaS5zZXN1aXRlIiwicmF0ZWxpbWl0IjoxMjAsInF1b3RhbGltaXQiOjEwMDAwMH0.Pf063X_KKgxKZC2fBWD_1veleYwomjSWcRkqLCS6xW0" }
            });
            
            const response = await instance.get(`/${identifier[0]}`);
            console.log(response.data)
            
            
            doc.render({
                data: response.data,
                itens: [
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    { name: 'roerio ', til: 'nada', oq: 'bla', bla: 'foo'},
                    
                ]
            });
            
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });
            
            fs.writeFileSync(path.resolve(__dirname, `docx/output/foreach.docx`), buf);
        
            res.set("Content-Type", "application/octet-stream");
            res.download(`docx/output/${file}`)
        
            
    }

}