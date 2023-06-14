import { useRouter } from 'next/router';

import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import ChangeUserButton from '@/components/common/ChangeUserButton';
import { urls } from '@/lib/mockApp/consts';

const AccountListDoneMain = () => {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <Container>
          <p className="py-16 text-center text-[14px] leading-relaxed">
            {router.query.proc === "approve" ? "承認" : "却下"}処理が完了しました。
          </p>
          <div className={"flex flex-col justify-between gap-4"}>
            <ChangeUserButton text={"申請一覧へ"} onClick={() => router.push(urls.accountList)} />
            <ChangeUserButton text={"金融機関メニューへ"} onClick={() => router.push(urls.accountMenu)} />
          </div>
        </Container>
      </main>
    </>
  );
};

export default AccountListDoneMain;
