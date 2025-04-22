import React from 'react';

export const groupDate = (dateString, level) => {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;

  if (level === 'Y') return year;
  if (level === 'Q') return `Q${quarter} ${year}`;
  if (level === 'M') return `${month + 1}/${year}`;
  return dateString;
};

const calculate = (values, type) => {
  if (!values.length) return '0';

  switch (type) {
    case 'SUM':
      return values.reduce((a, b) => a + b, 0).toFixed(2);
    case 'COUNT':
      return values.length;
    case 'AVG':
      return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    case 'MIN':
      return Math.min(...values).toFixed(2);
    case 'MAX':
      return Math.max(...values).toFixed(2);
    case 'MEDIAN':
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return (sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid]
      ).toFixed(2);
    default:
      return '0';
  }
};

const PivotTable = ({ pivot }) => {
  const { rowField, columnField, columnValues, measures, pivot: data, grandTotals } = pivot;

  return (
    <div>
      <h3>Pivot Table</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>{rowField || 'Row'}</th>
            {columnValues.map((col) =>
              measures.map(({ field, aggregation }) => (
                <th key={`${col}-${field}-${aggregation}`}>
                  {col}
                  <br />
                  {field} ({aggregation})
                </th>
              ))
            )}
            {measures.map(({ field, aggregation }) => (
              <th key={`grand-${field}-${aggregation}`}>
                Grand Total
                <br />
                {field} ({aggregation})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([row, cols]) => (
            <tr key={row}>
              <td>{row}</td>
              {columnValues.map((col) =>
                measures.map(({ field, aggregation }) => {
                  const values = (cols[col] && cols[col][field]) || [];
                  return (
                    <td key={`${row}-${col}-${field}-${aggregation}`}>
                      {calculate(values, aggregation)}
                    </td>
                  );
                })
              )}
              {measures.map(({ field, aggregation }) => {
                const values = grandTotals[field]?.[row] || [];
                return (
                  <td key={`grand-${row}-${field}-${aggregation}`}>
                    <strong>{calculate(values, aggregation)}</strong>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th>Grand Total</th>
            {columnValues.map((col) =>
              measures.map(({ field, aggregation }) => {
                const values = grandTotals[field]?.[col] || [];
                return (
                  <td key={`gt-${col}-${field}-${aggregation}`}>
                    <strong>{calculate(values, aggregation)}</strong>
                  </td>
                );
              })
            )}
            {measures.map(({ field, aggregation }) => {
              const values = grandTotals[field]?.['__all__'] || [];
              return (
                <td key={`gt-grand-${field}-${aggregation}`}>
                  <strong>{calculate(values, aggregation)}</strong>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PivotTable;
