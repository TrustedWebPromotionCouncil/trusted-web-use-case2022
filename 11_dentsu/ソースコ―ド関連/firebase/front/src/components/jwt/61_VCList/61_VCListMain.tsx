import Header from '@/components/common/Header';
import useVCListMain from './useVCListMain';
import VCListContainer from '@/components/common/VCListContainer';
import Loading from '../common/Loading';


const VCListMain = () => {
    const { residentList, accountList, taxList,subsidyList, isLoading } = useVCListMain()

    return (
        <>
            <Header />
            <main className={""}>
                <Loading isLoading={isLoading} >
                    <>
                        <VCListContainer type={"住民票"} items={residentList} />
                        <VCListContainer type={"口座実在証明書"} items={accountList} />
                        <VCListContainer type={"納税証明書"} items={taxList} />
                        <VCListContainer type={"補助金申請"} items={subsidyList} />
                    </>
                </Loading>
            </main>
        </>
    )
};

export default VCListMain;