import { urls } from "@/lib/mockApp/consts";

const useConfirmLink = (actor: string, type: string) => {

    const colors = {
        applier: "bg-color-applier-shadow",
        issuer: "bg-color-issuer-shadow",
        subsidy: "bg-color-subsidy-shadow",
    } as const;

    const getUrl = () => {
        switch (actor) {
            case "applier":
                switch (type) {
                    case "application":
                        return urls.applicationList;
                    case "VC":
                        return urls.VCList;
                    default:
                        return "";
                }
            case "resident":
                switch (type) {
                    case "application":
                        return urls.residentList;
                    case "VC":
                        return urls.residentVCList;
                    default:
                        return "";
                }
            case "account":
                switch (type) {
                    case "application":
                        return urls.accountList;
                    case "VC":
                        return urls.accountVCList;
                    default:
                        return "";
                }
            case "tax":
                switch (type) {
                    case "application":
                        return urls.taxList;
                    case "VC":
                        return urls.taxVCList;
                    default:
                        return "";
                }
            case "subsidy":
                switch (type) {
                    case "application":
                        return urls.subsidyList
                    case "VC":
                        return urls.subsidyVCList;
                    default:
                        return "";
                }
            default:
                return "";
        }
    }

    const getBgColor = () => {
        switch (actor) {
            case "applier":
                return colors.applier;
            case "resident":
            case "account":
            case "tax":
                return colors.issuer;
            case "subsidy":
                return colors.subsidy;
            default:
                return "";
        }
    }

    return { getUrl, getBgColor }
};

export default useConfirmLink;