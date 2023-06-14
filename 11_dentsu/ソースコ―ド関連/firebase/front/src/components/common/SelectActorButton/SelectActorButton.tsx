import Link from "next/link"
import useSelectActorButton from "./useSelectActorButton";

export type SelectActorButtonParams = {
    target: "applier" | "resident" | "account" | "tax" | "subsidy";
    haveDid: boolean;
}

const SelectActorButton = ({ target, haveDid }: SelectActorButtonParams) => {
    const { getUrl, getBgColor, getIcons, getLabel } = useSelectActorButton(target);
    return (
        <>
            <Link href={getUrl()}>
                <a className={`block relative w-[234px] h-[81px] rounded-lg ${getBgColor()} ${haveDid ? "" : "pointer-events-none bg-color-gray-search opacity-30"}`}>
                    <img src={getIcons()} alt="アイコン" className={"absolute top-1/2 left-[30px] -translate-y-1/2"} />
                    <span className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max pl-[30px] text-[15px] font-bold text-color-white"}>{getLabel()}</span>
                </a>
            </Link>
        </>
    )
};

export default SelectActorButton;