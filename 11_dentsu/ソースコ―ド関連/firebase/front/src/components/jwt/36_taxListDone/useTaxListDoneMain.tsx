import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useResetRecoilState } from 'recoil';

const useTaxListDoneMain = () => {
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query.proc === 'approve') {
      setMsg('承認処理が完了しました。');
    } else if (router.query.proc === 'reject') {
      setMsg('却下処理が完了しました。');
    }
  }, [router.query]);

  const onSubmit = () => {
    router.push('/37_VCAccept');
  };

  const back = () => {
    router.push('/34_taxList', '/34_taxList');
  };

  return { msg, onSubmit, back };
};

export default useTaxListDoneMain;
