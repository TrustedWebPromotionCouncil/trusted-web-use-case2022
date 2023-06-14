import React, { FunctionComponent } from "react";

import { useStoreContext } from "@/Context";

import { Header, Menu } from "@/shared/components";

import "./menu.scss";

export interface MenuViewProps {
  goTo: (path: string) => void;
  onBack: () => void;
}

export const MenuView: FunctionComponent<MenuViewProps> = (props) => {
  const { state } = useStoreContext();
  const { password } = state;
  const { goTo, onBack } = props;
  return (
    <>
      <Header title={"メニュー"} onBack={onBack} />
      <div className="p-2">
        <section className="p-2">
          <div className="section-label border-bottom">サイト検証状況</div>
          <Menu
            label={"現在のサイト"}
            onClick={() => goTo("/verifyResultCurrent")}
          />
          <Menu
            label={"検証結果一覧"}
            onClick={() => goTo("/verifyResultList")}
          />
        </section>
        <section className="p-2">
          <div className="section-label border-bottom">
            パーソナルデータ管理
          </div>
          <Menu label={"非ボット"} onClick={() => goTo("/vcListNonBot")} />
          <Menu label={"ADID"} onClick={() => goTo("/vcListAdId")} />
          <Menu label={"メールアドレス"} onClick={() => goTo("/vcListEmail")} />
          {password && (
            <Menu label={"アクセス履歴"} onClick={() => goTo("/accessLog")} />
          )}
        </section>
        {password && (
          <section className="p-2">
            <div className="section-label border-bottom">設定</div>
            <Menu label={"Bunsin連携"} onClick={() => goTo("bunsinSetting")} />
            <Menu
              label={"広告識別子設定"}
              onClick={() => goTo("adidSetting")}
            />
            <Menu
              label={"リカバリーフレーズ表示"}
              onClick={() => goTo("recoveryPhrase")}
            />
            <Menu
              label={"検証OK時の提供設定"}
              onClick={() => goTo("offerSetting")}
            />
            <Menu label={"非ボットVC作成"} onClick={() => goTo("createVC")} />
            <Menu label={"DWN設定"} onClick={() => goTo("dwnSetting")} />
            <Menu label={"その他設定"} onClick={() => goTo("otherSetting")} />
          </section>
        )}
        {!password && (
          <section className="p-2">
            <div className="section-label border-bottom">設定</div>
            {!password && (
              <Menu
                label={"パスワード再入力"}
                onClick={() => goTo("reInputPassword")}
              />
            )}
            <Menu label={"その他設定"} onClick={() => goTo("otherSetting")} />
          </section>
        )}
      </div>
    </>
  );
};
