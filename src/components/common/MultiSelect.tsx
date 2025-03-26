import * as React from "react";
import {X} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {Command as CommandPrimitive} from "cmdk";

interface MultiSelectProps {
    data: string[];
    selectedData: string[];
    setSelectedData: (selectedTags: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({data, selectedData, setSelectedData}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (tag: string) => {
        setSelectedData(selectedData.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (inputRef.current) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (inputValue === "" && selectedData.length > 0) {
                    setSelectedData(selectedData.slice(0, -1));
                }
            }
            if (e.key === "Escape") {
                inputRef.current.blur();
            }
        }
    };

    const filteredTags = data.filter((tag) => !selectedData.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase()));

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div
                className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selectedData.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(tag)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select tags..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && filteredTags.length > 0 && (
                        <div
                            className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {filteredTags.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue("");
                                            setSelectedData([...selectedData, tag]);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {tag}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    )}
                </CommandList>
            </div>
        </Command>
    );
}

export default MultiSelect;