import { useRouter } from "next/router";
import TaxListDetailMain from "../35_taxListDetail";
import SubsidyListDetailMain from "../45_subsidyListDetail";

const TaxListAcceptedMain = () => {
    const router = useRouter();
    let component;

    switch (router.query.vc) {
        case "tax":
            component = <TaxListDetailMain/>;
            break;
        case "subsidy":
            component = <SubsidyListDetailMain/>;
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

export default TaxListAcceptedMain;