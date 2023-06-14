import { ApplicationStatus as ApplicationStatusArea } from '@/lib/mockApp/types';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

export type ApplicationStatusAreaParams = {
  applicationDate?: string;
  ApplicationStatus: ApplicationStatusArea;
};

const ApplicationStatusArea = ({
  applicationDate,
  ApplicationStatus,
}: ApplicationStatusAreaParams) => {
  dayjs.locale('ja');
  return (
    <>
      {applicationDate && (
        <section
          className={
            'flex flex-col items-center gap-1 w-72 mx-auto mb-2 pb-4 border-b'
          }
        >
          {ApplicationStatus.approvalStatus ? (
            <p
              className={
                'relative text-sm text-color-gray-search leading-relaxed'
              }
            >
              <img
                src="/authenticated.svg"
                className={
                  'absolute top-0 h-9 -translate-y-2 -translate-x-full'
                }
              />
              検証OK
            </p>
          ) : (
            <p
              className={
                'relative text-sm text-color-gray-search leading-relaxed'
              }
            >
              <img
                src="/warning.svg"
                className={'absolute h-4 -translate-x-full pr-2'}
              />
              検証NG
            </p>
          )}
          {ApplicationStatus.issuedStatus ? (
            ApplicationStatus.revokeStatus ? (
              <p
                className={
                  'relative text-sm text-color-gray-search leading-relaxed'
                }
              >
                <img
                  src="/authenticated.svg"
                  className={
                    'absolute top-0 h-9 -translate-y-2 -translate-x-[105%]'
                  }
                />
                承認済
              </p>
            ) : (
              <p className={'text-sm text-color-gray-search leading-relaxed'}>
                取消済
              </p>
            )
          ) : (
            <p className={'text-sm text-color-required leading-relaxed'}>
              未承認
            </p>
          )}
          <p className={'text-xs text-color-gray-search leading-relaxed'}>
            申請日
            {applicationDate}
          </p>
        </section>
      )}
    </>
  );
};

export default ApplicationStatusArea;
