import {CircularProgress} from "@mui/material";

const CircularLoader = () => {
    return (
        <div className="flex flex-1 items-center justify-center w-full p-4">
            <CircularProgress size={24} sx={{color: '#0a0a0a'}}/>
        </div>
    )
}

export default CircularLoader;