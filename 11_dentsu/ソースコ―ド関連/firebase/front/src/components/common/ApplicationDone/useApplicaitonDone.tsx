import { useRouter } from 'next/router';
import { urls } from '@/lib/mockApp/consts';

const useApplicationDone = () => {
    const router = useRouter();
    const msgs = {
        resident: "住民票紐付申請",
        account: "口座実在証明申請",
        tax: "納税証明書交付申請",
        subsidy: "補助金申請"
    } as const;

    const getMsg = () => {
        switch (router.pathname) {
            case urls.residentDone:
                return msgs.resident;
            case urls.accountDone:
                return msgs.account;
            case urls.taxDone:
                return msgs.tax;
            case urls.subsidyDone:
                return msgs.subsidy;
            default:
                return "";
        }
    }

    const backMenu = () => {
        router.push(urls.applierMenu);
    }

    return { getMsg, backMenu }
};

export default useApplicationDone;