const shortenString = (str: string, width = 6) => {
  if (str.length <= width * 2) {
    return str;
  }

  return `${str.slice(0, width)}...${str.slice(-width)}`;
};

export default shortenString;
