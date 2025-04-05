import React, {ReactNode, useId} from "react";
import {FormControl, InputLabel} from "@mui/material";

interface CustomFormControlProps {
    label: string;
    children: ReactNode;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({label, children}) => {
    const id = useId();
    const labelId = `label-${id}`;

    const enhancedChild = React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, {
            labelId,
            id,
            size: "small",
        })
        : children;

    return (
        <FormControl
            sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                    fontSize: '0.85rem',
                    transition: 'border-color 0.2s ease',
                    '& fieldset': {
                        borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                        borderColor: '#999',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#171717',
                        borderWidth: 1.5,
                    },
                },
                '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                },
            }}
        >
            <InputLabel id={labelId}>{label}</InputLabel>
            {enhancedChild}
        </FormControl>
    );
};

export default CustomFormControl;
