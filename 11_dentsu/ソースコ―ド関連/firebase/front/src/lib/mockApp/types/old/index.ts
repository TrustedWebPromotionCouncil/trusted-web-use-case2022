export const urls = {
    mainMenu: "/00_menu",
    applierMenu: "/011_applierMenu",
    residentMenu: "/012_residentMenu",
    accountMenu: "/013_accountMenu",
    taxMenu: "/014_taxMenu",
    subsidyMenu: "/015_subsidyMenu",
    residentInput: "/11_resident-input",
    residentConfirm: "/12_resident-confirm",
    residentDone: "/13_resident-done",
    residentList: "/14_resident-list",
    residentListDetail: "/15_resident-list-detail",
    residentListDone: "/16_resident-list-done",
    accountInput: "/21_account-input",
    accountConfirm: "/22_account-confirm",
    accountDone: "/23_account-done",
    accountList: "/24_account-list",
    accountListDetail: "/25_account-list-detail",
    accountListDone: "/26_account-list-done",
    taxInput: "/31_taxInput",
    taxConfirm: "/32_taxConfirm",
    taxDone: "/33_taxDone",
    taxList: "/34_taxList",
    taxListDetail: "/35_taxListDetail",
    taxListDone: "/36_taxListDone",
    subsidyInput: "/41_subsidyInput",
    subsidyConfirm: "/42_subsidyConfirm",
    subsidyDone: "/43_subsidyDone",
    subsidyList: "/44_subsidyList",
    subsidyListDetail: "/45_subsidyListDetail",
    subsidyListDone: "/46_subsidyListDone",
    taxListAccepted: "/51_taxListAccepted",
    taxListRevoked: "/52_taxListRevoked",
    VCList: "/61_VCList",
    VCInquiry: "/62_VCInquiry",
    applicationList: "/71_applicationList",
    applicationListDetail: "/72_applicationListDetail",
    residentVCList: "/81_residentVCList",
    residentVCListDetail: "/82_residentVCListDetail",
    residentVCListDone: "/83_residentVCListDone",
    accountVCList: "/91_accountVCList",
    accountVCListDetail: "/92_accountVCListDetail",
    accountVCListDone: "/93_accountVCListDone",
    taxVCList: "/101_taxVCList",
    taxVCListDetail: "/102_taxVCListDetail",
    taxVCListDone: "/103_taxVCListDone",
    subsidyVCList: "/111_subsidyVCList",
    subsidyVCListDetail: "/112_subsidyVCListDetail",
    subsidyVCListDone: "/113_subsidyVCListDone"
} as const;

export const icons = {
    applier: "/applier-icon.svg",
    resident: "/resident-icon.svg",
    account: "/account-icon.svg",
    tax: "/tax-icon.svg",
    subsidy: "/subsidy-icon.svg"
} as const;

export const msg = {
    applierMenu: "申請者メニュー",
    residentMenu: "自治体メニュー",
    accountMenu: "金融機関メニュー",
    taxMenu: "税務署メニュー",
    subsidyMenu: "申請先メニュー",
} as const;

export * from "./Form"
export * from "./inputForm"

