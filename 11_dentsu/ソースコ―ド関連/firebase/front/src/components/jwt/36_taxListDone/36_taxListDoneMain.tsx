import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import useTaxListDoneMain from './useTaxListDoneMain';
import ChangeUserButton from '@/components/common/ChangeUserButton';
import { urls } from '@/lib/mockApp/consts';
import { useRouter } from 'next/router';

const TaxListDoneMain = () => {
    const { msg } = useTaxListDoneMain();
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
                        <ChangeUserButton text={"申請一覧へ"} onClick={() => router.push(urls.taxList)} />
                        <ChangeUserButton text={"税務署メニューへ"} onClick={() => router.push(urls.taxMenu)} />
                    </div>
                </Container>
            </main>
        </>
    )
};

export default TaxListDoneMain;