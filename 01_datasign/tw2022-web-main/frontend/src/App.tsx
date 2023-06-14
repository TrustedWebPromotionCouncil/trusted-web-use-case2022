import React, {FunctionComponent} from 'react';
import {createBrowserRouter, RouterProvider, useLocation} from 'react-router-dom';

import './App.scss';
import Root from './routes/Root';
import ErrorPage from './ErrorPage';
import Revoke from './features/revoke/Revoke';
import List from './features/list/List';
import Issue from './features/issue/Issue';
import ReCaptchaView from "./ReCaptcha";

const ReCaptchaAuth: FunctionComponent = () => {
  return (
    <div>verification in progress...</div>
  );
};
const ReCaptchaComplete: FunctionComponent = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  return (
    <>
      <div>complete verification!!!</div>
      <div>result is {query.get('result')}</div>
    </>
  );
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'vc/list',
        element: <List />,
      },
      {
        path: 'vc/new',
        element: <Issue />,
      },
      {
        path: 'vc/revoke',
        element: <Revoke />,
      },
      {
        path: "review/re-captcha",
        element: <ReCaptchaView />,
      },
      {
        path: "review/re-captcha/auth",
        element: <ReCaptchaAuth />,
      },
      {
        path: "review/re-captcha/complete",
        element: <ReCaptchaComplete />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
