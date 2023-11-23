import React ,{useRef, useEffect, useState} from "react";
import Draggable from 'react-draggable';
import { Hook, Console, Unhook } from 'console-feed';


const LogContainer = React.forwardRef<HTMLInputElement>((_, logRef) => {
    const [logs, setLogs] = useState<any>([])

    useEffect(()=>{
        
        const hookedConsole = Hook(
            window.console,
            (log) => setLogs((currLogs : any) => [...currLogs, log]),
            false
            )
            return () => {Unhook(hookedConsole)}
        
    } ,[])

    //const log = useRef<any>(null);
    
    

    // const consoleToHtml = function() {
    //     log.current.textContent += `${(new Date()).toLocaleString("ko-KR")} >>>`
    //     Array.from(arguments).forEach(el => {
    //         log.current.textContent += " "
    //         const insertValue = typeof el === "object" ? JSON.stringify(el) : el
    //         log.current.textContent += insertValue
    //     })
    //     log.current.textContent += "\n"
    // }
    // window.console.log = consoleToHtml
    //window.console.info = consoleToHtml
    //window.console.warn = consoleToHtml
    //window.console.error = consoleToHtml
    return (
    <>
    <Draggable>
        <div id="log-container">
            <Console logs={logs} variant="dark" />
        </div>
    </Draggable>
        
    </>
    )
    
});

export default LogContainer;