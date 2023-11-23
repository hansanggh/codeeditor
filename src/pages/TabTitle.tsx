const TabTitle = (props :any) => {
    return (
    <div>
        <input id={`tab${props.index + 2}`} type="radio" name="tabs" onClick={()=>{
            props.changeOpenTabIndex(props.index + 2)}}/>
        <label htmlFor={`tab${props.index + 2}`}>{props.title}</label>
    </div>
    )
    
};

export default TabTitle;