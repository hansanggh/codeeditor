import axios from "axios";

    const FileItem = (props :any) => {

    return (

    <div>
        <ul>
            {
                props.list?.fileList.map((e : any) => {
                    return (<li>
                            <a href="javascript:void(0);" onClick={()=>{
                                console.log("this is file.")
                            }}>{e.name}</a>
                        </li>
                    )
                })
            }
            {
                props.list?.folderList.map((e : any) => {
                    return (<li>
                            <a href="javascript:void(0);" onClick={()=>{
                                console.log(e.name)
                                props.callback();
                            }}>{e.name}</a>
                        </li>
                    )
                })
            }
        </ul>
    </div>
    )
    
};

export default FileItem;