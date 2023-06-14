import { FormEventHandler, MouseEventHandler } from 'react';

export type TransitionButtonParams = {
    text: string;
    type: "next" | "prev" | "warnig" | "verify";
    currentUser: "applicant" | "approver";
    isEnabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>
    onSubmit?: FormEventHandler<HTMLButtonElement>
}

const TransitionButton = ({ text, type, currentUser, isEnabled = true,  onClick, onSubmit }: TransitionButtonParams) => {
    return (
        <button type='submit' onClick={onClick} onSubmit={onSubmit} disabled={!isEnabled}
            className={
                "min-w-22 w-auto h-12 py-3 px-2 rounded-md text-base font-bold disabled:bg-color-menu-button disabled:text-white disabled:border-0 " +
                (
                    (type == "next")
                        ? "text-white ml-auto mt-auto " +
                        ((currentUser == "applicant")
                            ? "bg-color-green "
                            : "bg-color-blue ")
                        : ((type == "warnig")
                            ? "text-white ml-auto mt-auto bg-color-warnig"
                            : ((type == "verify")
                                ? "bg-color-verify text-white ml-auto mt-auto"
                                : "bg-white text-black border border-color-gray "))
                )
            }>
            {text}
        </button >
    )
};

export default TransitionButton;