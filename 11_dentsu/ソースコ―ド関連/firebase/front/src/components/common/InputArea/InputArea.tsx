import { Path, FieldValues, useFormContext, RegisterOptions } from 'react-hook-form';

export type InputAreaParams<T> = {
    name: Path<T>;
    label?: string;
    validation?: RegisterOptions;
    placeholder?: string;
    isEnabled?: boolean;
    isRequired?: boolean;
    size?: "small" | "large";
};

const InputArea = <T extends FieldValues>({ name, label, validation = undefined, placeholder, isEnabled = true, isRequired = false, size = "large" }: InputAreaParams<T>) => {
    const { register } = useFormContext();

    return (
        <div className={"mb-5 w-70 mx-auto"}>
            <label htmlFor="name" className={"block text-sm pb-4 text-left"}>{label} {isRequired ? <span className={"text-color-warnig"}>（必須）</span> : null}</label>
            <input type="text" id='name' placeholder={placeholder} disabled={!isEnabled}
                className={(size === "small" ? "w-1/2" : "w-full") + " h-10 rounded-md p-2 text-base " + (isEnabled ? "bg-white border border-color-gray" : "bg-color-disabled")}
                {...typeof validation === "undefined"
                    ? { ...register(name) }
                    : { ...register(name, validation) }} />
        </div>
    )
};

export default InputArea;