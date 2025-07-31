import React from "react";
import GaugeChart from "react-gauge-chart";

type Props = {
  score: number; // from 0 to 100
};

export const GaugeChartScore: React.FC<Props> = ({ score }) => {
  // react-gauge-chart expects a 0-1 fraction
  const percent = Math.min(Math.max(score / 100, 0), 1);

  return (
    <GaugeChart
      id="compliance-gauge"
      nrOfLevels={20}
      percent={percent}
      textColor="#333"
      needleColor="#464A4F"
      needleBaseColor="#464A4F"

      colors={['#EA4228', '#F5CD19', '#5BE12C']}
      formatTextValue={() => `${score}%`}
    />
  );
};
