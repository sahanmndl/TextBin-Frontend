import DocumentEditor from "@/pages/CreateDocumentPage/components/DocumentEditor.tsx";
import Header from "@/components/common/Header.tsx";

const CreateDocumentPage = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="py-6 px-4 sm:px-8 flex-1">
                <DocumentEditor/>
            </div>
        </main>
    )
}

export default CreateDocumentPage;