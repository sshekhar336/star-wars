import React, { useEffect, useRef, useState } from 'react';
import { getPeopleData } from '../../apis/tableApis';
import './SearchTable.css';

// Custom hook - previous value
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

function SearchTable({setPeopleData, page, setIsLoading}) {
    const [searchText, setSearchText] = useState('');

    const prevSearchText = usePrevious(searchText);

    const handleSearchText = async () => {
        setIsLoading(true);
        const data = await getPeopleData(page, searchText);
        if(data) {
            setPeopleData(data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(searchText === '' && prevSearchText && prevSearchText.length > 0) {
            handleSearchText(page, '');
        }
    }, [searchText])

    return (
        <div className='searchContainer'>
            <input
                type='text'
                value={searchText}
                className='searchInput'
                onChange={(e) => setSearchText(e.target.value)}
            />
            <span className='fa fa-search searchIcon' onClick={handleSearchText}></span>
        </div>
    )
}

export default React.memo(SearchTable);
