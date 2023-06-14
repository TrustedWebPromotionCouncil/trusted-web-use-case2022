import { useRouter } from 'next/router';

const useApplicationListContainer = (type: string) => {
    const router = useRouter();

    const getMsg = () => {
        switch (type) {
            case "resident":
                return "住民票紐紐付申請"
            case "account":
                return "口座実在証明申請"
            case "tax":
                return "納税証明書交付申請"
            case "subsidy":
                return "補助金申請"
        }
    }

    const onInquiry = (type: string, id: string) => {
        router.push({
            pathname: "/72_applicationListDetail",
            query: {
                "type": type,
                "id": id,
            }
        })
    }

    return { getMsg, onInquiry }
};

export default useApplicationListContainer;