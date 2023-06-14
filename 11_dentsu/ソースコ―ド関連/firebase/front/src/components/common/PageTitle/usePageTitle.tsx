import { useRouter } from 'next/router';
import { urls } from '@/lib/mockApp/consts';

const usePageTitle = () => {
  const router = useRouter();

  const title = {
    applierMenu: '申請者メニュー',
    residentApply: '住民票紐付申請',
    accountApply: '口座実在証明申請',
    taxApply: '納税証明書交付申請',
    subsidyApply: '補助金申請',
    ApplyList: '申請一覧',
    ApplyInquiry: '申請内容照会',
    VCList: 'デジタル証明書(VC)一覧',
    VCInquiry: 'デジタル証明書(VC)内容照会',
    residentMenu: '自治体メニュー',
    residentList: '住民票紐付申請一覧',
    residentListDetail: '住民票紐付申請内容照会',
    accountList: '口座実在証明申請一覧',
    accountListDetail: '口座実在証明申請内容照会',
    taxList: '納税証明書交付申請一覧',
    taxListDetail: '納税証明書交付申請内容照会',
    subsidyList: '補助金申請一覧',
    subsidyListDetail: '補助金申請内容照会',
    issueDone: '処理完了',
    accountMenu: '金融機関メニュー',
    taxMenu: '税務署メニュー',
    subsidyMenu: '事務局メニュー',
    applicationList: '申請一覧',
    VCRevoke: 'デジタル証明書(VC)取消完了',
  } as const;

  const getTitle = () => {
    switch (router.pathname) {
      case urls.applierMenu:
        return title.applierMenu;
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
        return title.residentApply;
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
        return title.accountApply;
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
        return title.taxApply;
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
        return title.subsidyApply;
      case urls.residentMenu:
        return title.residentMenu;
      case urls.residentList:
        return title.residentList;
      case urls.residentListDetail:
        return title.residentListDetail;
      case urls.accountMenu:
        return title.accountMenu;
      case urls.accountList:
        return title.accountList;
      case urls.accountListDetail:
        return title.accountListDetail;
      case urls.taxMenu:
        return title.taxMenu;
      case urls.taxList:
        return title.taxList;
      case urls.taxListDetail:
        return title.taxListDetail;
      case urls.subsidyMenu:
        return title.subsidyMenu;
      case urls.subsidyList:
        return title.subsidyList;
      case urls.subsidyListDetail:
        return title.subsidyListDetail;
      case urls.residentListDone:
      case urls.accountListDone:
      case urls.taxListDone:
      case urls.subsidyListDone:
        return title.issueDone;
      case urls.applicationList:
        return title.applicationList;
      case urls.residentVCList:
      case urls.accountVCList:
      case urls.taxVCList:
      case urls.VCList:
      case urls.subsidyVCList:
        return title.VCList;
      case urls.applicationListDetail:
        return title.ApplyInquiry;
      case urls.VCInquiry:
      case urls.residentVCListDetail:
      case urls.accountVCListDetail:
      case urls.taxVCListDetail:
      case urls.subsidyVCListDetail:
        return title.VCInquiry;
      case urls.residentVCListDone:
      case urls.accountVCListDone:
      case urls.taxVCListDone:
      case urls.subsidyVCListDone:
        return title.VCRevoke;
    }
  };

  return { getTitle };
};

export default usePageTitle;
