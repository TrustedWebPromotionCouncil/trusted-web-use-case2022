import React from "react";

import { StoredVC } from "../../lib/repository/vc";
import { PlainCard } from "./PlainCard";
import { SampleCustomCard } from "./SampleCustomCard";

export interface CardProps {
  storedVC: StoredVC;
}

export const Card: React.FC<CardProps> = ({ storedVC }) => {
  const renderSwitch = () => {
    switch (storedVC.manifest.id) {
      case "sclvcdev02":
        return <SampleCustomCard storedVC={storedVC} />;
      default:
        return <PlainCard storedVC={storedVC} />;
    }
  };
  return <>{renderSwitch()}</>;
};
