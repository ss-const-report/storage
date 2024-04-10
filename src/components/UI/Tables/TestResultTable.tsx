import React from 'react';

interface TableProps {
  rows: number;
  parameters: string[];
  points: string[];
  checkedState: boolean[];
  onCheckChange: (updatedCheckedState: boolean[]) => void;
}

const TestResultTable: React.FC<TableProps> = ({ rows, parameters, points, checkedState, onCheckChange }) => {


  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    onCheckChange(updatedCheckedState);
  };

  const tableRows = parameters.map((param, index) => (
    <tr key={index}>
      <td className="border  border-gray-400 px-5 py-1">{index + 1}</td>
      <td className=" w-[40%] border  border-gray-400 px-5 py-1 break-words">{param}</td>
      <td className="w-[50%]  border  border-gray-400 px-5 py-1 break-words">{points[index]}</td>
      <td className="w-[10%]  border  border-gray-400 px-5 py-1">
        <input
          type="checkbox"
          id={`custom-checkbox-${index}`}
          name={param}
          value={param}
          checked={checkedState[index]}
          onChange={() => handleOnChange(index)}
          className='w-[25px] h-[25px]'
        />
      </td>
    </tr>
  ));

  return (
    <table className="min-w-full border border-gray-400 text-center text-[18px] font-light">
      <thead className="border-b border-gray-400 bg-neutral-800 font-medium text-white">
        <tr className="border-b border-gray-400 bg-neutral-800 font-medium text-white">
          <th className="border-r  border-gray-400 px-6 py-4">No</th>
          <th className="w-[40%]  border-r  border-gray-400 px-6 py-4">チェック項目・内容</th>
          <th className="w-[50%]  border-r  border-gray-400 px-6 py-4">ポイント</th>
          <th className="w-[10%]  border-r  border-gray-400 px-6 py-4">チェック</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

export default TestResultTable;
