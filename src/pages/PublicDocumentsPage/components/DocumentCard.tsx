import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {formatDistanceToNow} from "date-fns"
import {Code, Eye, FileText} from "lucide-react"
import {DocumentType} from "@/api/document.ts";
import {documentTypes, SITE_URL} from "@/constants/constants.ts";
import {Box, Tooltip} from "@mui/material";

interface DocumentCardProps {
    document: DocumentType
}

const DocumentCard = ({document}: DocumentCardProps) => {
    const {title, type, tags, readCode, views, createdAt} = document

    return (
        <Box
            component="a"
            href={`${SITE_URL}/read/${readCode}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{textDecoration: "none", color: "inherit"}}
        >
            <Card
                className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md rounded-sm cursor-pointer">
                <CardHeader>
                    <Tooltip title={title} arrow enterDelay={1000}>
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                                {type === documentTypes.CODE ? (
                                    <Code className="h-4 w-4 text-blue-500"/>
                                ) : (
                                    <FileText className="h-4 w-4 text-green-500"/>
                                )}
                            </div>
                            <CardTitle className="text-lg line-clamp-1 flex-1">
                                {title}
                            </CardTitle>
                        </div>
                    </Tooltip>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-2 py-0 text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {tags.length > 3 && (
                            <Badge variant="outline" className="px-2 py-0 text-xs">
                                +{tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="mt-auto flex justify-between text-xs text-muted-foreground pt-0">
                    <span>{formatDistanceToNow(new Date(createdAt), {addSuffix: true})}</span>
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3"/> {views}
                    </span>
                </CardFooter>
            </Card>
        </Box>
    )
}

export default DocumentCard;
