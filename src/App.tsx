import {Route, BrowserRouter as Router, Routes, Navigate} from 'react-router-dom';
import {Toaster} from "sonner";
import CreateDocumentPage from "@/pages/CreateDocumentPage";
import ReadDocumentPage from "@/pages/ReadDocumentPage";
import UpdateDocumentPage from "@/pages/UpdateDocumentPage";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                    <Route path="/" element={<CreateDocumentPage/>}/>
                    <Route path="/read/:readCode" element={<ReadDocumentPage/>}/>
                    <Route path="/update/:updateCode" element={<UpdateDocumentPage/>}/>
                </Routes>
            </Router>
            <Toaster/>
        </>
    )
}

export default App
