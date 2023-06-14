import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import ChangeUserButton from '@/components/common/ChangeUserButton';
import { urls } from '@/lib/mockApp/consts';
import { useRouter } from 'next/router';

const VCRevokeDone = () => {
    const router = useRouter();

    const init = (): { msg: string, listUrl: string, menuUrl: string } => {
        switch (router.pathname) {
            case urls.residentVCListDone:
                return { msg: "自治体メニューへ", listUrl: urls.residentVCList, menuUrl: urls.residentMenu };
            case urls.accountVCListDone:
                return { msg: "金融機関メニューへ", listUrl: urls.accountVCList, menuUrl: urls.accountMenu };
            case urls.taxVCListDone:
                return { msg: "税務署メニューへ", listUrl: urls.taxVCList, menuUrl: urls.taxMenu };
            case urls.subsidyVCListDone:
                return { msg: "事務局メニューへ", listUrl: urls.subsidyVCList, menuUrl: urls.subsidyMenu };
            default:
                return { msg: "", listUrl: "", menuUrl: "" };
        }
    };

    const { msg, listUrl, menuUrl } = init();

    return (
        <>
            <Header />
            <main className="bg-color-background">
                <Container>
                    <p className="py-16 text-center text-[14px] leading-relaxed">
                        VCの取消が完了しました。
                    </p>
                    <div className={"flex flex-col justify-between gap-4"}>
                        <ChangeUserButton text={"申請一覧へ"} onClick={() => router.push(listUrl)} />
                        <ChangeUserButton text={msg} onClick={() => router.push(menuUrl)} />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default VCRevokeDone;