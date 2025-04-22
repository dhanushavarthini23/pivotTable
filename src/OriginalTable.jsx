import React from 'react';

const OriginalTable = ({ data }) => (
  <div>
    <h3>Original CSV Data</h3>
    <table>
      <thead>
        <tr>{data[0].map((head, i) => <th key={i}>{head}</th>)}</tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OriginalTable;
