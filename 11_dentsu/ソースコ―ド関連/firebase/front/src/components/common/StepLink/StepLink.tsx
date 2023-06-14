import { MouseEventHandler } from "react";
import useStepLink from "./useStepLink";

export type StepLinkParams = {
    step: 1 | 2 | 3 | 4;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const StepLink = ({ step, onClick }: StepLinkParams) => {
    const { getLabel, getUrl } = useStepLink(step)
    return (
        <>
            <div className="flex justify-center items-start w-fit h-fit mx-auto">
                <div className="flex justify-center items-center w-[53px] h-[53px] rounded-full bg-color-step-icon z-10">
                    <span className="text-[13px] text-color-white font-bold">STEP{step}</span>
                </div>
                <a href={getUrl()} onClick={onClick} className="flex justify-center items-center w-[180px] h-[47px] mt-4 -ml-[5px] mr-5 bg-white border border-color-menu-button rounded-lg z-0">
                    <span className={"text-[15px] font-bold"}>{getLabel()}</span>
                </a>
            </div>
        </>
    )
};

export default StepLink;