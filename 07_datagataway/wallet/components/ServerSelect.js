import { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

// style //
import 'semantic-ui-css/semantic.min.css';

const serverOptions = [
  { key: 'Server-1', text: 'Server-1', value: 'Server-1' },
  { key: 'Server-2', text: 'Server-2', value: 'Server-2' },
  { key: 'Server-3', text: 'Server-3', value: 'Server-3' },
  { key: 'Server-4', text: 'Server-4', value: 'Server-4' },
  { key: 'Server-5', text: 'Server-5', value: 'Server-5' },
];

export default function ServerSelect() {
  const [server, setServer] = useState('');

  const handleChange = (event, { value }) => {
    setServer(value);
  };
  return (
    <>
      <div
        className='current-server'
        style={{ display: 'flex', justifyContent: 'center', margin: '5%' }}
      >
        <h2>Current Server:</h2>
        <picture>
          <img
            src='../images/woollet-logo.png'
            alt='logo'
            style={{ height: '30px', marginLeft: '3%' }}
          />
        </picture>
        <p style={{ marginTop: '4px', marginLeft: '3px' }}>{server}</p>
      </div>

      <div
        className='server-input'
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Dropdown
          button
          className='icon'
          floating
          labeled
          icon='server'
          options={serverOptions}
          search
          text='Select Server'
          style={{ width: '150px', zIndex: '300' }}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
