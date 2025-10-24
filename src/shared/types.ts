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
    icon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
};

export type TaskStatus = 'waiting' | 'in-progress' | 'completed' | 'abandoned';

export type Task = {
    id: string;
    title: string;
    description?: string;
    due?: string;
    status: TaskStatus;
};
