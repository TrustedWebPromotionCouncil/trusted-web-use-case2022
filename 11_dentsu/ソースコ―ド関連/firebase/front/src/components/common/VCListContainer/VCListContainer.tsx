import { VCInfo } from '@/lib/mockApp/types';
import useVCListContainer from './useVCListContainer';

export type VCListContainerTypes = {
  type: '住民票' | '口座実在証明書' | '納税証明書' | '補助金申請';
  items?: VCInfo[];
};

const VCListContainer = ({ type, items }: VCListContainerTypes) => {
  const { onInquiry } = useVCListContainer();

  return (
    <section className={''}>
      <div className="flex w-full items-center bg-color-vcheader h-8">
        <h2 className={'pl-4 text-sm font-bold'}>{type}VC</h2>
      </div>
      <ul className={'max-h-[148px] overflow-y-scroll'}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <li
              key={index}
              className={
                'flex justify-between items-center h-11 pl-3 pr-4 my-1 w-full border-b text-sm'
              }
            >
              <span className={'w-fit text-color-gray'}>{index + 1}.</span>
              <span className={'w-fit text-xs text-color-gray mr-3'}>
                {item.issueDate}
              </span>
              <span className={'w-35 text-xs font-bold'}>
                {type} - VC{items.length - index}
              </span>
              <span className={'text-xs mr-2 text-color-gray'}>
                {item.ApplicationStatus.revokeStatus ? '発行済' : '取消済'}
              </span>
              <button
                className={'w-16 h-7 border rounded-lg'}
                onClick={() => onInquiry(type, item.id, items.length - index)}
              >
                照会
              </button>
            </li>
          ))
        ) : (
          <p className={'w-fit mt-3 mx-auto text-sm text-color-gray-search'}>
            取得済のVCはありません
          </p>
        )}
      </ul>
    </section>
  );
};

export default VCListContainer;
