import Link from 'next/link';
import QrScrannerModal from './QrScrannerModal';
import { Woollet } from '@data/woollet'


// icon //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faUser,
  faCoins,
  faComments,
  faGear,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';

const iconStyle = {
  height: '1em',
  color: '#131d54',
  margin: '12px',
  marginBottom: '-6px',
  paddingBottom: '4px',
};

export default function Menu({ title }) {

  const actionSignoff = e => {
    const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
    woollet.User.signoff().then(r=>{
      Router.push('/')
    })
  }

  return (
    <>
      <header
        className='row'
        style={{
          backgroundColor: '#131d54',
          padding: '16px',
          paddingBottom: 0,
          marginBottom: '20px',
          height: '100px',
        }}
      >
        <div className='page'>
          <div id='nav-container'>
            <div className='bg'></div>
            <div className='button' tabIndex='0'>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </div>
            <div id='nav-content' tabIndex='0'>
              <div className='nav-pills'>
                <ul className='nav'>
                  <li>
                    <div className='nav-link btn-profile'>
                      <Link href='/profile'>
                        <FontAwesomeIcon icon={faUser} style={iconStyle} />
                        Profile
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className='nav-link btn-messenger'>
                      <Link href='#' onClick={actionSignoff}>
                        <FontAwesomeIcon icon={faSignOut} style={iconStyle} />
                        Signoff
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div
                      className='nav-link btn-setting'
                      style={{ position: 'absolute', bottom: '3%' }}
                    >
                      <Link href='/setting'>
                        <FontAwesomeIcon icon={faGear} style={iconStyle} />
                        Setting
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='col-7' style={{display: 'grid'}}>
          <span className='title pt-2 mt-1'>{title}</span>
        </div>
        <div className='col-5 text-end'>
          <QrScrannerModal />
        </div>
      </header>
    </>
  );
}
