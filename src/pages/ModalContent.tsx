import {useRef, useEffect} from "react"
import Draggable from 'react-draggable';
const ModalContent = (props : any ) =>{

    const closeModal = () => {
        props.setModalOpen(false);
    };

    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handler = () => {
            if (event && modalRef.current && !modalRef.current.contains(event.target as HTMLElement) ) {
                props.setModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        
        return () => {
            document.removeEventListener('mousedown', handler);
        };
    });

    return (
        <>
        <Draggable>
            <div ref={modalRef} className="modalContainer">
                <button className="close" onClick={closeModal}>
                    X
                </button>
                <p>{props.contents}</p>
                <div className="modalBtn">
                    <button className="yes" onClick={props.yesCallbackFunc}>yes</button>
                    <button className="no" >no</button>
                </div>
            </div>
        </Draggable>
        
        </>
    )
}
export default ModalContent;