import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            permanent: true,
            destination: '/sign-in',
        },
    }
}

interface T {}

const HomePage: NextPage<T> = () => {
    return (<></>)
}

export default HomePage