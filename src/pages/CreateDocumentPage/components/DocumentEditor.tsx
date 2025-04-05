import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TextEditor from "@/components/common/TextEditor.tsx";
import CodeEditor from "@/components/common/CodeEditor.tsx";
import DocumentForm from "@/pages/CreateDocumentPage/components/DocumentForm.tsx";
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {documentTypes} from "@/constants/constants.ts";

const DocumentEditor = () => {
    const [mode, setMode] = useState(documentTypes.TEXT);
    const [text, setText] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [language, setLanguage] = useState<string>("javascript");
    const [count, setCount] = useState<number>(0);

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
        if (count > 0) {
            setText("");
            setCode("");
            setLanguage("javascript");
        }
    }, [count]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
                <Tabs defaultValue="text" className="w-full" onValueChange={handleTabChange}>
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
            <div className="mt-20 lg:mt-0 lg:col-span-2">
                <DocumentForm mode={mode} content={content} language={language} setCount={setCount}/>
            </div>
        </div>
    )
}

export default DocumentEditor;