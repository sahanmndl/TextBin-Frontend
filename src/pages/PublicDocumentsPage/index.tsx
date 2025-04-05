import Header from "@/components/common/Header.tsx";
import {useEffect, useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getDocuments} from "@/api/document.ts";
import {useInView} from "react-intersection-observer";
import {toast} from "sonner";
import DocumentFilters from "@/pages/PublicDocumentsPage/components/DocumentFilters.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import DocumentCard from "@/pages/PublicDocumentsPage/components/DocumentCard.tsx";
import {Button} from "@/components/ui/button.tsx";

interface FilterState {
    tags: string[]
    type: string | undefined
    sortBy: "createdAt" | "views"
    sortOrder: "asc" | "desc"
}

const PublicDocumentsPage = () => {
    const {ref, inView} = useInView()
    const [filters, setFilters] = useState<FilterState>({
        tags: [],
        type: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
    })

    const {data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch} = useInfiniteQuery({
        queryKey: ["get-documents", filters],
        queryFn: async ({pageParam = 1}) => {
            return getDocuments({
                page: pageParam,
                limit: 12,
                tags: filters.tags.length > 0 ? filters.tags : undefined,
                type: filters.type,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            })
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNext ? lastPage.pagination.currentPage + 1 : undefined
        },
        initialPageParam: 1,
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters((prev) => ({...prev, ...newFilters}))
    }

    useEffect(() => {
        if (error) {
            toast.error("Error loading documents",)
        }
    }, [error])

    const documents = data?.pages.flatMap((page) => page.data) || [];

    return (
        <main className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 px-8 py-4">
                <h1 className="text-2xl font-bold mb-4">Public Documents</h1>

                <DocumentFilters filters={filters} onFilterChange={handleFilterChange}/>

                {status === "pending" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                        {Array.from({length: 8}).map((_, i) => (
                            <DocumentCardSkeleton key={i}/>
                        ))}
                    </div>
                ) : status === "error" ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-muted-foreground mb-4">Failed to load documents</p>
                        <Button style={{cursor: 'pointer'}} onClick={() => refetch()}>Try Again</Button>
                    </div>
                ) : (
                    <>
                        {documents.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-muted-foreground">No documents found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                                {documents.map((doc) => (
                                    <DocumentCard key={doc._id} document={doc}/>
                                ))}

                                {isFetchingNextPage &&
                                    Array.from({length: 4}).map((_, i) => <DocumentCardSkeleton key={`loading-${i}`}/>)}

                                <div ref={ref} className="h-4 w-full"/>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

function DocumentCardSkeleton() {
    return (
        <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4"/>
                <Skeleton className="h-4 w-1/2"/>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Skeleton className="h-6 w-16 rounded-full"/>
                    <Skeleton className="h-6 w-20 rounded-full"/>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-24"/>
                    <Skeleton className="h-4 w-12"/>
                </div>
            </div>
        </div>
    )
}

export default PublicDocumentsPage;