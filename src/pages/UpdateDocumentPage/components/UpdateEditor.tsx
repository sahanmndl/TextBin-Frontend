import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TextEditor from "@/components/common/TextEditor.tsx";
import CodeEditor from "@/components/common/CodeEditor.tsx";
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {documentTypes} from "@/constants/constants.ts";
import {useQuery} from "@tanstack/react-query";
import {getDocumentByUpdateCode} from "@/api/document.ts";
import {useParams} from "react-router-dom";
import {Alert} from "@mui/material";
import UpdateForm from "@/pages/UpdateDocumentPage/components/UpdateForm.tsx";
import CircularLoader from "@/components/common/CircularLoader.tsx";
import {AxiosError} from "axios";

const UpdateEditor = () => {
    const {updateCode} = useParams();
    const [mode, setMode] = useState(documentTypes.TEXT);
    const [text, setText] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [language, setLanguage] = useState<string>("javascript");

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['get-document-update-code', updateCode],
        queryFn: () => getDocumentByUpdateCode(updateCode!),
        enabled: !!updateCode
    });

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
    }

    const handleTabChange = (value: string) => {
        const newMode = value === "text" ? documentTypes.TEXT : documentTypes.CODE;
        setMode(newMode);
    };

    useEffect(() => {
        setContent(mode === documentTypes.TEXT ? text : code);
    }, [mode, text, code]);

    useEffect(() => {
        if (data) {
            setMode(data.type);
            if (data.type === documentTypes.TEXT) {
                setText(data.content);
            } else {
                setCode(data.content);
                setLanguage(data.syntax);
            }
            handleTabChange(data.type === documentTypes.TEXT ? "text" : "code");
        }
    }, [data]);

    if (isLoading) {
        return <CircularLoader/>;
    }

    if (isError) {
        const axiosError = error as AxiosError<{ error: string }>;
        return <Alert severity="error">{axiosError.response?.data.error || "Unable to fetch document!"}</Alert>;
    }

    return (
        <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 space-y-4">
                <Tabs
                    defaultValue="text"
                    value={mode === documentTypes.TEXT ? "text" : "code"}
                    className="w-full"
                    onValueChange={handleTabChange}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">TEXT</TabsTrigger>
                        <TabsTrigger value="code">CODE</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4">
                        <TextEditor value={text} onChange={setText}/>
                    </TabsContent>
                    <TabsContent value="code" className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="language">Select Language</Label>
                                <Select value={language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger id="language" className="w-full">
                                        <SelectValue placeholder="Select language"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="html">HTML</SelectItem>
                                        <SelectItem value="css">CSS</SelectItem>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="typescript">TypeScript</SelectItem>
                                        <SelectItem value="cpp">C++</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="go">Go</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="border">
                                <CodeEditor value={code} onChange={setCode} language={language}/>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="col-span-2">
                <UpdateForm
                    mode={mode}
                    content={content}
                    language={language}
                    oldDocument={data}
                />
            </div>
        </div>
    )
}

export default UpdateEditor;