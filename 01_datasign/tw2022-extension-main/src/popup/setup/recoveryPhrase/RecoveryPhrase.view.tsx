import React, {FunctionComponent} from "react";
import {Button, Header, CopyIcon} from "@/shared/components"
import "./recoveryPhrase.scss";

export interface RecoveryPhraseViewProps {
  onNext: () => void;
  onBack: () => void;
}

export const RecoveryPhraseView: FunctionComponent<RecoveryPhraseViewProps> = (props) => {
  const { onNext, onBack } = props;

  const phraseValues = ['grace', 'dog', 'squirrel', 'damage', 'horse', 'wild', 'spin', 'wrist', 'fun', 'almost', 'girl', 'cat'];
  const recoveryPhrase = phraseValues.join(' ');
  return (
    <>
      <Header title="リカバリーフレーズ" onBack={onBack} />
      <div className="content" >
        <div className="description">パスワードを忘れた場合や、ウォレットをインポートする際に用いるリカバリーフレーズです。以下の12単語をメモして安全な場所に保管してください。</div>
        <div className="phrase-container">
          {recoveryPhrase}
          <span className="copy"><CopyIcon value={recoveryPhrase} /></span>
        </div>
        <div className="bottom-container">
          <Button onClick={() => onNext()}>メモしました</Button>
        </div>
      </div>
    </>
  );
};
