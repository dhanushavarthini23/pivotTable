import React from 'react';

const ClearButton = ({ setCsvData, setPivotData }) => {
  return (
    <button onClick={() => {
      setCsvData([]);
      setPivotData(null);
    }}>
      Clear All
    </button>
  );
};

export default ClearButton;
