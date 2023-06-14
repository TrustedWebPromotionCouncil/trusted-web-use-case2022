import { useState, useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import {
  accountReqList2State,
  accountVCList2State,
} from '@/lib/mockApp/states';

import SearchArea from '@/components/common/SearchArea';
import ApplicationListItem from '../common/ApplicationListItem';
import Header from '@/components/common/Header';
import { ApplicationInfo } from '@/lib/mockApp/types';
import useListPage from '@/lib/mockApp/hooks/useListPage';
import { urls } from '@/lib/mockApp/consts';
import Loading from '@/components/jwt/common/Loading';

const AccountListMain = () => {
  const { getApplicationInfoList } = useListPage();
  const errorHandler = useErrorHandler();

  const [listCount, setListCount] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [appInfoList, setAppInfoList] = useState<ApplicationInfo[]>();

  const reqList = useRecoilValue(accountReqList2State);
  const vcList = useRecoilValue(accountVCList2State);

  useEffect(() => {
    try {
      (async () => {
        if (reqList) {
          const appInfoList = await getApplicationInfoList(
            reqList,
            vcList,
            false
          );
          setAppInfoList(appInfoList);
          setListCount(appInfoList ? appInfoList.length : 0);
        }
        setIsLoading(false);
      })();
    } catch (e) {
      errorHandler(e);
    }
  }, [errorHandler, reqList, vcList]);

  return (
    <>
      <Header />
      <Loading isLoading={isLoading}>
        <main className="bg-color-background">
          <SearchArea
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <div className="py-3 px-0 bg-color-gray-count text-center h-[46px] font-sans">
            {listCount} 件中 - {listCount} 件を表示
          </div>
          <ul>
            {appInfoList
              ? appInfoList.map((item, index) => {
                  return (
                    <ApplicationListItem
                      item={item}
                      url={{
                        pathname: urls.accountListDetail,
                        query: { id: item.id },
                      }}
                      key={index}
                    />
                  );
                })
              : undefined}
          </ul>
        </main>
      </Loading>
    </>
  );
};

export default AccountListMain;
