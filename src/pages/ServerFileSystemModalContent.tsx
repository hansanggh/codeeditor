import {useRef, useEffect, useState} from "react"
import Draggable from 'react-draggable';
import axios from "axios";

const ServerFileSystemModalContent = (props : any ) =>{

    const [localFiles, setLocalFiles] = useState(props.list);
    const [rootPath, setRootPath] = useState(props.path);

    const closeModal = () => {
        props.setServerFileSystemModalOpen(false);
    };

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = () => {
            // eslint-disable-next-line no-restricted-globals
            if (event && modalRef.current && !modalRef.current.contains(event.target as HTMLElement) ) {
                props.setServerFileSystemModalOpen(false);
            }
            
        };
        document.addEventListener('mousedown', handler);
        
        return () => {
            document.removeEventListener('mousedown', handler);
        };
    });

    const requestDir = (path: any) => {
        axios.get("http://localhost:3001/tree?path=" + path)
            .then((res: any) => {
                setLocalFiles((localFiles: any)=>{return Object.assign({},localFiles,res.data)});
                setRootPath((rootPath:string) => path);
            })
            .catch((e: any) => {
                console.log(e);
            });
    }

    return (
        <>
        <Draggable>
            <div ref={modalRef} className="fileSystemModalContainer">
                <button className="close" onClick={()=>{
                    closeModal();
                }}>
                    X
                </button>
                <p style={{fontSize:"21px"}}><b><i>SERVER FILE SYSTEM</i></b></p>
                {
                    rootPath.split('/').filter((item : string, index:number) => index > 0 ).map((item:string,idx:number, arr:string[])=><a key={rootPath + '/' + item} style={{fontSize:"20px"}} href="#" onClick={()=>{
                        let path = '/' +  arr.filter((item : string, index:number) => index < idx+1 ).join('/');
                        requestDir(path);
                    }} ><i>/{item}</i></a>)

                }
                <ul className="test">
                {
                    localFiles?.fileList.map((e : any) => {
                        return (<li key={rootPath+'/'+e.name} style={{
                            listStyle:"none",
                            backgroundImage:"url(icon/docs.png)",
                            backgroundPosition: "left center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize:"18px",
                                height : "22px"
                            }}>
                            <a style={{marginLeft:"25px"}} href="#" onClick={()=>{
                                props.addFileCallback(rootPath, e.name);
                                console.log("this is file.")
                            }}>{e.name}</a>
                        </li>
                        )
                    })
                }
                {
                    localFiles?.folderList.map((e : any) => {
                        return (<li key={rootPath+'/'+e.name} style={{
                                listStyle:"none",
                                backgroundImage:"url(icon/folder2.png)",
                                backgroundPosition: "left center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize:"18px"
                            }}>
                                <a style={{marginLeft:"25px"}}  href="#" onClick={()=>{
                                    requestDir(rootPath + '/' + e.name)
                                }}><i>{e.name}</i></a>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
        </Draggable>
        
        </>
    )
}
export default ServerFileSystemModalContent;