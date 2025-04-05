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
import {deleteDocument, DocumentType, updateDocument} from "@/api/document.ts";
import {toast} from "sonner";
import {CircularProgress} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {addDays, formatDate} from "date-fns";
import dayjs from "dayjs";
import posthog from "posthog-js";

interface UpdateFormProps {
    mode: string
    content: string
    language: string
    oldDocument?: DocumentType
}

const UpdateForm: React.FC<UpdateFormProps> = ({mode, content, language, oldDocument}) => {
    const [title, setTitle] = useState(oldDocument?.title || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(oldDocument?.tags || []);
    const [isExpiring, setIsExpiring] = useState(oldDocument?.expiryStatus?.isExpiring || false);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(oldDocument?.expiryStatus?.expirationDate || undefined);
    const [isPublic, setIsPublic] = useState(oldDocument?.privacy === privacyStatus.PUBLIC);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

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
            setPassword("");
        } else {
            setIsPublic(false);
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val)

        if (!isPublic && val.length < 8) {
            setPasswordError("Password must be at least 8 characters long")
        } else {
            setPasswordError("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPublic && password.trim().length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            await updateDocument({
                id: oldDocument?._id || "",
                title: title.trim(),
                content: content.trim(),
                active: oldDocument?.active,
                tags: selectedTags,
                type: mode,
                syntax: mode === documentTypes.CODE ? language : undefined,
                privacy: isPublic ? privacyStatus.PUBLIC : privacyStatus.PRIVATE,
                expiryStatus: {
                    isExpiring,
                    expirationDate: isExpiring ? expirationDate : DEFAULT_EXPIRY_DATE
                },
                passwordStatus: isPublic
                    ? {isPasswordProtected: false, password}
                    : {isPasswordProtected: password.trim() !== "", password},
                updateCode: oldDocument?.updateCode || ''
            });

            toast.success("Document updated successfully!");
            posthog.capture('document_update', {documentId: oldDocument?._id});
        } catch (error) {
            toast.error("Failed to update document.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!oldDocument?._id) return;

        setLoading(true);
        try {
            await deleteDocument({
                id: oldDocument?._id || "",
                readCode: oldDocument?.readCode || "",
                updateCode: oldDocument?.updateCode || "",
            });
            toast.success("Document deleted successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error("Failed to delete document.");
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
                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Set a password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required={!isPublic}
                                    className={`pr-10 ${passwordError ? "border-red-500" : ""}`}
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
                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <Button
                    style={{cursor: 'pointer'}}
                    type="submit"
                    className="w-full"
                    disabled={loading || content.trim().length === 0 || title.trim().length === 0
                        || (!isPublic && password.trim().length < 8)}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} color="inherit"/> : "Update Document"}
                </Button>

                <div className="p-3 rounded-md border border-gray-300 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Read:</span>{" "}
                            <a
                                href={`${SITE_URL}/read/${oldDocument?.readCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {SITE_URL}/read/{oldDocument?.readCode}
                            </a>
                        </p>
                        <Button
                            style={{cursor: 'pointer'}}
                            variant="outline"
                            size="sm"
                            onClick={() => handleReadLinkCopy(oldDocument?.readCode || "")}
                        >
                            Copy
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Update:</span>{" "}
                            <a
                                href={`${SITE_URL}/update/${oldDocument?.updateCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {SITE_URL}/update/{oldDocument?.updateCode}
                            </a>
                        </p>
                        <Button
                            style={{cursor: 'pointer'}}
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateLinkCopy(oldDocument?.updateCode || "")}
                        >
                            Copy
                        </Button>
                    </div>

                    <p className="text-xs text-red-500">
                        ⚠️ Keep your update URL safe! If you lose it or refresh this page, you won't be able to
                        edit this document later.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            style={{cursor: 'pointer'}}
                            type="button"
                            className="w-full bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                            disabled={loading}
                        >
                            Delete Document
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this document? This action cannot be undone.</p>
                        <DialogClose asChild>
                            <Button onClick={handleDelete} color="error" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit"/> : "Delete"}
                            </Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}

export default UpdateForm;