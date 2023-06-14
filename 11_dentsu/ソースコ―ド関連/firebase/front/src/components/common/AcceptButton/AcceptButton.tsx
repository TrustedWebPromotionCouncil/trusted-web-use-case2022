import { MouseEventHandler } from "react";

export type AcceptButtonParams = {
    isEnable: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>
};

const AcceptButton = ({ isEnable, onClick }: AcceptButtonParams) => {
    return (
        <button disabled={!isEnable} onClick={onClick} className={"block w-35 h-14 mx-auto mb-11 py-3 rounded-md text-base font-bold text-white " + (isEnable ? "bg-color-green" : "bg-color-gray-accepted")}>
            {isEnable ? "受け入れる" : "受入済"}
        </button>
    )
};

export default AcceptButton;