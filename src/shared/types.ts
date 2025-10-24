import React from "react";

export type ButtonVariant = "primary" | "secondary";

export type InputPropsBase = {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    type?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
};
