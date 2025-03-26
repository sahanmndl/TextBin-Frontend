import Header from "@/components/common/Header.tsx";
import UpdateEditor from "@/pages/UpdateDocumentPage/components/UpdateEditor.tsx";

const UpdateDocumentPage = () => {
    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="py-6 flex-1 px-8">
                <UpdateEditor/>
            </div>
        </main>
    )
}

export default UpdateDocumentPage;