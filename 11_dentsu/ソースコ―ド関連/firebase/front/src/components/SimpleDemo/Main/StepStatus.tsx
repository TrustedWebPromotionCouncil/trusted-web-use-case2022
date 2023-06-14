type SimpleStatusParams = {
  done: boolean;
};

const StepStatus = ({ done }: SimpleStatusParams) => {
  if (done) {
    return <span className="inline-block text-blue-500 text-center">Done</span>;
  }

  return <span className="inline-block text-red-500 text-center">Not Yet</span>;
};

export default StepStatus;
