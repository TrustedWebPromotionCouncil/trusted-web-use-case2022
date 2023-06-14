import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-500 text-center">
        Trusted Web Subsidy
      </h1>
      <div className="border-2 border-blue-500 rounded-full p-2 w-1/4 text-center hover:bg-blue-400 hover:text-white">
        <a href="./simple-demo2">Simple Demo</a>
      </div>
      <div className="border-2 border-blue-500 rounded-full p-2 w-1/4 text-center hover:bg-blue-400 hover:text-white">
        <a href="./00_menu">Mock App</a>
      </div>
    </div>
  );
};

export default Home;
