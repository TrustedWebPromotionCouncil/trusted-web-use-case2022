import Container from "@/components/common/Container";
import Header from "@/components/common/Header";
import ConfirmLink from "@/components/common/ListConfirmLink";

const SubsidyMenuMain = () => {
    return (
        <>
            <Header />
            <main>
                <Container>
                    <div className="flex flex-col gap-[19px] w-fit mx-auto mt-16">
                        <ConfirmLink actor="subsidy" type="application" />
                        <ConfirmLink actor="subsidy" type="VC" />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default SubsidyMenuMain;