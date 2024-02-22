import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import '../App.css'
import TabTitle from "./TabTitle";
import TabContent from "./TabContent";
import ModalContent from "./ModalContent";
import WebTerminal from "./WebTerminal";
import axios from "axios";

import { Hook, Console, Unhook } from 'console-feed';
import ServerFileSystemModalContent from "./ServerFileSystemModalContent";
import fs from "fs";

const Home : React.FC = () => {
    const [logs, setLogs] = useState<any>([])

    const previewArea = useRef<any>(null);
    const fileSelector = useRef<any>(null);
    let fileSelectorMode = '';

    type fileTree = {
        fileList: [{name : ""}],
        folderList: [{name : ""}]
      };
    const [localFiles, setLocalFiles] = useState<fileTree | null>(null);

    const [iframSrcdoc, setIframSrcdoc] = useState('init');
    const [openTabIndex, setOpenTabIndex] = useState(0);
    const [indexFile, setIndexFile] = useState({
        index: {path : "", name : ""},
        files: [{path : "", name : ""}]
      });

    const [targetFiles, setFiles] = useState<string[]>([]);
    const [script, setScript] = useState<string>('');
    const [showTerminal, setShowTerminal] = useState<boolean>(false);
    const [showLog, setShowLog] = useState<boolean>(false);

    const handleOpenTabIndex = (num : number) =>{
        setOpenTabIndex(num)
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [serverFileSystemModalOpen, setServerFileSystemModalOpen] = useState(false);

    useEffect(()=>{
        
        setInterval(() => {
            //previewArea.current.contentWindow.console.log("======")
        }, 2000);
        
    },[])

    useEffect(()=>{

    },[indexFile])

    // 모달창 노출
    const showModal = () => {
        setModalOpen(true);
    };

    const showServerFileSystemModal = () => {

        axios.get("http://localhost:3001/tree?path="+"/Users/onetable/Documents/repo/기타등등/codeEditor2/src")
        .then((res) => {
            setLocalFiles(res.data);
            setServerFileSystemModalOpen(true);
        })
        .catch((e: any) => {
            console.log(e);
        });
        
    };

    const run = () => {
        
        // //
        // window.addEventListener( 'message', (e)=>{
        //     if(e.data.name != undefined)
        //         console.log( '자식으로부터 받은 메시지 ', e.data.name , false);
        // } );

        let code = script;

        if(iframSrcdoc !== code){
            setIframSrcdoc(code);
        }

        previewArea.current?.contentWindow.location.reload();
        
        // if(previewArea.current.contentDocument.readyState){
        //     previewArea.current.contentWindow.console.log("==")
        //     //console.log(previewArea.current.contentWindow)
        //     //console.log(window)
        // }
    }


    const readIndexJson = (e: ChangeEvent<HTMLInputElement>) => {
        const files= e.target.files;
        
        if (files !== null) {
            Array.from(files).forEach(file => { 
                //if(file.name === 'ce_index.cejson'){
                    let fileReader = new FileReader();
                    fileReader.onload = () => {
                        if (typeof fileReader.result === 'string'){
                            const indexJson = JSON.parse(fileReader.result);
                            setIndexFile(indexJson)
                            
                            //readFile(indexJson.index.name, files, true)

                            axios.post("http://localhost:3001/files", {
                                files : indexJson.files
                            })
                            .then((res: any) => {
                                res.data.fileList.forEach( (f:any ) => {
                                    setFiles(targetFiles => [...targetFiles, f as string])
                                })
                            })
                            .catch((e: any) => {
                                console.log(e);
                            });
                        }
                    };
                    fileReader.readAsText(file);
                // }else{
                //     alert("this is not index file..")
                // }
             });
          }
    }

    const readFile = (name : any, files : any, index : boolean) => {
        
        let fileReader = new FileReader();
        fileReader.onload = () => {
            setFiles(targetFiles => [...targetFiles, fileReader.result as string])
        };

        Array.from(files).forEach((t : any) => {
            if(t.name === name){
                fileReader.readAsText(t);
            }
        })
    }

    const addFileCallback = (path:string, name:string) => {

        axios.post("http://localhost:3001/file", {
            file : {path: path, name: name}
        })
        .then((res: any) => {
            setFiles(targetFiles => [...targetFiles, res.data.file as string])
            setIndexFile((indexFile) => {
                if(indexFile.files[0].name == ""){

                    return {
                        index: indexFile.index,
                        files: [{path: path, name: name}]
                    }
                }
                else {
                    return {
                        index: indexFile.index,
                        files: [...indexFile.files, {path: path, name: name}]
                    }
                }
            });
        })
        .catch((e: any) => {
            console.log(e);
        });


    }

    return (
        <>
        <div className="main">
            
            <div style={{display:'flex'}}>
                <input id="tab1" type="radio" name="tabs" />{" "}
                <label htmlFor="tab1" onClick={() => {
                    setOpenTabIndex(1)
                    run();

                    }}>
                RESULT
                </label>
                {
                    indexFile.files.map((file, index) => {
                        if(file.name != ""){
                            return (<TabTitle title={file.name} index={index} isIndex={false} key={index} changeOpenTabIndex={handleOpenTabIndex} />)
                        }

                    })
                }
            </div>

            <section id="content1" style={openTabIndex === 1 ? {display:"block"}:{display:"none"}}>
                <iframe id="previewArea" ref ={previewArea} srcDoc={iframSrcdoc} onLoad={()=>{
                    const hookedConsole = Hook(
                        previewArea.current.contentWindow.console,
                        (log) => setLogs((currLogs : any) => [...currLogs, log]),
                        false
                        )
                        return () => {Unhook(hookedConsole)}
                }}/>
            </section>

            {
                targetFiles.map((script, index) => {
                    return (<TabContent script={script} file={indexFile.files[index]} setScript={setScript} key={index} index={index} openTabIndex={openTabIndex}/>)
                })
            }
            
        </div>
        {modalOpen && <ModalContent contents={"인덱스파일을 저장하시겠습니까?"} yesCallbackFunc={()=>{
            let element = document.createElement('a');
            const fileName = window.prompt(
                "인덱스 파일명을 입력해주세요."
            );
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(indexFile)));
            element.setAttribute('download', fileName? fileName+".cejson" : "index.cejson");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }} setModalOpen={setModalOpen} />}
        {serverFileSystemModalOpen && localFiles && <ServerFileSystemModalContent setServerFileSystemModalOpen={setServerFileSystemModalOpen} path={"/Users/onetable/Documents/repo/기타등등/codeEditor2/src"} list={localFiles} addFileCallback={addFileCallback} />}
        

        <div style={showTerminal? {display:"block"}:{display:"none"}}>
            <WebTerminal></WebTerminal>
        </div>

        <div style={showLog? {display:"block"}:{display:"none"}}>
            {/* <LogContainer></LogContainer> */}
            
        <div id="log-container">
            <Console logs={logs} variant="dark" />
        </div>
        </div>
        
        <div>
            <button className="bottomBtn"
                    style={{ backgroundImage: "url(icon/folder.png)", backgroundSize: 30 }} 
                    onClick={()=>{

                        fileSelectorMode = 'loadIndex';
                        fileSelector.current.click(); 
                        fileSelector.current.value = '';
                    }}/>
            <input type="file" accept=".cejson" ref={(node) => {
                fileSelector.current = node;
                if (node) {
                    ['webkitfile', 'file', 'mozfile'].forEach((attr) => {
                    node.setAttribute(attr, '');
                    });
                }
                }}  
                onChange={(e)=>{ 
                    const targetButtonName = e.currentTarget.name;
                    if(fileSelectorMode == "loadIndex"){
                        readIndexJson(e)
                    }
                    }} />

            <button className="bottomBtn" style={{
                right: 160,
                backgroundImage: "url(icon/diskette.png)",
                backgroundSize: 30 }} onClick={showModal}
            />

            <button className="bottomBtn" style={{
                right: 220,
                backgroundImage: "url(icon/edit.png)",
                backgroundSize: 30
            }} onClick={showServerFileSystemModal
            }
            />

            <button className="bottomBtn" style={{
                left: 220,
                backgroundImage: "url(icon/log.png)",
                backgroundSize: 30
            }} onClick={()=>{setShowLog(!showLog)}}
            />

            <button className="bottomBtn" style={{
                left: 160,
                backgroundImage: "url(icon/terminal.png)",
                backgroundSize: 30
            }} onClick={()=>{setShowTerminal(!showTerminal)}}
            />
            
        </div>
        </>

    );
};

export default Home;
