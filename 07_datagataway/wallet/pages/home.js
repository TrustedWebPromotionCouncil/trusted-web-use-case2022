
import { useEffect, useState } from 'react';
import Router from 'next/router';

import Menu from '@components/Menu';
import Nav from '@components/Nav';
import Card from '@components/Card';
import { Woollet } from '@data/woollet';


export default function Home() {

  const [ cover, setCover ] = useState(true);

  useEffect(() => {
    if (Woollet.unsigned()) {
      Router.push('/')
    } else {
      setCover(false);
    }
  }, []);

  return (
    <div hidden={cover}>
      <Nav title='My Wallet' />
      <Card />
      <div style={{ height: '150px' }}></div>
      <Menu />
    </div>
  );
}
