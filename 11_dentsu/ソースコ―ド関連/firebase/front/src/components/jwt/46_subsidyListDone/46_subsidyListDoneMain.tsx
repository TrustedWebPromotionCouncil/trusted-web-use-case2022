import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import useSubsidyListDoneMain from './useSubsidyListDoneMain';
import ChangeUserButton from '@/components/common/ChangeUserButton';
import { useRouter } from 'next/router';
import { urls } from '@/lib/mockApp/consts';

const SubsidyListDoneMain = () => {
    const { msg } = useSubsidyListDoneMain();
    const router = useRouter();

    return (
        <>
            <Header />
            <main className="bg-color-background">
                <Container>
                    <p className="py-16 text-center text-[14px] leading-relaxed">
                        {msg}
                    </p>
                    <div className={"flex flex-col justify-between gap-4"}>
                        <ChangeUserButton text={"申請一覧へ"} onClick={() => router.push(urls.subsidyList)} />
                        <ChangeUserButton text={"事務局メニューへ"} onClick={() => router.push(urls.subsidyMenu)} />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default SubsidyListDoneMain;