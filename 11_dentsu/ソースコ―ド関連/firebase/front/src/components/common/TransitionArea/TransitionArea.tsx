import { ReactNode } from "react";

export type TransitionAreaParams = {
    children: ReactNode;
};

const TransitionArea = ({ children }: TransitionAreaParams) => {
    return (
        <div className={"mx-auto mt-14 flex w-70"}>
            {children}
        </div>
    )
};

export default TransitionArea;