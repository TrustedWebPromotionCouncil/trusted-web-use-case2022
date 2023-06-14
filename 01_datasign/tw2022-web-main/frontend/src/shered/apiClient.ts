const handleResponse = async <T>(response: Response): Promise<T> => {
  const { status, statusText } = response;
  console.debug({ status, statusText });
  if (status >= 200 && status < 300) {
    if (status === 204) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return {} as T;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  } else if (status >= 300 && status < 400) {
    throw new Error('returned unexpected response.');
  } else if (status >= 400 && status < 500) {
    throw new Error(statusText);
  } else if (status >= 500) {
    throw new Error('internal server error occurred.');
  } else {
    throw new Error('unsupported status code returned.');
  }
};

const HOST = process.env.REACT_APP_VERIFIER_HOST != null ? process.env.REACT_APP_VERIFIER_HOST : '';

const get = async <T>(path: string): Promise<T> => {
  try {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const response = await fetch(`${HOST}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse<T>(response);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
const post = async <T>(path: string, payload: {}): Promise<T> => {
  try {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log('host_path', `${HOST}${path}`);
    const response = await fetch(`${HOST}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const Modules = { get, post };
export default Modules;
