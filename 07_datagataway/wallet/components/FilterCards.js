import { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';

import Card from './Card';

// style //
import 'semantic-ui-css/semantic.min.css';
import styles from '../styles/Filter.module.css';

// card data //
import data from '../cardData.json';

// filter options //
const options = [
  { key: 'personal', text: 'Personal', value: 'personal' },
  { key: 'business', text: 'Business', value: 'business' },
  { key: 'university', text: 'University', value: 'university' },
  { key: 'member', text: 'Member', value: 'member' },
  { key: 'token', text: 'Token', value: 'token' },
  { key: 'hospital', text: 'Hospital', value: 'hospital' },
  { key: 'NFT', text: 'NFT', value: 'NFT' },
  { key: 'data', text: 'Data', value: 'data' },
];

export default function Cards() {
  const cardData = data.CardInfo;

  const [filteredCardList, setFilterCardList] = useState([]);
  const [searchInput, setSearchInput] = useState([]);

  const handleChange = (e, d) => {
    const optionList = d.value;
    setSearchInput(optionList);
  };

  // useEffect(() => {
  //   const filteredCardList = cardData.filter((input) =>
  //     input.type.toLowerCase().includes(searchInput)
  //   );
  //   setFilterCardList(filteredCardList);
  // }, [searchInput]);

  return (
    <>
      <div className={styles.btnContainer}>
        <div id='trans' className='page justify-content-center'>
          <div className='nav p-1'>
            <button className='btn btn-sm badge rounded-pill bg-secondary m-1'>
              All
            </button>
            <button className='btn btn-sm badge rounded-pill bg-secondary text-obsidian m-1'>
              Identification
            </button>
            <button className='btn btn-sm badge rounded-pill bg-secondary text-obsidian m-1'>
              Data
            </button>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <Dropdown
            placeholder='Filter...'
            fluid
            multiple
            search
            selection
            options={options}
            style={{
              zIndex: '900',
            }}
            onChange={handleChange}
            defaultValue={searchInput}
          />
        </div>
      </div>

      <Card cardList={filteredCardList} />
    </>
  );
}
