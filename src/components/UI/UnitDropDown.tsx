import React from 'react';

type UnitDropdownProps = {
    value: string;
    onChange: (value: string) => void;
};

const UnitDropdown: React.FC<UnitDropdownProps> = ({ value, onChange }) => {
    return (
        <select
            className="bg-white border border-gray-300 rounded-md text-gray-700 h-10 px-1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="kVA">kVA</option>
            <option value="A">A</option>
        </select>
    );
};

export default UnitDropdown;
