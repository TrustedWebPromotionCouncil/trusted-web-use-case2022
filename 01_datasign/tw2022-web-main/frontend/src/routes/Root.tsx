import { Link, Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';

export const Root: FunctionComponent = () => {
  return (
    <>
      <div id="sidebar">
        <h1>認証機関コンソール</h1>
        <nav>
          <ul>
            <li>
              <Link to={'vc/list'}>発行済みOP一覧</Link>
            </li>
            <li>
              <Link to={'vc/new'}>新規OP発行</Link>
            </li>
            <li>
              <Link to={'vc/revoke'}>発行済みOP取り消し</Link>
            </li>
            <li>
              <Link to={"review/re-captcha"}>reCAPTCHA</Link>
            </li>
            <li>
              <Link to={'/'}>Go to top</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
