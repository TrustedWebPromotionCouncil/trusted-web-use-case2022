import useConfirmLink from "./useConfirmLink";

export type ListConfirmLinkParam = {
    actor: "applier" | "resident" | "account" | "tax" | "subsidy";
    type: "application" | "VC"
}

const ConfirmLink = ({ actor, type }: ListConfirmLinkParam) => {
    const { getUrl, getBgColor } = useConfirmLink(actor, type)

    const url = getUrl();
    const bgColor = getBgColor();

    return (
        <a href={url} className={`flex flex-col justify-center items-center gap-[6px] ${(actor === "applier" ? "w-[139px]" : "w-[246px]")} h-[89px] rounded-lg ${bgColor}`}>
            <img src={
                type === "application"
                    ? "/application-icon.svg"
                    : "/VC-icon.svg"
            } alt="アイコン"
                className={(type === "application" ? "pl-[6px]" : "")}
            />
            {
                type === "application"
                    ? <span className="mt-[6px] text-center text-[15px] leading-[15px] font-bold">申請一覧</span>
                    : <span className={`text-center ${(actor === "applier" ? "text-[12px]" : "text-[15px]")} font-bold`}>デジタル証明書{(actor === "applier" ? <br /> : null)}(VC)一覧</span>
            }
        </a>
    )
};

export default ConfirmLink;