import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Home from "./pages/Home"
//import Sub from "./pages/Page_Sub";

const App = () => {
    useEffect(()=>{
        document.title = "COdeEDiter"
    })
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                {/* <Route path="/world" element={<Sub />}></Route> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;