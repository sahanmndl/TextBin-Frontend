import {Card, CardContent} from "@/components/ui/card"
import {useState} from "react"
import {AVAILABLE_TAGS, documentTypes} from "@/constants/constants.ts";
import {Button, Checkbox, ListItemText, Menu, MenuItem, Select} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import CustomFormControl from "@/components/common/CustomFormControl.tsx";

interface FilterState {
    tags: string[]
    type: string | undefined
    sortBy: "createdAt" | "views"
    sortOrder: "asc" | "desc"
}

interface DocumentFiltersProps {
    filters: FilterState
    onFilterChange: (filters: Partial<FilterState>) => void
}

const DocumentFilters = ({filters, onFilterChange}: DocumentFiltersProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const tagsOpen = Boolean(anchorEl);

    const toggleTag = (tag: string) => {
        if (filters.tags.includes(tag)) {
            onFilterChange({tags: filters.tags.filter((t) => t !== tag)})
        } else {
            onFilterChange({tags: [...filters.tags, tag]})
        }
    }

    const clearFilters = () => {
        onFilterChange({
            tags: [],
            type: undefined,
            sortBy: "createdAt",
            sortOrder: "desc",
        })
    }

    return (
        <Card className="shadow-sm rounded-sm">
            <CardContent className="px-4 py-0">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full sm:w-auto">
                        <Button
                            variant="outlined"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            endIcon={tagsOpen ? <ExpandLess/> : <ExpandMore/>}
                            sx={{
                                textTransform: 'none',
                                color: '#262626',
                                borderColor: '#ccc',
                                height: 37,
                                fontSize: '0.85rem'
                            }}
                        >
                            {filters.tags.length > 0
                                ? `${filters.tags.length} tag${filters.tags.length > 1 ? 's' : ''}`
                                : 'Filter By Tags'}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={tagsOpen}
                            onClose={() => setAnchorEl(null)}
                        >
                            {AVAILABLE_TAGS.map((tag) => (
                                <MenuItem
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    sx={{padding: '0 12px 0 0'}}
                                >
                                    <Checkbox size="small" checked={filters.tags.includes(tag)}/>
                                    <ListItemText primary={tag}/>
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <CustomFormControl label="Type">
                        <Select
                            value={filters.type || 'all'}
                            label="Type"
                            onChange={(e) =>
                                onFilterChange({
                                    type: e.target.value === 'all' ? undefined : e.target.value,
                                })
                            }
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value={documentTypes.TEXT}>Text</MenuItem>
                            <MenuItem value={documentTypes.CODE}>Code</MenuItem>
                        </Select>
                    </CustomFormControl>

                    <CustomFormControl label="Sort By">
                        <Select
                            value={filters.sortBy}
                            label="Sort By"
                            onChange={(e) =>
                                onFilterChange({
                                    sortBy: e.target.value as 'createdAt' | 'views',
                                })
                            }
                        >
                            <MenuItem value="createdAt">Date</MenuItem>
                            <MenuItem value="views">Views</MenuItem>
                        </Select>
                    </CustomFormControl>

                    <CustomFormControl label="Order">
                        <Select
                            value={filters.sortOrder}
                            label="Order"
                            onChange={(e) =>
                                onFilterChange({
                                    sortOrder: e.target.value as 'asc' | 'desc',
                                })
                            }
                        >
                            <MenuItem value="desc">Descending</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                        </Select>
                    </CustomFormControl>

                    <Button
                        variant="text"
                        color="inherit"
                        size="small"
                        onClick={clearFilters}
                        disabled={
                            filters.tags.length === 0 &&
                            !filters.type &&
                            filters.sortBy === 'createdAt' &&
                            filters.sortOrder === 'desc'
                        }
                        sx={{ml: 'auto', textTransform: 'none'}}
                    >
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentFilters;