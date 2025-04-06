import {useEffect, useState} from "react";
import Header from "@/components/common/Header.tsx";
import {SavedDocumentType} from "@/api/document.ts";
import SavedDocumentCard from "@/pages/SavedDocumentsPage/components/SavedDocumentCard.tsx";
import {toast} from "sonner";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

const SavedDocumentsPage = () => {
    const [savedDocs, setSavedDocs] = useState<SavedDocumentType[]>([]);

    useEffect(() => {
        const docs = JSON.parse(localStorage.getItem("savedDocs") || "[]");

        docs.sort((a: SavedDocumentType, b: SavedDocumentType) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setSavedDocs(docs);
    }, []);

    const handleClearAll = () => {
        localStorage.removeItem("savedDocs");
        setSavedDocs([]);
        toast.success("All saved documents cleared!");
    };

    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 px-8 py-4 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Saved Documents</h1>
                    <Button
                        style={{cursor: "pointer"}}
                        size="sm"
                        variant="destructive"
                        onClick={handleClearAll}
                        className="flex items-center gap-2"
                        disabled={savedDocs.length === 0}
                    >
                        <Trash2 className="w-4 h-4"/>
                        Clear All
                    </Button>
                </div>
                {savedDocs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-muted-foreground">No saved documents found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                        {savedDocs.map((doc) => (
                            <SavedDocumentCard document={doc}/>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default SavedDocumentsPage;
