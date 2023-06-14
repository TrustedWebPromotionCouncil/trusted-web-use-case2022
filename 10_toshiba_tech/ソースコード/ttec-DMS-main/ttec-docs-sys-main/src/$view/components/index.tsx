import { GetServerSideProps, NextPage } from 'next'

interface T {}

const HomePage: NextPage<T> = () => {
    return (
        <div>
            test
        </div>
    )
}

export default HomePage