import Container from "@/components/common/Container";
import Header from "@/components/common/Header";
import ConfirmLink from "@/components/common/ListConfirmLink";

const ResidentMenuMain = () => {
    return (
        <>
            <Header />
            <main>
                <Container>
                    <div className="flex flex-col gap-[19px] w-fit mx-auto mt-16">
                        <ConfirmLink actor="resident" type="application" />
                        <ConfirmLink actor="resident" type="VC" />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default ResidentMenuMain;