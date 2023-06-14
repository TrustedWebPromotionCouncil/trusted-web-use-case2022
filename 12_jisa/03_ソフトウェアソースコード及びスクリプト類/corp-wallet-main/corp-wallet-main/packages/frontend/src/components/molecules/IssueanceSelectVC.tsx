import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React from "react";

import { getVCsByType, StoredVC } from "../../lib/repository/vc";
import { translateText } from "../../lib/translate/translateText";
import { Manifest, RequiredPresentation } from "../../types";
//import { Card } from "../cardComponents/Card";
import { CredentialCard } from "../molecules/CredentialCard";

export interface SelectVCProps {
  manifest: Manifest;
  presentationVCIDs: string[];
  setPresentationVCIDs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SelectVC: React.FC<SelectVCProps> = ({ manifest, presentationVCIDs, setPresentationVCIDs }) => {
  //TODO: 提示可能な個数のみ選択できるようにする

  return (
    <>
      {manifest.input.attestations.presentations != undefined ? (
        <>
          <Divider />
          <Box marginTop={8} marginBottom={3}>
            <Text>あなたが提示する証明書</Text>
          </Box>
        </>
      ) : (
        <></>
      )}
      <Box marginBottom={3}>
        <Stack spacing={4}>
          {manifest.input.attestations.presentations != undefined ? (
            manifest.input.attestations.presentations.map((requiredVC) => {
              return (
                <div key={requiredVC.id}>
                  <SelectiveVC
                    presentationVCIDs={presentationVCIDs}
                    setPresentationVCIDs={setPresentationVCIDs}
                    requiredVC={requiredVC}
                  />
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Stack>
      </Box>
    </>
  );
};

interface SelectiveVCProps {
  requiredVC: RequiredPresentation;
  presentationVCIDs: string[];
  setPresentationVCIDs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SelectiveVC: React.FC<SelectiveVCProps> = ({ presentationVCIDs, setPresentationVCIDs, requiredVC }) => {
  const [selectiveVC, setSelectiveVC] = React.useState<StoredVC[]>([]);
  const [vc, setVC] = React.useState<StoredVC>();

  React.useEffect(() => {
    (async () => {
      setSelectiveVC(await getVCsByType(requiredVC.credentialType));
    })();
  }, [requiredVC.credentialType]);

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
      <Select placeholder="証明書を選択してください" options={options} onChange={(e: any) => hundleClick(e.value)} />
      {vc ? (
        <Box marginY={3}>
          {
            //TODO: カードを表示するかは要検討
            // <Card storedVC={vc} />
          }
          <CredentialCard storedVC={vc} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
