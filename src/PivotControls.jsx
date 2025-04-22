import React, { useState } from 'react';
import { groupDate } from './PivotTable'; // Make sure the path is correct

const isDateColumn = (sample) => !isNaN(Date.parse(sample));

const aggregateFunctions = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'MEDIAN'];
const dateGroupingOptions = ['raw', 'year', 'quarter', 'month'];

const PivotControls = ({ data, setPivotData }) => {
  const headers = data[0];
  const [rowField, setRowField] = useState('');
  const [columnField, setColumnField] = useState('');
  const [measures, setMeasures] = useState([{ field: '', aggregation: 'SUM' }]);
  const [dateGroupings, setDateGroupings] = useState({ row: 'raw', column: 'raw' });

  const handleMeasureChange = (index, key, value) => {
    const updated = [...measures];
    updated[index][key] = value;
    setMeasures(updated);
  };

  const addMeasure = () => {
    setMeasures([...measures, { field: '', aggregation: 'SUM' }]);
  };

  const removeMeasure = (index) => {
    const updated = measures.filter((_, i) => i !== index);
    setMeasures(updated);
  };

  const generatePivot = () => {
    const rowIndex = rowField ? headers.indexOf(rowField) : -1;
    const columnIndex = columnField ? headers.indexOf(columnField) : -1;
    const sampleRow = data[1] || [];

    const rowIsDate = isDateColumn(sampleRow[rowIndex]);
    const colIsDate = isDateColumn(sampleRow[columnIndex]);

    const measureIndices = measures.map(({ field }) => ({
      field,
      index: headers.indexOf(field),
    }));

    const pivot = {};
    const allColumns = new Set();
    const grandTotals = {};

    data.slice(1).forEach((row) => {
      const rowRaw = rowIndex !== -1 ? row[rowIndex] : 'All';
      const colRaw = columnIndex !== -1 ? row[columnIndex] : 'All';

      const rowVal =
        rowIsDate && dateGroupings.row !== 'raw'
          ? groupDate(rowRaw, dateGroupings.row[0].toUpperCase())
          : rowRaw;

      const colVal =
        colIsDate && dateGroupings.column !== 'raw'
          ? groupDate(colRaw, dateGroupings.column[0].toUpperCase())
          : colRaw;

      allColumns.add(colVal);
      if (!pivot[rowVal]) pivot[rowVal] = {};
      if (!pivot[rowVal][colVal]) pivot[rowVal][colVal] = {};

      measures.forEach(({ field }, i) => {
        const { index } = measureIndices[i];
        const raw = index !== -1 ? row[index] : '1';
        const val = parseFloat(raw);

        if (!isNaN(val)) {
          if (!pivot[rowVal][colVal][field]) pivot[rowVal][colVal][field] = [];
          pivot[rowVal][colVal][field].push(val);

          if (!grandTotals[field]) grandTotals[field] = {};
          if (!grandTotals[field][colVal]) grandTotals[field][colVal] = [];
          grandTotals[field][colVal].push(val);

          if (!grandTotals[field][rowVal]) grandTotals[field][rowVal] = [];
          grandTotals[field][rowVal].push(val);

          if (!grandTotals[field]['__all__']) grandTotals[field]['__all__'] = [];
          grandTotals[field]['__all__'].push(val);
        }
      });
    });

    setPivotData({
      rowField,
      columnField,
      columnValues: Array.from(allColumns).sort(),
      measures,
      pivot,
      grandTotals,
    });
  };

  return (
    <div>
      <h3>Pivot Table Controls</h3>

      <label>Row:</label>
      <select value={rowField} onChange={(e) => setRowField(e.target.value)}>
        <option value="">None</option>
        {headers.map((header) => (
          <option key={header} value={header}>{header}</option>
        ))}
      </select>

      {rowField && isDateColumn(data[1][headers.indexOf(rowField)]) && (
        <select value={dateGroupings.row} onChange={(e) =>
          setDateGroupings(prev => ({ ...prev, row: e.target.value }))}>
          {dateGroupingOptions.map(opt => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      )}

      <br />

      <label>Column:</label>
      <select value={columnField} onChange={(e) => setColumnField(e.target.value)}>
        <option value="">None</option>
        {headers.map((header) => (
          <option key={header} value={header}>{header}</option>
        ))}
      </select>

      {columnField && isDateColumn(data[1][headers.indexOf(columnField)]) && (
        <select value={dateGroupings.column} onChange={(e) =>
          setDateGroupings(prev => ({ ...prev, column: e.target.value }))}>
          {dateGroupingOptions.map(opt => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      )}

      <div style={{ marginTop: '1rem' }}>
        <strong>Measures:</strong>
        {measures.map((measure, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <select
              value={measure.field}
              onChange={(e) => handleMeasureChange(index, 'field', e.target.value)}
            >
              <option value="">Select Field</option>
              {headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>

            <select
              value={measure.aggregation}
              onChange={(e) => handleMeasureChange(index, 'aggregation', e.target.value)}
            >
              {aggregateFunctions.map((func) => (
                <option key={func} value={func}>{func}</option>
              ))}
            </select>

            {measures.length > 1 && (
              <button onClick={() => removeMeasure(index)}>❌</button>
            )}
          </div>
        ))}

        <button onClick={addMeasure}>➕ Add Measure</button>
      </div>

      <button onClick={generatePivot} style={{ marginTop: '1rem' }}>
        Generate Pivot Table
      </button>
    </div>
  );
};

export default PivotControls;
