import useDIDInfo, { UseDIDInfoParams } from './useDIDInfo';

const DIDInfo = (params: UseDIDInfoParams) => {
  const { name, did, balance } = useDIDInfo(params);
  return (
    <div>
      <div className="flex">
        <div className="w-16">{name}</div>
        <div className="w-[500px]">{did}</div>
        <div className="w-36 text-right">
          {balance && <span>{balance} ALGO</span>}
        </div>
      </div>
    </div>
  );
};

export default DIDInfo;
