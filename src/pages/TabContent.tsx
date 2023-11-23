import {useState,useEffect, useRef} from "react";

import hljs from 'highlight.js';


const TabContent = (props :any) => {

    const editorContainer = useRef<any>(null);

    const script = useRef<any>(null);
    const [highlightingCodeInnerHtml, setHighlightingCodeInnerHtml] = useState('');

    const updateCode = () => {
        
        let text = script.current.value;
        props.setScript(text);
        let html = hljs.highlightAuto(text).value;
        setHighlightingCodeInnerHtml(html.replace(new RegExp("  ", "g"), "&nbsp; "));
    }

    const resize = () => {
        const editor = script.current;
        editor.style.height = "20px";
        editor.style.height = (editor.scrollHeight + 5)+"px";

        const editor_div = editorContainer.current;
        editor_div.style.height = (editor.scrollHeight + 5)+"px";
    }

    useEffect(() => {
        
        script.current.value = props.script;
        updateCode();
        resize();

        return () => {
          console.log('컴포넌트가 화면에서 사라짐');
        };
      }, []);

    

    return (
        
        <section id={`content${props.index + 2}`} style={props.index + 2 == props.openTabIndex ? {display:"block"}:{display:"none"}}>
        <div className="editor-container" ref={editorContainer}>
            <textarea ref={script} className="s_script" name="s_script" placeholder="스크립트 입력해주시기 바랍니다." spellCheck="false" onChange={()=>{
                updateCode();
                resize();
            }} onKeyDown={()=>{}} defaultValue={""} />
            <pre className="highlighting-code hljs" dangerouslySetInnerHTML={{__html : highlightingCodeInnerHtml}}></pre>
        </div>
        </section>
    )
    
};

export default TabContent;