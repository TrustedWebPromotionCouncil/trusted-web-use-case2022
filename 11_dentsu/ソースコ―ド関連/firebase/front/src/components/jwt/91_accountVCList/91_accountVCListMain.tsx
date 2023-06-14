import { useState, useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import Header from '@/components/common/Header';
import SearchArea from '@/components/common/SearchArea';
import VCListItem from '@/components/common/VCListItem';
import Loading from '../common/Loading';
import useListPage from '@/lib/mockApp/hooks/useListPage';
import { accountVCList2State } from '@/lib/mockApp/states';
import { VCInfo } from '@/lib/mockApp/types';
import { urls } from '@/lib/mockApp/consts';

const AccountVCListMain = () => {
  const { getVCInfoList } = useListPage();

  const [listCount, setListCount] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [vcInfoList, setVCInfoList] = useState<VCInfo[]>();

  const vcList = useRecoilValue(accountVCList2State);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        if (vcList) {
          const vcInfo = await getVCInfoList(vcList, false);
          setVCInfoList(vcInfo);
          setListCount(vcInfo ? vcInfo.length : 0);
        }
      } catch (e) {
        errorHandler(e);
      }
      setIsLoading(() => false);
    })();
  }, [vcList, errorHandler]);

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <SearchArea
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <div className="py-3 px-0 bg-color-gray-count text-center h-[46px] font-sans">
          {listCount} 件中 - {listCount} 件を表示
        </div>
        <Loading isLoading={isLoading}>
          <ul>
            {vcInfoList
              ? vcInfoList.map((item, index) => {
                  return (
                    <VCListItem
                      key={index}
                      item={item}
                      url={{
                        pathname: urls.accountVCListDetail,
                        query: { id: item.id, idx: vcInfoList.length - index },
                      }}
                      vcName={`口座実在証明書-VC${vcInfoList.length - index}`}
                    />
                  );
                })
              : null}
          </ul>
        </Loading>
      </main>
    </>
  );
};

export default AccountVCListMain;
