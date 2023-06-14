import 'react';

export type BackButtonParams = {
  url: string;
};

const BackButton = ({ url }: BackButtonParams) => {
  return (
    <a
      href={url}
      className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center"
    >
      Back
    </a>
  );
};

export default BackButton;
