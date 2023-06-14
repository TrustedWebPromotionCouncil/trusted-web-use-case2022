import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import Progress from '@/components/common/Progress';
import ChangeUserButton from '@/components/common/ChangeUserButton';
import useApplicationDone from './useApplicaitonDone';
import { useRouter } from 'next/router';


const ApplicationDone = () => {
    const { getMsg, backMenu } = useApplicationDone();

    return (
        <>
            <Header />
            <main>
                <Progress status={"done"} />
                <Container className='mt-16'>
                    <div className={"text-center text-sm mb-[50px]"}>
                        <p>{getMsg()}が完了しました。</p>
                        <p>承認されるまでお待ちください。</p>
                    </div>
                    <div className={"flex flex-col justify-between gap-4"}>
                        <ChangeUserButton text={"申請者メニューへ"} onClick={backMenu} />
                    </div>
                </Container>
            </main>

        </>
    )
};

export default ApplicationDone;