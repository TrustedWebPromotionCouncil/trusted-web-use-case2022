import { ApplicationStatus } from '@/lib/mockApp/types';

export type ApplicationButtonAreaParam = {
  isIssuing: boolean;
  ApplicationStatus: ApplicationStatus;
  issueFunc: () => Promise<void>;
  rejectFunc: () => void;
  backFunc: () => void;
};

const ApplicationButtonArea = ({
  isIssuing,
  ApplicationStatus,
  issueFunc,
  rejectFunc,
  backFunc,
}: ApplicationButtonAreaParam) => {
  return (
    <>
      <div className={'w-70 mx-auto relative'}>
        {isIssuing ? (
          <span
            className={
              'absolute right-0 -translate-y-1/2 text-sm leading-relaxed text-yellow-500'
            }
          >
            VC発行中...
          </span>
        ) : null}
      </div>
      <div className="w-70 mx-auto pt-4 pb-2 flex justify-between">
        <button onClick={backFunc} className="input-form-button-white">
          戻る
        </button>
        {!ApplicationStatus.issuedStatus ? (
          ApplicationStatus.approvalStatus ? (
            <button onClick={issueFunc} className="input-form-button-blue">
              承認
            </button>
          ) : (
            <button onClick={rejectFunc} className="input-form-button-white">
              却下
            </button>
          )
        ) : null}
      </div>
    </>
  );
};

export default ApplicationButtonArea;
