import React, { useEffect, useState } from 'react';

interface GroundTableProps {
  onInputChange: (data: number) => void;
  value: number; // New prop for initial value

}

const GroundTable: React.FC<GroundTableProps> = ({ onInputChange, value }) => {
  const [inputValue, setInputValue] = useState(1);

  const handleChange = (e: { target: { value: any; }; }) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange(newValue); // This will update the state in the parent component
  };

  useEffect(() => {
    setInputValue(value); // Update local state when prop changes
  }, [value]);


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-center text-[18px] font-light">
        <thead className="border-b bg-neutral-800 font-medium text-white">
          <tr>
            <th className="border-r px-6 py-4">対象箇所</th>
            <th className="border-r px-6 py-4">接地種別</th>
            <th className="border-r px-6 py-4">判定基準</th>
            <th className="border-r px-6 py-4">測定値</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r px-6 py-4">単独接地</td>
            <td className="border-r px-6 py-4">C種またはD種</td>
            <td className="border-r px-6 py-4">10Ω以下(C種)または100Ω以下(D種)</td>
            <td className="border-r px-6 py-4">
              <input
                type="number"
                value={inputValue}
                onChange={handleChange}
                className="p-1 border w-full"
                placeholder="数値入力"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GroundTable;
