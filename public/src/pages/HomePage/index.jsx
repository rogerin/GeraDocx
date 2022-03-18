import { useEffect, useState } from "react";
import { getFiles, downloadFile } from "../../services/api"

import './style.css'

const HomePage = () => {

    const [ files, setFiles ] = useState([])
    const [ fileTypeSelected, setFileTypeSelected ] = useState([])
    
    const [ loading, setLoading ] = useState(true)
    

    useEffect( ()=> {
        ( async () => {
            setLoading(true)
            const result = await getFiles();
            setFiles(result.data)
            setLoading(false)
        })()
    }, [] )

    if(loading){
        return <div className="loading">Carregando dados...</div>
    }

    async function downloadFileFnc(){
        const result = await downloadFile(fileTypeSelected)
        console.log(result)
    }


    return(
        <>
            <div className="container">
                <h2>Gerar Arquivo</h2>
                <div className="row">
                    <div className="col">
                        <div className="form-floating">
                            <select onChange={ (e) => setFileTypeSelected(e.target.value) } defaultValue="" className="form-select" id="floatingSelect" aria-label="Floating label select example">
                                <option value="" selected>Selecionar arquivo</option>
                                { files?.filesInput.map( (f, i) => (
                                    <option key={i} value={f.name}>{f.name}</option>
                                )) }
                            </select>
                            <label htmlFor="floatingSelect">Selecione o padrão para gerar novo arquivo</label>
                        </div>
                       
                    </div>
                
                </div>
                <div className="row">
                     <div className="col">
                        <div className="form-floating floatRigth"> <br />
                            <button onClick={downloadFileFnc} type="button" className="btn btn-light">Fazer download</button>
                        </div>
                     </div>
                </div>
                <br />
                <hr />
                <br />
                <br />

                <div className="row">
                    <div className="col">
             
                        {/* <label htmlFor="formFile" className="form-label">Selecionar Arquivo para upload</label>
                        <input className="form-control" type="file" id="formFile" /> */}
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/ratchet/2.0.2/css/ratchet.css" rel="stylesheet"/>
                        <label htmlFor="imageUpload" className="btn btn-ligth btn-block btn-outlined">Seleccionar arquivo</label>
                        <input type="file" id="imageUpload" accept="image/*"  />
                        
                    </div>
                
                </div>
                <div className="row">
                     <div className="col">
                        <div className="form-floating floatRigth"> <br />
                            <button type="button" className="btn btn-light">Fazer upload</button>
                        </div>
                     </div>
                </div>
            </div>
        </>
    )
}


export default HomePage;