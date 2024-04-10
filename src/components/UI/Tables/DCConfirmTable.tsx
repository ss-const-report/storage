import React, { useState } from 'react';

import { DCTableData } from '../../table.type';

interface DCConfirmTableProps {
  data: DCTableData;
  onDataChange: (data: DCTableData) => void;
}

const DCConfirmTable: React.FC<DCConfirmTableProps> = ({ data, onDataChange }) => {
  // Using the passed 'data' prop as the initial state
  const [tableData, setTableData] = useState<DCTableData>(data);

  const handleInputChange = (row: keyof DCTableData, index: number, value: string | number | boolean, inputType: string) => {
    let updatedValues = [...tableData[row]];
    updatedValues[index] = value;

    // Check if any of PV1, PV2, PV3 is filled
    let isAnyPvFilled;
    if (inputType == 'text')
      isAnyPvFilled = index !== 3 && (updatedValues[0] != '' || updatedValues[1] != '' || updatedValues[2] != '');
    else if (inputType == 'number')
      isAnyPvFilled = index !== 3 && (updatedValues[0] != 0 || updatedValues[1] != 0 || updatedValues[2] != 0);
    else if (inputType == 'checkbox')
      isAnyPvFilled = index !== 1 && (updatedValues[0] != false);

    // Check if PV一括入力の場合 is filled
    const isPvBatchFilled = index === 3 && updatedValues[3] == '';

    // console.log(tableData[row], '      ', isAnyPvFilled);
    // Update other fields based on the above conditions
    if (isAnyPvFilled) {
      // Disable PV一括入力の場合 (index 3)
      if (inputType == 'text')
        updatedValues[3] = '';
      else if (inputType == 'number')
        updatedValues[3] = 0;
      else if (inputType == 'checkbox')
        updatedValues[1] = false;
    } else if (isPvBatchFilled) {
      // Disable PV1, PV2, PV3 (indexes 0, 1, 2)
      if (inputType == 'text')
        updatedValues = updatedValues.map((val, idx) => (idx < 3 ? '' : val));
      else if (inputType == 'number')
        updatedValues = updatedValues.map((val, idx) => (idx < 3 ? 0 : val));
      else if (inputType == 'checkbox')
        updatedValues = updatedValues.map((val, idx) => (idx < 1 ? false : val));
    }

    const updatedData = { ...tableData, [row]: updatedValues };
    setTableData(updatedData);
    onDataChange(updatedData);
  };


  const labelMap: { [key in keyof DCTableData]: string } = {
    maker: "メーカー",
    format: "型式",
    serialNumber: "直列数",
    parallelNumber: "並列数",
    hasConnection: "接続箱の有無",
    voltage: "ストリング開放電圧実測値（０V～450V迄）",
  };

  const renderInputField = (row: keyof DCTableData, value: any, colIndex: number) => {
    // Disable logic
    // Determine the input type based on the row
    let inputType = 'text';
    if (row === 'serialNumber' || row === 'parallelNumber' || row === 'voltage') {
      inputType = 'number';
    } else if (row === 'hasConnection') {
      inputType = 'checkbox';
    }
    let disableInput;
    if (inputType == 'text')
      disableInput = (colIndex < 3 && !!tableData[row][3]) || (colIndex === 3 && !!tableData[row].slice(0, 3).some(v => v != ''));
    else if (inputType == 'number')
      disableInput = (colIndex < 3 && !!tableData[row][3]) || (colIndex === 3 && !!tableData[row].slice(0, 3).some(v => v != 0));
    else if (inputType == 'checkbox')
      disableInput = (colIndex < 1 && !!tableData[row][1]) || (colIndex === 1 && !!tableData[row].slice(0, 1).some(v => v != false));
    // Render the appropriate input field
    console.log(tableData[row]);
    return (
      <input
        type={inputType}
        value={inputType !== 'checkbox' ? value : undefined}
        checked={inputType === 'checkbox' ? value : undefined}
        onChange={(e) => handleInputChange(row, colIndex, inputType === 'checkbox' ? e.target.checked : e.target.value, inputType)}
        disabled={disableInput}
        className="border p-1 w-full"
      />
    );
  };



  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-center text-[18px] font-light ">
        <thead className="border-b bg-neutral-800 font-medium text-white ">
          <tr>
            <th className="border-r px-6 py-4">回路（ハイブリッドPCSへの入力）</th>
            <th className="border-r px-6 py-4">PV1</th>
            <th className="border-r px-6 py-4">PV2</th>
            <th className="border-r px-6 py-4">PV3</th>
            <th className="border-r px-6 py-4">PV一括入力の場合</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tableData).map(([row, values]) => (
            <tr key={row} className="text-center border-b">
              <td className={`border-r px-1 py-1 ${row}`}>{labelMap[row as keyof DCTableData]}</td>
              {values.map((value: any, colIndex: any) => {
                if (row == 'hasConnection') {
                  if (colIndex == 0) {
                    return <td key={colIndex} className="border-r px-1 py-1" colSpan={3}>
                      {renderInputField(row as keyof DCTableData, value, colIndex)}
                    </td>
                  } else {
                    return <td key={colIndex} className="border-r px-1 py-1">
                      {renderInputField(row as keyof DCTableData, value, colIndex)}
                    </td>
                  }
                } else {
                  return <td key={colIndex} className="border-r px-1 py-1">
                    {renderInputField(row as keyof DCTableData, value, colIndex)}
                  </td>
                }
              }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DCConfirmTable;
