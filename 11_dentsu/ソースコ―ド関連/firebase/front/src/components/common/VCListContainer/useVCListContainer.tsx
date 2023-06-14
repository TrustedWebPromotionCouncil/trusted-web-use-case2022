import { useRouter } from "next/router";

const useVCListContainer = () => {
    const router = useRouter()
    const onInquiry = (type: string, id: string, idx: number) => {
        router.push({
            pathname: "/62_VCInquiry",
            query: {
                "type": type,
                "id": id,
                "idx": idx
            }
        })
    }
    return {  onInquiry }
};

export default useVCListContainer;