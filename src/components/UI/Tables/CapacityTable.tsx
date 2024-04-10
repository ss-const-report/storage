import React, { useEffect, useState } from 'react';

interface CapacityTableProps {
  onInputChange: (data: number) => void;
  value: number; // New prop for initial value

}

const CapacityTable: React.FC<CapacityTableProps> = ({ onInputChange, value }) => {
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
        <tbody>
          <tr>
            <td className="border-2 border-gray-400 px-6 py-4 ">お客様の契約アンペア容量</td>
            <td className="border-2 border-gray-400 px-6 py-4 ">
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

export default CapacityTable;
