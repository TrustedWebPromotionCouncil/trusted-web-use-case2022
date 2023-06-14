import { Path, FieldValues, useFormContext, RegisterOptions } from 'react-hook-form';

export type CheckBoxParams<T> = {
    name: Path<T>
    label: string;
    validation?: RegisterOptions;
    isEnabled?: boolean;
}

const CheckBox = <T extends FieldValues>({ name, label, validation = undefined, isEnabled = true }: CheckBoxParams<T>) => {
    const { register } = useFormContext();

    return (
        <>
            <span className={"text-sm inline-block"}>{label}</span>
            {isEnabled
                ? <input type="checkbox" className={"inline-block ml-auto scale-150 w-4"}
                    {...typeof validation === "undefined"
                        ? { ...register(name) }
                        : { ...register(name), validation }} />
                : <input type="checkbox" className={"inline-block ml-auto scale-150 w-4"} {...register(name)} disabled />
            }

        </>
    )

};

export default CheckBox;