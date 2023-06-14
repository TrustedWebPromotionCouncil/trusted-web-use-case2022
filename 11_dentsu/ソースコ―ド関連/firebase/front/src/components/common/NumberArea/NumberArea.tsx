export type NumberAreaParams = {
    listCount: number;
    resultCount: number;
}

const NumberArea = ({ listCount, resultCount}: NumberAreaParams) => {
    return (
        <section className={"bg-color-search w-full h-11 text-center"}>
            <span className={"text-sm leading-11"}>{listCount}件中 - {resultCount}件を表示</span>
        </section>
    )
};

export default NumberArea;