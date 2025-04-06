import React from "react";
import {toast} from "sonner";
import {Box, IconButton, Tooltip} from "@mui/material";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ExternalLink, KeyRound, LinkIcon, Lock} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {SavedDocumentType} from "@/api/document.ts";

type DocumentCardProps = {
    document: SavedDocumentType;
};

const SavedDocumentCard = ({document}: DocumentCardProps) => {
    const {title, readLink, updateLink, decryptionKey, createdAt} = document;

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, text: string, label: string) => {
        e.preventDefault();
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const openInNewTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, url: string) => {
        e.preventDefault();
        window.open(url, "_blank");
    };

    return (
        <Box
            component="a"
            href={readLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{textDecoration: "none", color: "inherit"}}
        >
            <Card
                className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md rounded-sm cursor-pointer"
                style={{maxWidth: "100%"}}
            >
                <CardHeader>
                    <Tooltip title={title} arrow enterDelay={1000}>
                        <CardTitle
                            className="text-lg font-semibold break-words whitespace-normal"
                            style={{wordBreak: "break-word", overflowWrap: "break-word"}}
                        >
                            {title}
                        </CardTitle>
                    </Tooltip>
                </CardHeader>

                <CardContent className="flex-1">
                    <p className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(new Date(createdAt), {addSuffix: true})}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-between px-4">
                    <Tooltip title="Copy Read Link">
                        <IconButton onClick={(e) => handleCopy(e, readLink, "Read link")} size="small">
                            <LinkIcon className="h-4 w-4"/>
                        </IconButton>
                    </Tooltip>

                    {decryptionKey ? (
                        <Tooltip title="Copy Decryption Key">
                            <IconButton onClick={(e) => handleCopy(e, decryptionKey, "Decryption key")} size="small">
                                <KeyRound className="h-4 w-4"/>
                            </IconButton>
                        </Tooltip>
                    ) : updateLink ? (
                        <Tooltip title="Open Update Link">
                            <IconButton onClick={(e) => openInNewTab(e, updateLink)} size="small">
                                <ExternalLink className="h-4 w-4"/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Private Document">
                            <IconButton disabled size="small">
                                <Lock className="h-4 w-4"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </CardFooter>
            </Card>
        </Box>
    );
};

export default SavedDocumentCard;