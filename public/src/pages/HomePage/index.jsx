import { useEffect, useRef, useState } from "react";
import { getFiles, downloadFile, uploadFile, getIdentificadores } from "../../services/api"

import './style.css';
const FileDownload = require('js-file-download');

const HomePage = () => {

    const filesElement = useRef(null);

    const [ files, setFiles ] = useState([])
    const [ fileTypeSelected, setFileTypeSelected ] = useState([])
    
    const [ fileToUpload, setFileToUpload ] = useState(null)
    const [selectedFile, setSelectedFile] = useState();
    
    const [ loading, setLoading ] = useState(true)
    
    const [ downloading, setDownloading ] = useState(false)
    const [ dataset, setDataSet ] = useState()
    const [ processo, setProcesso ] = useState()
    const [ jsonView, setJsonView ] = useState()
    const [ nameFile, setNameFile ] = useState()
    
    
    
    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};


    const handleSubmission = (e) => {
        e.preventDefault();
        const formData = new FormData();

		formData.append('file', selectedFile);

		fetch(
			'http://localhost:3333/upload',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);

                if(result.upload) {
                    alert('Upload do arquivo com sucesso')
                    window.location.reload();
                }
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    
    
    

    useEffect( ()=> {
        ( async () => {
            setLoading(true)
            const result = await getFiles();
            setFiles(result.data)
            console.log(result.data)
            setLoading(false)
        })()
    }, [] )

    if(loading){
        return <div className="loading">Carregando dados...</div>
    }

    async function downloadFileFnc(){
        setDownloading(true)
        const result = await downloadFile(fileTypeSelected, processo, nameFile)
        console.log(result.data)
        FileDownload(result.data, nameFile+'.docx')
        setDownloading(false)
    }



    async function sendFile(e){
        e.preventDefault();
        await uploadFile(selectedFile)
    }

    async function handleGetIdentificador(e) {
        e.preventDefault();
        const result = await getIdentificadores(dataset, processo);
        console.log(result.data)
        setJsonView(result);
    }


    return(
        <>
            <div className="container">
                <h2>Gerar Arquivo</h2>
                <div className="row">
                    { (downloading) ? ( 
                    <div className="col">
                        <h3>Aguarde, estamos fazendo download..</h3>
                    </div>
                    ) : (
                        <div className="col">
                            <div className="form-floating">
                                <select onChange={ (e) => setFileTypeSelected(e.target.value) } className="form-select" id="floatingSelect">
                                    <option value="0" >Selecionar arquivo</option>
                                    { files?.filesInput.map( (f, i) => (
                                        <option key={i} value={f.name}>{f.name}</option>
                                    )) }
                                </select>
                                <label htmlFor="floatingSelect">Selecione o padrão para gerar novo arquivo</label>
                            </div>

                            <div className="form-group mb-2">
                                <label className="sr-only">Processo</label>
                                <input onChange={(e) => setProcesso(e.target.value) } type="text" className="form-control-plaintext" id="processo" placeholder="ex.: 123" />
                            </div>

                            <div className="form-group mb-2">
                                <label className="sr-only">Nome do arquivo final</label>
                                <input onChange={(e) => setNameFile(e.target.value) } type="text" className="form-control-plaintext" id="nameFile" placeholder="ex.: Documento X" />
                            </div>
                            
                        </div>
                    
                    ) }
                   

                </div>
                <div className="row">
                     <div className="col">
    
                        <div className="form-floating floatRigth"> <br />
                            <button disabled={downloading} download onClick={downloadFileFnc} type="button" className="btn btn-light">Fazer download</button>
                        </div>
                     </div>
                </div>
                <br />
                <hr />
                <br />
                <br />
                <div className="row">
                    <form action="post" onSubmit={handleSubmission} encType="multipart/form-data">
                        <div className="row">
                            <div className="col">
                    
                                {/* <label htmlFor="formFile" className="form-label">Selecionar Arquivo para upload</label>
                                <input className="form-control" type="file" id="formFile" /> */}
                                <link href="https://cdnjs.cloudflare.com/ajax/libs/ratchet/2.0.2/css/ratchet.css" rel="stylesheet"/>
                                <label htmlFor="imageUpload" className={ selectedFile ? 'btn  btn-success btn-block ' : 'btn  btn-ligth btn-block btn-outlined'}>{ selectedFile ? selectedFile.name : "Seleccionar arquivo"}</label>
                                <input onChange={changeHandler} id="imageUpload" name="file" type="file" multiple ref={filesElement} />
                                
                            </div>
                        
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-floating floatRigth"> <br />
                                    <button type="submit" className="btn btn-light">Fazer upload</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <hr />

                 <div className="row">
                    <form className="form-inline" onSubmit={handleGetIdentificador} >
                    <div className="form-group mb-2">
                            <label className="sr-only">Identificador</label>
                            <input onChange={(e) => setDataSet(e.target.value) } type="text" className="form-control-plaintext" id="identificador" placeholder="ex.: intensplanosuprimentos" />
                        </div>
                        <div className="form-group mb-2">
                            <label className="sr-only">Processo</label>
                            <input onChange={(e) => setProcesso(e.target.value) } type="text" className="form-control-plaintext" id="processo" placeholder="ex.: 123" />
                        </div>
                        
                    
                        <button type="submit" className="btn btn-primary mb-2">Testar Identificador</button>
                    </form>
                </div> 

                <div className="row" >
                 
                    <pre>
                        {
                            jsonView ? JSON.stringify(jsonView, null, 2)  : 'Consulte um identificador'
                        }
                    </pre>
                </div>
            </div>
        </>
    )
}


export default HomePage;