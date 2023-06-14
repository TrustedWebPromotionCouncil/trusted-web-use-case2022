import { urls } from "@/lib/mockApp/consts";

const useStepLink = (step: number) => {
    const labels = {
        step1: "住民票紐付申請",
        step2: "口座実在証明申請",
        step3: "納税証明書交付申請",
        step4: "補助金申請",
    }


    const getLabel = () => {
        switch (step) {
            case 1:
                return labels.step1
            case 2:
                return labels.step2
            case 3:
                return labels.step3
            case 4:
                return labels.step4
            default:
                return ""
        }
    }
    const getUrl = () => {
        switch (step) {
            case 1:
                return urls.residentInput
            case 2:
                return urls.accountInput
            case 3:
                return urls.taxInput
            case 4:
                return urls.subsidyInput
            default:
                return ""
        }
    }

    return { getLabel, getUrl }
};

export default useStepLink;