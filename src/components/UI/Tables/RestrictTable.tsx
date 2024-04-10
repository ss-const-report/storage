import React, { useEffect, useState } from 'react';

import { RestrictTableData } from '../../table.type';



interface RestrictTableProps {
  onDataChange: (data: RestrictTableData) => void;
  data: RestrictTableData | undefined;
}

 const InitialRestrictValue: RestrictTableData =  {
  conditionerIndependentUO: 1,
  conditionerIndependentOW: 1,
  conditionerIndependentUW: 1,
  conditionerDependentUO: 1,
  conditionerDependentOW: 1,
  conditionerDependentUW: 1,
  conditionerPM: 1,
  conditionerPE: 1,
  conditionerME: 1,
}

const RestrictTable: React.FC<RestrictTableProps> = ({ onDataChange, data }) => {
  const [inputValues, setInputValues] = useState<RestrictTableData | undefined>(InitialRestrictValue);

  useEffect(() => {
    setInputValues(data); // Update local state when prop changes
  }, [data]);
  
  const handleInputChange = (name:string, value:string | undefined) => {

    const newValue = (value) ?? undefined; // Parse the string to a number, default to 0 if NaN
    const newInputValues = { ...inputValues, [name]: newValue };
    setInputValues(newInputValues);
    onDataChange(newInputValues); // Update parent component's state
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-center text-[18px] font-light">
        <thead className="border-b bg-neutral-800 font-medium text-white">
          <tr>
            <th colSpan={2} className="border-r px-6 py-4">対象場所</th>
            <th className="border px-6 py-4">検査対象</th>
            <th className=" w-[20%] border px-6 py-4">判定基準</th>
            <th className="border px-6 py-4">測定値</th>
          </tr>
        </thead>
        <tbody className="border px-1 py-1">
          <tr className="border px-1 py-1">
            <td rowSpan={6} className="border-r px-1 py-1"><p className='break-words'>
              パワーコンディショナ～スイッチボックス-H</p>
            </td>
            <td rowSpan={3} className="border px-1 py-1">自立</td>
            <td className="border px-1 py-1">U-O間</td>
            <td rowSpan={9} className=" w-[20%] border-r px-1 py-1"><p className=' break-words'>
              印加電圧 DC500V 0.2MΩ以上 (電気設備技術基準58条)</p>
            </td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerIndependentUO}
              onChange={(e) => handleInputChange('conditionerIndependentUO', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td className="border px-1 py-1">O-W間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerIndependentOW}
              onChange={(e) => handleInputChange('conditionerIndependentOW', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td className="border px-1 py-1">U-W間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerIndependentUW}
              onChange={(e) => handleInputChange('conditionerIndependentUW', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td rowSpan={3} className="border-r px-1 py-1">連系</td>
            <td className="border px-1 py-1">U-O間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerDependentUO}
              onChange={(e) => handleInputChange('conditionerDependentUO', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">

            <td className="border px-1 py-1">O-W間</td>

            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerDependentOW}
              onChange={(e) => handleInputChange('conditionerDependentOW', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">

            <td className="border px-1 py-1">U-W間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerDependentUW}
              onChange={(e) => handleInputChange('conditionerDependentUW', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td rowSpan={3} colSpan={2} className="border-r px-1 py-1">パワーコンディショナ～蓄電池</td>
            <td className="border px-1 py-1">(+)-(-)間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerPM}
              onChange={(e) => handleInputChange('conditionerPM', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td className="border px-1 py-1" >(+)-(E)間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerPE}
              onChange={(e) => handleInputChange('conditionerPE', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
          <tr className="border px-1 py-1">
            <td className="border px-1 py-1">(-)-(E)間</td>
            <td className="border px-1 py-1"><input
              type="number"
              value={inputValues?.conditionerME}
              onChange={(e) => handleInputChange('conditionerME', e.target.value)}
              className="p-1 border w-full"
              placeholder="数値入力"
            />
            </td>
          </tr>
        </tbody>
      </table>
    </div >
  );
};

export default RestrictTable;
