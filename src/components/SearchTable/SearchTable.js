import React, { useState } from 'react';
import { getPeopleData } from '../../apis/tableApis';
import './SearchTable.css';

export default function SearchTable({setPeopleData, page, setIsLoading}) {
    const [searchText, setSearchText] = useState('');

    const handleSearchText = async () => {
        setIsLoading(true);
        const data = await getPeopleData(page, searchText);
        if(data) {
            setPeopleData(data);
        }
        setSearchText('')
    }

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
