import Header from "@/components/common/Header.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DocumentType, getDocumentByReadCode, getDocumentPrivacyStatus} from "@/api/document.ts";
import {useQuery} from "@tanstack/react-query";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.css';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {CalendarIcon, EyeIcon} from "lucide-react";
import {documentTypes, privacyStatus} from "@/constants/constants.ts";
import CircularLoader from "@/components/common/CircularLoader.tsx";
import {AxiosError} from "axios";
import {Alert} from "@mui/material";

const ReadDocumentPage = () => {
    const {readCode} = useParams();
    const [password, setPassword] = useState("");
    const [decryptionKey, setDecryptionKey] = useState("");
    const [document, setDocument] = useState<DocumentType | null>(null);
    const [loading, setLoading] = useState(false);

    const {data: status, isLoading: isStatusLoading, isError: isStatusError, error: statusError} = useQuery({
        queryKey: ['status', readCode],
        queryFn: () => getDocumentPrivacyStatus(readCode!),
        enabled: !!readCode
    });

    const fetchDocument = async () => {
        setLoading(true);
        try {
            const doc = await getDocumentByReadCode(readCode!, password, decryptionKey);
            setDocument(doc);
        } catch (error) {
            toast.error("Failed to fetch document. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status?.privacy === privacyStatus.PUBLIC) {
            fetchDocument();
        }
    }, [status]);

    let axiosError;
    if (isStatusError) {
        axiosError = statusError as AxiosError<{ error: string }>;
    }

    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 px-4 sm:px-8 py-4">
                {(isStatusLoading || loading) ? (
                    <CircularLoader/>
                ) : isStatusError ? (
                    <Alert severity="error">{axiosError?.response?.data.error || "Unable to fetch document!"}</Alert>
                ) : (
                    <>
                        {(status?.privacy === privacyStatus.PRIVATE && !document) && (
                            <Card className="max-w-md mx-auto">
                                <CardHeader>
                                    <CardTitle>Enter Credentials</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {status?.isPasswordProtected && (
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    )}
                                    {status?.isEncrypted && (
                                        <Input
                                            type="text"
                                            placeholder="Enter decryption key"
                                            value={decryptionKey}
                                            onChange={(e) => setDecryptionKey(e.target.value)}
                                        />
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        style={{cursor: "pointer"}}
                                        type="submit"
                                        className="w-full"
                                        onClick={fetchDocument}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Read Document"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}

                        {document && (
                            <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold break-words">{document.title}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {document.tags?.map((tag: string, index: number) => (
                                        <span key={index} className="px-2 py-0.5 text-sm bg-gray-200 rounded">
                                           {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <EyeIcon className="w-4 h-4"/>
                                        <span>{document.views} views</span>
                                    </div>
                                    {document.expiryStatus.isExpiring && (
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4"/>
                                            <span>
                                                Expires on {new Date(document.expiryStatus.expirationDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {document.type === documentTypes.TEXT ? (
                                    <div className="read-doc-container">
                                        <ReactQuill
                                            theme="snow"
                                            value={document.content}
                                            readOnly
                                        />
                                    </div>
                                ) : (
                                    <SyntaxHighlighter
                                        customStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #EDEDED',
                                            borderRadius: 4,
                                            fontSize: '0.8rem'
                                        }}
                                        language={document?.syntax || ""}
                                    >
                                        {document.content}
                                    </SyntaxHighlighter>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default ReadDocumentPage;