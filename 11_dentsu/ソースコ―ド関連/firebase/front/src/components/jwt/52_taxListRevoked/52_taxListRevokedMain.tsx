import { useRouter } from "next/router";
import TaxListDoneMain from "../36_taxListDone";
import SubsidyListDoneMain from "../46_subsidyListDone";

const TaxListRevoked = () => {
    const router = useRouter();
    let component;

    switch (router.query.vc) {
        case "tax":
            component = <TaxListDoneMain/>;
            break;
        case "subsidy":
            component = <SubsidyListDoneMain/>;
            break;
        default:
            break;
    }

    return (
        <>
        {component}
        </>
    );
};

export default TaxListRevoked;