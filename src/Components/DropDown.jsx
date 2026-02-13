//Col 0-30
//Row 0-7
//Pos 0-21

export default function DropDown ({length, start =0, value, onChange }) {
    const options = Array.from({length}, (_, i) => i + start);

    return (
        <select value={value} onChange={e => onChange (Number(e.target.value))}>
            {options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}