
import { Select, Option, Card, Text, Checkbox } from "@nextui-org/react";


export const SelectOpr = ({id, key, onChange}) => {
    return (
        <select id={id} data-key={key} onChange={onChange}>
            <option value="">Reveal</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
        </select>
    );
};

export const CheckField = ({fx, name, c}) => {
    return (
        <Checkbox id={name} name={name} ref={c} onChange={fx}>{name}</Checkbox>
    );
};