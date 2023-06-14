import React, { FunctionComponent } from "react";
import { Button, Header, CopyIcon } from "@/shared/components";
import { getSetting } from "@/utils/dataStore";
import "./createVC.scss";

export interface CreateVCViewProps {
  onNext: () => void;
  onBack: () => void;
}

export const CreateVCView: FunctionComponent<CreateVCViewProps> = (props) => {
  const { onNext, onBack } = props;
  const openRecaptcha = async () => {
    const setting = await getSetting();
    const { reCaptchaSiteHost } = setting;
    window.open(`${reCaptchaSiteHost}/review/re-captcha`);
  };

  return (
    <>
      <Header title="非ボット証明" onBack={onBack} />
      <div className="content">
        <div className="description">
          ボットによる不正を防ぐため、あなたが人間であることの証明書（Verifiable
          Credential）を作成します。
        </div>
        <div className="description">
          この証明書を提示することで、あなたがボットではないことを証明できます。
        </div>
        <form className="form">
          <input
            type="button"
            className="btn btn-link"
            value="open reCAPTCHA"
            onClick={openRecaptcha}
          />
          <div className="bottom-container">
            <Button onClick={() => onNext()}>次へ</Button>
          </div>
        </form>
      </div>
    </>
  );
};
