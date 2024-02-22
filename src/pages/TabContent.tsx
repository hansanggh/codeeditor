import React, {useState,useEffect, useRef} from "react";

import hljs from 'highlight.js';
import ModalContent from "./ModalContent";
import axios from "axios";


const TabContent = (props :any) => {

    const editorContainer = useRef<any>(null);
    const script = useRef<any>(null);
    const preScript = useRef<any>(null);
    const [highlightingCodeInnerHtml, setHighlightingCodeInnerHtml] = useState('');

    const [highlightCompleteState, setHighlightCompleteState] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const updateCode = () => {
        setHighlightCompleteState(false);
        props.setScript(script.current.value);
    }

    const highlightingAll = () => {
        let html = hljs.highlightAuto(script.current.value).value;
        setHighlightingCodeInnerHtml(html.replace(new RegExp("  ", "g"), "&nbsp; "));
    }

    const resize = () => {
        const editor = script.current;
        //editor.style.height = "auto";
        editor.style.height = (editor.scrollHeight + 5)+"px";

        const editor_div = editorContainer.current;
        editor_div.style.height = (editor.scrollHeight + 5)+"px";

        const preCode = preScript.current;
        editor.style.width = "calc(" + window.getComputedStyle(preCode).width + ")";
    }

    useEffect(() => {
        script.current.value = props.script;
        updateCode();
        highlightingAll();
        setHighlightCompleteState(true);
      }, []);

    useEffect(() => {
        if(props.index + 2 == props.openTabIndex){
            props.setScript(script.current.value)
        }
        resize();
    }, [props.openTabIndex]);

    useEffect(()=>{
        script.current.style.color=highlightCompleteState ? "transparent":"black";
        preScript.current.style.display = highlightCompleteState ? "block":"none";
    }, [highlightCompleteState])


    return (
        <section id={`content${props.index + 2}`} style={props.index + 2 == props.openTabIndex ? {display:"block"}:{display:"none"}}>
        <div className="editor-container" ref={editorContainer}>
            <textarea ref={script} className="s_script" name="s_script" placeholder="스크립트 입력해주시기 바랍니다." spellCheck="false" onKeyDown={(e: React.KeyboardEvent)=>{
                // 저장
                if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    setModalOpen(true);
                }

                // tab 입력
                if (e.key === 'Tab' && !e.shiftKey) {
                    e.preventDefault();
                    const value = script.current!.value;
                    const selectionStart = script.current!.selectionStart;
                    const selectionEnd = script.current!.selectionEnd;
                    script.current!.value =
                        value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
                    script.current!.selectionStart = selectionEnd + 2 - (selectionEnd - selectionStart);
                    script.current!.selectionEnd = selectionEnd + 2 - (selectionEnd - selectionStart);
                }
                if (e.key === 'Tab' && e.shiftKey) {
                    e.preventDefault();
                    const value = script.current!.value;
                    const selectionStart = script.current!.selectionStart;
                    const selectionEnd = script.current!.selectionEnd;
                    const beforeStart = value
                        .substring(0, selectionStart)
                        .split('')
                        .reverse()
                        .join('');
                    const indexOfTab = beforeStart.indexOf('  ');
                    const indexOfNewline = beforeStart.indexOf('\n');
                    if (indexOfTab !== -1 && indexOfTab < indexOfNewline) {
                        script.current!.value =
                            beforeStart
                                .substring(indexOfTab + 2)
                                .split('')
                                .reverse()
                                .join('') +
                            beforeStart
                                .substring(0, indexOfTab)
                                .split('')
                                .reverse()
                                .join('') +
                            value.substring(selectionEnd);
                        script.current!.selectionStart = selectionStart - 2;
                        script.current!.selectionEnd = selectionEnd - 2;
                    }
                }else if(e.key != 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    setHighlightCompleteState(false);
                    resize();
                }
            }} onChange={()=>{
                const timeOutId = setTimeout(() => {
                    highlightingAll();
                    setHighlightCompleteState(true);
                    props.setScript(script.current.value);
                    }, 500);
                return () => {
                    clearTimeout(timeOutId);
                }
            }} defaultValue={""} />
            <pre ref={preScript} className="highlighting-code hljs" dangerouslySetInnerHTML={{__html : highlightingCodeInnerHtml}}></pre>
            {modalOpen && <ModalContent contents={"파일을 서버에 저장하시겠습니까?"} yesCallbackFunc={()=>{

                axios.put("http://localhost:3001/file", {
                    fullPath : props.file.path + '/' + props.file.name,
                    contents : script.current.value.toString()
                }).then((res: any) => {
                    alert("sava!")

                })
                    .catch((e: any) => {
                        console.log(e);
                    });

                setModalOpen(false);
            }} setModalOpen={setModalOpen} />}
        </div>
        </section>
    )
};

export default TabContent;