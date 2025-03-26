import React, {useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {Eye, EyeOff} from "lucide-react"
import {AVAILABLE_TAGS, DEFAULT_EXPIRY_DATE, documentTypes, privacyStatus, SITE_URL} from "@/constants/constants.ts";
import MultiSelect from "@/components/common/MultiSelect.tsx";
import {addDocument, addDocumentWithEncryption, DocumentType} from "@/api/document.ts";
import {toast} from "sonner";
import {CircularProgress} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {addDays, formatDate} from "date-fns";
import dayjs from "dayjs";
import posthog from "posthog-js";

interface DocumentFormProps {
    mode: string
    content: string
    language: string
    setCount: React.Dispatch<React.SetStateAction<number>>;
}

const DocumentForm: React.FC<DocumentFormProps> = ({mode, content, language, setCount}) => {
    const [title, setTitle] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isExpiring, setIsExpiring] = useState(false);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
    const [isPublic, setIsPublic] = useState(true);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState<DocumentType | null>(null);
    const [decryptionKey, setDecryptionKey] = useState("");

    const handleIsExpiryToggle = (checked: boolean) => {
        if (checked) {
            setExpirationDate(addDays(new Date(), 1));
            setIsExpiring(true);
        } else {
            setIsExpiring(false);
            setExpirationDate(undefined);
        }
    }

    const handleIsPublicToggle = (checked: boolean) => {
        if (checked) {
            setIsPublic(true);
            setIsEncrypted(false);
            setPassword("");
        } else {
            setIsPublic(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let document: DocumentType;
            if (isEncrypted) {
                const response = await addDocumentWithEncryption({
                    title: title.trim(),
                    content: content.trim(),
                    tags: selectedTags,
                    type: mode,
                    syntax: mode === documentTypes.CODE ? language : undefined,
                    privacy: isPublic ? privacyStatus.PUBLIC : privacyStatus.PRIVATE,
                    expiryStatus: {
                        isExpiring,
                        expirationDate: isExpiring ? expirationDate : DEFAULT_EXPIRY_DATE
                    },
                    passwordStatus: isPublic
                        ? undefined
                        : {isPasswordProtected: password.trim() !== "", password},
                    isEncrypted: true,
                });
                document = response.document;
                setDecryptionKey(response.decryptionKey);
            } else {
                document = await addDocument({
                    title: title.trim(),
                    content: content.trim(),
                    tags: selectedTags,
                    type: mode,
                    syntax: mode === documentTypes.CODE ? language : undefined,
                    privacy: isPublic ? privacyStatus.PUBLIC : privacyStatus.PRIVATE,
                    expiryStatus: {
                        isExpiring,
                        expirationDate: isExpiring ? expirationDate : DEFAULT_EXPIRY_DATE
                    },
                    passwordStatus: isPublic
                        ? undefined
                        : {isPasswordProtected: password.trim() !== "", password},
                    isEncrypted: false,
                });
            }

            setDocument(document);
            setCount((count: number) => count + 1);
            setTitle("");
            setSelectedTags([]);
            handleIsExpiryToggle(false);
            setIsPublic(true);
            setPassword("");
            setShowPassword(false);
            setIsEncrypted(false);
            toast.success("Document created successfully!");

            posthog.capture('document_create', {document});
        } catch (error) {
            toast.error("Failed to create document.");
        } finally {
            setLoading(false);
        }
    };

    const handleReadLinkCopy = (readCode: string) => {
        navigator.clipboard.writeText(`${SITE_URL}/read/${readCode}`);
        toast.success("Read URL copied to clipboard!");
    };

    const handleUpdateLinkCopy = (updateCode: string) => {
        navigator.clipboard.writeText(`${SITE_URL}/update/${updateCode}`);
        toast.success("Update URL copied to clipboard!");
    };

    const handleDecryptionKeyCopy = () => {
        navigator.clipboard.writeText(decryptionKey);
        toast.success("Decryption Key copied to clipboard!");
    };

    return (
        <Card className="rounded-md">
            <CardHeader>
                <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="Enter document title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <MultiSelect
                        data={AVAILABLE_TAGS}
                        selectedData={selectedTags}
                        setSelectedData={setSelectedTags}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="expiration">Expiration Date</Label>
                        <Switch id="expiry-toggle" checked={isExpiring} onCheckedChange={handleIsExpiryToggle}/>
                    </div>
                    {isExpiring && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" style={{cursor: 'pointer'}}>
                                    {expirationDate ? formatDate(expirationDate, 'yyyy-MM-dd') : "Select Date"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Select Expiration Date</DialogTitle>
                                </DialogHeader>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        minDate={dayjs(addDays(new Date(), 1))}
                                        value={dayjs(expirationDate)}
                                        onChange={(date) => setExpirationDate(new Date(date))}
                                    />
                                </LocalizationProvider>
                                <DialogClose asChild>
                                    <Button variant="secondary" style={{cursor: 'pointer'}}>Confirm</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="public-toggle">Public</Label>
                        <p className="text-sm text-muted-foreground">
                            {isPublic
                                ? "Anyone can view this document"
                                : "Protect your document with password and/or encryption"
                            }
                        </p>
                    </div>
                    <Switch id="public-toggle" checked={isPublic} onCheckedChange={handleIsPublicToggle}/>
                </div>

                {!isPublic && (
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Set a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isPublic}
                                className="pr-10"
                            />
                            <Button
                                style={{cursor: 'pointer'}}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                        </div>
                    </div>
                )}

                {!isPublic && (
                    <div className="flex items-center justify-between">
                        <Label htmlFor="encrypt-document">Encrypt Document</Label>
                        <Switch checked={isEncrypted} onCheckedChange={setIsEncrypted}/>
                    </div>
                )}
            </CardContent>
            <CardFooter style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <Button
                    style={{cursor: 'pointer'}}
                    type="submit"
                    className="w-full"
                    disabled={loading || content.trim().length === 0 || title.trim().length === 0
                        || (!isPublic && !isEncrypted && password.trim().length === 0)}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} color="inherit"/> : "Create New Doc"}
                </Button>

                {document !== null && (
                    <div className="p-3 rounded-md border border-gray-300 space-y-2 w-full">
                        <p className="text-sm font-medium text-gray-700">Your document has been created!</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Read:</span>{" "}
                                <a
                                    href={`${SITE_URL}/read/${document.readCode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    {SITE_URL}/read/{document.readCode}
                                </a>
                            </p>
                            <Button
                                style={{cursor: 'pointer'}}
                                variant="outline"
                                size="sm"
                                onClick={() => handleReadLinkCopy(document?.readCode)}
                            >
                                Copy
                            </Button>
                        </div>

                        {document.isEncrypted ? (
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-2 max-w-[80%]">
                                    <span className="text-sm text-gray-600 font-medium">Decryption Key:</span>
                                    <div className="text-sm break-words">
                                        {decryptionKey}
                                    </div>
                                </div>
                                <Button
                                    style={{cursor: 'pointer'}}
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDecryptionKeyCopy}
                                >
                                    Copy
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Update:</span>{" "}
                                    <a
                                        href={`${SITE_URL}/update/${document.updateCode}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {SITE_URL}/update/{document.updateCode}
                                    </a>
                                </p>
                                <Button
                                    style={{cursor: 'pointer'}}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateLinkCopy(document?.updateCode)}
                                >
                                    Copy
                                </Button>
                            </div>
                        )}

                        {document.isEncrypted ? (
                            <p className="text-xs text-red-500">
                                ⚠️ Keep your decryption key safe! If you lose it, you won't be able to read this
                                document later.
                            </p>
                        ) : (
                            <p className="text-xs text-red-500">
                                ⚠️ Keep your update URL safe! If you lose it or refresh this page, you won't be able to
                                edit this document later.
                            </p>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default DocumentForm;