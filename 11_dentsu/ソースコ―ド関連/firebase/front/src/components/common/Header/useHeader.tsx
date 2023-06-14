import { useRouter } from 'next/router';
import { urls, icons } from '@/lib/mockApp/consts';

const useHeader = () => {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const isEnableBackBtn = () => {
    switch (router.pathname) {
      case urls.residentDone:
      case urls.accountDone:
      case urls.taxDone:
      case urls.subsidyDone:
        return false;
      default:
        return true;
    }
  };

  const Headings = {
    mainMenu: 'DEMO MENU',
    applierMenu: '申請者',
    residentMenu: '自治体',
    accountMenu: '金融機関',
    taxMenu: '税務署',
    subsidyMenu: '事務局',
    accountAccept: '口座実在証明書の受入',
    taxApply: '納税証明書交付申請',
    taxApprove: '納税証明書交付申請一覧',
    taxAccept: '納税証明書の受入',
    subsidyApply: '補助金申請',
    subsidyApprove: '補助金申請一覧',
    VCList: 'デジタル証明(VC)一覧',
    VCInquiry: 'デジタル証明書(VC)内容照会',
  } as const;

  const Titles = {
    applierMenu: '申請者メニュー',
    residentMenu: '自治体メニュー',
    accountMenu: '金融機関メニュー',
    taxMenu: '税務署メニュー',
    subsidyMenu: '事務局メニュー',
  } as const;

  const colors = {
    mainMenu: 'bg-color-gray',
    applier: 'bg-color-applier-main',
    issuer: 'bg-color-issuer-main',
    subsidy: 'bg-color-subsidy-main',
  } as const;

  const getBgColor = () => {
    switch (router.pathname) {
      case urls.mainMenu:
        return colors.mainMenu;
      case urls.applierMenu:
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
      case urls.applierMenu:
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
      case urls.VCList:
      case urls.VCInquiry:
      case urls.applicationList:
      case urls.applicationListDetail:
        return colors.applier;
      case urls.residentMenu:
      case urls.residentList:
      case urls.residentListDetail:
      case urls.residentListDone:
      case urls.residentVCList:
      case urls.residentVCListDetail:
      case urls.residentVCListDone:
      case urls.accountMenu:
      case urls.accountList:
      case urls.accountListDetail:
      case urls.accountListDone:
      case urls.accountVCList:
      case urls.accountVCListDetail:
      case urls.accountVCListDone:
      case urls.taxMenu:
      case urls.taxList:
      case urls.taxListDetail:
      case urls.taxListDone:
      case urls.taxVCList:
      case urls.taxVCListDetail:
      case urls.taxVCListDone:
        return colors.issuer;
      case urls.subsidyMenu:
      case urls.subsidyList:
      case urls.subsidyListDetail:
      case urls.subsidyListDone:
      case urls.subsidyVCList:
      case urls.subsidyVCListDetail:
      case urls.subsidyVCListDone:
        return colors.subsidy;
      default:
        return '';
    }
  };

  const getHeading = () => {
    switch (router.pathname) {
      case urls.mainMenu:
        return Headings.mainMenu;
      case urls.applierMenu:
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
      case urls.VCList:
      case urls.VCInquiry:
      case urls.applicationList:
      case urls.applicationListDetail:
        return Headings.applierMenu;
      case urls.residentMenu:
      case urls.residentList:
      case urls.residentListDetail:
      case urls.residentListDone:
      case urls.residentVCList:
      case urls.residentVCListDetail:
      case urls.residentVCListDone:
        return Headings.residentMenu;
      case urls.accountMenu:
      case urls.accountList:
      case urls.accountListDetail:
      case urls.accountListDone:
      case urls.accountVCList:
      case urls.accountVCListDetail:
      case urls.accountVCListDone:
        return Headings.accountMenu;
      case urls.taxMenu:
      case urls.taxList:
      case urls.taxListDetail:
      case urls.taxListDone:
      case urls.taxVCList:
      case urls.taxVCListDetail:
      case urls.taxVCListDone:
        return Headings.taxMenu;
      case urls.subsidyMenu:
      case urls.subsidyList:
      case urls.subsidyListDetail:
      case urls.subsidyListDone:
      case urls.subsidyVCList:
      case urls.subsidyVCListDetail:
      case urls.subsidyVCListDone:
        return Headings.subsidyMenu;
      default:
        return '不正なURL';
    }
  };

  const getIcon = () => {
    switch (router.pathname) {
      case urls.applierMenu:
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
      case urls.VCList:
      case urls.VCInquiry:
      case urls.applicationList:
      case urls.applicationListDetail:
        return icons.applier;
      case urls.residentMenu:
      case urls.residentList:
      case urls.residentListDetail:
      case urls.residentListDone:
      case urls.residentVCList:
      case urls.residentVCListDetail:
      case urls.residentVCListDone:
        return icons.resident;
      case urls.accountMenu:
      case urls.accountList:
      case urls.accountListDetail:
      case urls.accountListDone:
      case urls.accountVCList:
      case urls.accountVCListDetail:
      case urls.accountVCListDone:
        return icons.account;
      case urls.taxMenu:
      case urls.taxList:
      case urls.taxListDetail:
      case urls.taxListDone:
      case urls.taxVCList:
      case urls.taxVCListDetail:
      case urls.taxVCListDone:
        return icons.tax;
      case urls.subsidyMenu:
      case urls.subsidyList:
      case urls.subsidyListDetail:
      case urls.subsidyListDone:
      case urls.subsidyVCList:
      case urls.subsidyVCListDetail:
      case urls.subsidyVCListDone:
        return icons.subsidy;
      default:
        return '';
    }
  };

  const getLink = (): { url: string; label: string } => {
    switch (router.pathname) {
      case urls.applierMenu:
      case urls.residentMenu:
      case urls.accountMenu:
      case urls.taxMenu:
      case urls.subsidyMenu:
        return { url: urls.mainMenu, label: 'home' };
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
      case urls.VCList:
      case urls.VCInquiry:
      case urls.applicationList:
      case urls.applicationListDetail:
        return { url: urls.applierMenu, label: 'menu' };
      case urls.residentList:
      case urls.residentListDetail:
      case urls.residentListDone:
      case urls.residentVCList:
      case urls.residentVCListDetail:
      case urls.residentVCListDone:
        return { url: urls.residentMenu, label: 'menu' };
      case urls.accountList:
      case urls.accountListDetail:
      case urls.accountListDone:
      case urls.accountVCList:
      case urls.accountVCListDetail:
      case urls.accountVCListDone:
        return { url: urls.accountMenu, label: 'menu' };
      case urls.taxList:
      case urls.taxListDetail:
      case urls.taxListDone:
      case urls.taxVCList:
      case urls.taxVCListDetail:
      case urls.taxVCListDone:
        return { url: urls.taxMenu, label: 'menu' };
      case urls.subsidyList:
      case urls.subsidyListDetail:
      case urls.subsidyListDone:
      case urls.subsidyVCList:
      case urls.subsidyVCListDetail:
      case urls.subsidyVCListDone:
        return { url: urls.subsidyMenu, label: 'menu' };
      default:
        return { url: '', label: '' };
    }
  };

  const getTitle = () => {
    switch (router.pathname) {
      case urls.applierMenu:
      case urls.residentInput:
      case urls.residentConfirm:
      case urls.residentDone:
      case urls.accountInput:
      case urls.accountConfirm:
      case urls.accountDone:
      case urls.taxInput:
      case urls.taxConfirm:
      case urls.taxDone:
      case urls.subsidyInput:
      case urls.subsidyConfirm:
      case urls.subsidyDone:
      case urls.VCList:
      case urls.VCInquiry:
      case urls.applicationList:
      case urls.applicationListDetail:
        return Titles.applierMenu;
      case urls.residentMenu:
      case urls.residentList:
      case urls.residentListDetail:
      case urls.residentListDone:
      case urls.residentVCList:
      case urls.residentVCListDetail:
      case urls.residentVCListDone:
        return Titles.residentMenu;
      case urls.accountMenu:
      case urls.accountList:
      case urls.accountListDetail:
      case urls.accountListDone:
      case urls.accountVCList:
      case urls.accountVCListDetail:
      case urls.accountVCListDone:
        return Titles.accountMenu;
      case urls.taxMenu:
      case urls.taxList:
      case urls.taxListDetail:
      case urls.taxListDone:
      case urls.taxVCList:
      case urls.taxVCListDetail:
      case urls.taxVCListDone:
        return Titles.taxMenu;
      case urls.subsidyMenu:
      case urls.subsidyList:
      case urls.subsidyListDetail:
      case urls.subsidyListDone:
      case urls.subsidyVCList:
      case urls.subsidyVCListDetail:
      case urls.subsidyVCListDone:
        return Titles.subsidyMenu;
      default:
        return '';
    }
  };

  return {
    getHeading,
    getBgColor,
    getIcon,
    getLink,
    getTitle,
    back,
    isEnableBackBtn,
  };
};

export default useHeader;
