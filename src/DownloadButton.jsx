import React from 'react';

const DownloadButton = () => {
  const handleDownload = () => {
    const table = document.querySelector('#pivot-table');
    if (!table) return;

    let csv = '';
    table.querySelectorAll('tr').forEach(row => {
      const rowData = [];
      row.querySelectorAll('th, td').forEach(cell => {
        rowData.push(cell.textContent.trim());
      });
      csv += rowData.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pivot_table.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Download CSV</button>;
};

export default DownloadButton;
