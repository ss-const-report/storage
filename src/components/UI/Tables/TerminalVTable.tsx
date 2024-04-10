import React, { useEffect, useState } from 'react';
import { TerminalVTableData } from '../../table.type';

interface TerminalVTableProps {
    onDataChange: (data: TerminalVTableData) => void;
    data: TerminalVTableData | undefined;

}

const InitialTerminalValue: TerminalVTableData = {
    terminalIndependentUO: 1,
    terminalIndependentOW: 1,
    terminalIndependentUW: 1,
    terminalDependentUO: 1,
    terminalDependentOW: 1,
    terminalDependentUW: 1,
}


const TerminalVTable: React.FC<TerminalVTableProps> = ({ onDataChange, data }) => {
    const [inputValues, setInputValues] = useState<TerminalVTableData | undefined>(InitialTerminalValue);

    const handleInputChange = (name: string, value: string | undefined) => {

        const newValue = (value) ?? undefined; // Parse the string to a number, default to 0 if NaN
        const newInputValues = { ...inputValues, [name]: newValue };
        setInputValues(newInputValues);
        onDataChange(newInputValues); // Update parent component's state
    };

    useEffect(() => {
        setInputValues(data); // Update local state when prop changes
    }, [data]);


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border text-center text-[18px] font-light">
                <thead className="border-b bg-neutral-800 font-medium text-white">
                    <tr>
                        <th colSpan={8} className="border border-gray-300 px-6 py-4">※判定基準：U-O(N)、W-O(N)間101±6V U-W(N)間202±20V</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={3} className="border border-gray-300 px-6 py-4">自立</td>
                        <td className="border border-gray-300 px-6 py-4">U-O間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalIndependentUO}
                                onChange={(e) => handleInputChange('terminalIndependentUO', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                        <td rowSpan={3} className="border border-gray-300 px-6 py-4">連系</td>
                        <td className="border border-gray-300 px-6 py-4">U-O間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalDependentUO}
                                onChange={(e) => handleInputChange('terminalDependentUO', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                    </tr>

                    <tr>
                        <td className="border border-gray-300 px-6 py-4">O-W間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalIndependentOW}
                                onChange={(e) => handleInputChange('terminalIndependentOW', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                        <td className="border border-gray-300 px-6 py-4">O-W間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalDependentOW}
                                onChange={(e) => handleInputChange('terminalDependentOW', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                    </tr>

                    <tr>
                        <td className="border border-gray-300 px-6 py-4">U-W間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalIndependentUW}
                                onChange={(e) => handleInputChange('terminalIndependentUW', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                        <td className="border border-gray-300 px-6 py-4">U-W間</td>
                        <td className="border border-gray-300 px-6 py-4">
                            <input
                                type="number"
                                value={inputValues?.terminalDependentUW}
                                onChange={(e) => handleInputChange('terminalDependentUW', e.target.value)}
                                className="p-1 border w-full"
                                placeholder="数値入力"
                            />
                        </td>
                        <td className="border border-gray-300 px-6 py-4">V</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};

export default TerminalVTable;
