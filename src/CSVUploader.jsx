import React from 'react';

const CSVUploader = ({ setCsvData }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const parsed = data
        .trim()
        .split('\n')
        .map(row => row.split(',').map(cell => cell.trim()));
      setCsvData(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleUpload} />
    </div>
  );
};

export default CSVUploader;
