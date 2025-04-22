import React, { useState, useEffect } from 'react'; // ⬅️ add useEffect
import CSVUploader from './CSVUploader';
import OriginalTable from './OriginalTable';
import PivotControls from './PivotControls';
import PivotTable from './PivotTable';
import DownloadButton from './DownloadButton';
import ClearButton from './ClearButton';
import DarkModeToggle from './DarkModeToggle'; 

import './App.css';

const App = () => {
  const [csvData, setCsvData] = useState([]);
  const [pivotData, setPivotData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle body class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="app">
      <h1>Pivot Table Generator</h1>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <CSVUploader setCsvData={setCsvData} />
      {csvData.length > 0 && (
        <>
          <OriginalTable data={csvData} />
          <PivotControls data={csvData} setPivotData={setPivotData} />
          {pivotData && <PivotTable pivot={pivotData} />}
          <DownloadButton pivot={pivotData} />
          <ClearButton setCsvData={setCsvData} setPivotData={setPivotData} />
        </>
      )}
    </div>
  );
};

export default App;
