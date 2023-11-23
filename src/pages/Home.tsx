import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import '../App.css'
import TabTitle from "./TabTitle";
import TabContent from "./TabContent";
import LogContainer from "./LogContainer";
import ModalContent from "./ModalContent";
import WebTerminal from "./WebTerminal";

import { Hook, Console, Unhook } from 'console-feed';

const Home : React.FC = () => {
    const [logs, setLogs] = useState<any>([])

    const previewArea = useRef<any>(null);
    const fileSelector = useRef<any>(null);

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

    useEffect(()=>{
        
        setInterval(() => {
            //previewArea.current.contentWindow.console.log("======")
        }, 2000);
        
    },[])

    // 모달창 노출
    const showModal = () => {
        setModalOpen(true);
    };

    const run = () => {

        

        // //
        // window.addEventListener( 'message', (e)=>{
        //     if(e.data.name != undefined)
        //         console.log( '자식으로부터 받은 메시지 ', e.data.name , false);
        // } );

        let code = script;
        previewArea.current?.contentWindow.location.reload();
        
        if(iframSrcdoc !== code){
            setIframSrcdoc(code);
        }
        
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
                if(file.name === 'ce_index.json'){
                    let fileReader = new FileReader();
                    fileReader.onload = () => {
                        if (typeof fileReader.result === 'string'){
                            const indexJson = JSON.parse(fileReader.result);
                            setIndexFile(indexJson)
                            readFile(indexJson.index.name, files, true)
                            indexJson.files.forEach( (f:any ) => {
                                readFile(f.name, files, false)
                                
                            })
                        }
                            
                    };
                    fileReader.readAsText(file);
                }
             });
          }
    }

    const readFile = (name : any, files : any, index : boolean) => {

        let fileReader = new FileReader();
        fileReader.onload = () => {
            //if(index){
                setFiles(targetFiles => [...targetFiles, fileReader.result as string])
            //}
        };

        Array.from(files).forEach((t : any) => {
            if(t.name === name){
                fileReader.readAsText(t);
            }
        })
    }

    return (
        <>
        <div className="main">
            
            <div style={{display:'flex'}}>
                <input id="tab1" type="radio" name="tabs" />{" "}
                <label htmlFor="tab1" onClick={() => {
                    run();
                    setOpenTabIndex(1)
                    }}>
                RESULT
                </label>
                <TabTitle title={indexFile.index.name} index={0} isIndex={true} key={0} changeOpenTabIndex={handleOpenTabIndex} /> 
                
                {
                    indexFile.files.map((file, index) => {
                        return (<TabTitle title={file.name} index={index+1} isIndex={false} key={index} changeOpenTabIndex={handleOpenTabIndex} />)
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
                targetFiles.map((file, index) => {
                    return (<TabContent script={file} setScript={setScript} key={index} index={index} openTabIndex={openTabIndex}/>)
                })
            }
            
        </div>
        {modalOpen && <ModalContent setModalOpen={setModalOpen} />}

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
            <button className="bottomBtn" style={{ backgroundImage: "url(icon/folder.png)", backgroundSize: 30 }} onClick={()=>{fileSelector.current.click(); fileSelector.current.value = ''}}/>
            <input type="file" ref={(node) => {
                fileSelector.current = node;

                if (node) {
                    ['webkitdirectory', 'directory', 'mozdirectory'].forEach((attr) => {
                    node.setAttribute(attr, '');
                    });
                }
                }}  
                onChange={(e)=>{readIndexJson(e)}}  />

            <button className="bottomBtn" style={{
                right: 160,
                backgroundImage: "url(icon/diskette.png)",
                backgroundSize: 30 }} onClick={showModal}
            />
            <button className="bottomBtn" style={{
                right: 220,
                backgroundImage: "url(icon/edit.png)",
                backgroundSize: 30
            }} onClick={()=>{fileSelector.current.click()}}
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
