import Link from 'next/link';
import { useRouter } from 'next/router';

// icon //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faExchange } from '@fortawesome/free-solid-svg-icons';

//style //
import styles from '../styles/Menu.module.css';

export default function Footer() {

  const router = useRouter()
  
  const currentRoute = router.pathname;

  return (
    <>
      <footer>
        <div className='menu'>
          <div className='row'>
            <div
              className={
                currentRoute === '/home'
                  ? `col ${styles.btnContainerActive}`
                  : `col ${styles.btnContainer}`
              }
            >
              <Link
                href='/home'
                className={
                  currentRoute === '/home' ? styles.active : styles.nonActive
                }
              >
                {/* <button className='btn-menu menu-mywallet liliac active '> */}
                <div className={styles.btn}>
                  <FontAwesomeIcon
                    icon={faWallet}
                    style={{ height: '1.2em', padding: '1px' }}
                  />
                  My wallet
                </div>
                {/* </button> */}
              </Link>
            </div>
            <div
              className={
                currentRoute === '/transactions'
                  ? `col ${styles.btnContainerActive}`
                  : `col ${styles.btnContainer}`
              }
            >
              <Link
                href='/transactions'
                className={
                  currentRoute === '/transactions'
                    ? styles.active
                    : styles.nonActive
                }
              >
                {/* <button className='btn-menu menu-transactions '> */}
                <div className={styles.btn}>
                  <FontAwesomeIcon
                    icon={faExchange}
                    style={{ height: '1.2em', padding: '1px' }}
                  />
                  Transactions
                </div>
                {/* </button> */}
              </Link>
            </div>
          </div>
        </div>
        <div className='accept'></div>
      </footer>
    </>
  );
}
