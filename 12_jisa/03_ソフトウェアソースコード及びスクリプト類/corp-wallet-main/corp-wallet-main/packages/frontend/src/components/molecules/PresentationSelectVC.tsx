import { Box } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React from "react";

import { getVCsByType, StoredVC } from "../../lib/repository/vc";
import { translateText } from "../../lib/translate/translateText";
import { VCRequest } from "../../types";
import { CredentialCard } from "../molecules/CredentialCard";

export interface SelectVCProps {
  vcRequest: VCRequest;
  presentationVCIDs: string[];
  setPresentationVCIDs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SelectVC: React.FC<SelectVCProps> = ({ vcRequest, presentationVCIDs, setPresentationVCIDs }) => {
  //TODO: 提示可能な個数のみ選択できるようにする

  return (
    <>
      {vcRequest.claims.vp_token.presentation_definition.input_descriptors.map((requiredVC) => {
        return (
          <div key={requiredVC.id}>
            <SelectiveVC
              presentationVCIDs={presentationVCIDs}
              setPresentationVCIDs={setPresentationVCIDs}
              requiredVCID={requiredVC.id}
            />
          </div>
        );
      })}
    </>
  );
};

interface SelectiveVCProps {
  requiredVCID: string;
  presentationVCIDs: string[];
  setPresentationVCIDs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SelectiveVC: React.FC<SelectiveVCProps> = ({ presentationVCIDs, setPresentationVCIDs, requiredVCID }) => {
  const [selectiveVC, setSelectiveVC] = React.useState<StoredVC[]>([]);
  const [vc, setVC] = React.useState<StoredVC>();

  React.useEffect(() => {
    (async () => {
      //TODO: トランザクションIDでフィルタリングすることもできそう要検討
      setSelectiveVC(await getVCsByType(requiredVCID));
    })();
  }, [requiredVCID]);

  // typeに当てはまるVCを抽出
  const hundleClick = (targetVC: StoredVC) => {
    if (vc) {
      // すでに選択されている場合は選択解除し，新しく追加
      setPresentationVCIDs([...presentationVCIDs.filter((id) => id !== vc.credentialID), targetVC.credentialID]);
    } else {
      setPresentationVCIDs([...presentationVCIDs, targetVC.credentialID]);
    }
    setVC(targetVC);
  };

  const options = selectiveVC.map((vc) => {
    return {
      value: vc,
      label: translateText(vc.manifest.display.card.title) + " - " + translateText(vc.manifest.display.card.issuedBy),
    };
  });

  return (
    <>
      <Box marginBottom={3}>
        <Select placeholder="証明書を選択してください" options={options} onChange={(e: any) => hundleClick(e.value)} />
      </Box>
      {vc ? (
        <Box marginY={4}>
          {
            //TODO: カードを表示するかは要検討
          }
          <CredentialCard storedVC={vc} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
