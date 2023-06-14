import Nav from '../components/Nav';
import Menu from '../components/Menu';
import ServerSelect from '../components/ServerSelect';

export default function setting() {
  return (
    <>
      <Nav title='Setting' />
      <ServerSelect />
      <Menu />
    </>
  );
}
