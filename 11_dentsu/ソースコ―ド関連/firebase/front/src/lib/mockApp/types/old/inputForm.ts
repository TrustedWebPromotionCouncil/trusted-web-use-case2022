export type ResidentInputFormType = {
  id: number; // 仮のキー（申請日時-UNIX TIME）
  fullName: string; // 氏名
  fullNameFurigana: string; // 氏名フリガナ
  address: string; // 住所
  addressRegistDate: string; // 住民となった年月
  addressRegistYear: string; // 住民となった年
  addressRegistMonth: string; // 住民となった年
  permanentAddress: string; // 本籍地
  applicationDate?: string; // 申請日
  verifyStatus?: boolean; // 検証ステータス
  approvalStatus?: boolean; // 承認ステータス
  issueDate?: string 
};

export type AccountInputFormType = {
  id: number; // 仮のキー（申請日時-UNIX TIME）
  bankCode: string; // 金融機関コード
  branchNumber: string; // 支店番号
  accountNumber: string; // 口座番号
  corporateName: string; // 法人名称
  applicantName: string; // 申請者名
  applicantAddress: string; // 申請住所
  applicationDate?: string; // 申請日
  verifyStatus?: boolean; // 検証ステータス
  approvalStatus?: boolean; // 承認ステータス
  issueDate?: string 
};
