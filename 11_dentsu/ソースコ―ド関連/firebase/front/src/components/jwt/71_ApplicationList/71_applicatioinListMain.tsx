import Header from '@/components/common/Header';

import ApplicationListContainer from '@/components/common/ApplicationListContainer';
import useApplicationListMain from './useApplicationListMain';
import Loading from '../common/Loading';

const ApplicationListMain = () => {
  const { residentList, accountList, taxList, subsidyList, isLoading } =
    useApplicationListMain();

  return (
    <>
      <Header />
      <Loading isLoading={isLoading}>
        <>
          <ApplicationListContainer type="resident" items={residentList} />
          <ApplicationListContainer type="account" items={accountList} />
          <ApplicationListContainer type="tax" items={taxList} />
          <ApplicationListContainer type="subsidy" items={subsidyList} />
        </>
      </Loading>
    </>
  );
};

export default ApplicationListMain;
