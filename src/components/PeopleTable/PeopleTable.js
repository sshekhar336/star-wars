import React, { useEffect, useState } from 'react';

import './PeopleTable.css';

import { getPeopleData } from '../../apis/tableApis';
import { getRowsData, getTableHeaders } from '../../helperFunctions';
import SearchTable from '../SearchTable/SearchTable';

function PeopleTable() {

    const [peopleData, setPeopleData] = useState(null);
    const [peopleDataRows, setPeopleDataRows] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async function(){
            setIsLoading(true);
            const data = await getPeopleData(page);
            if(data) {
                setPeopleData(data);
                let total = Math.ceil(data?.count/10)
                setTotalPages(total);
            }
        })();
    }, [page]);

    useEffect(() => {
        if(peopleData && peopleData?.data[0]) {
            setIsLoading(true)
            let headers = getTableHeaders(peopleData.data[0]);
            setTableHeaders(headers);
            let rowsDataPromises = peopleData?.data?.map(async data => await getRowsData(data));
            Promise.all(rowsDataPromises)
                .then((rowValuesArray) => {
                    setPeopleDataRows(rowValuesArray);
                })
                .finally(() => {
                    setIsLoading(false);
                })
        }
    }, [peopleData]);

    const displayDataValues = (value, dataIndex) => {
        if(dataIndex === 10) {
            // For Species
            if(value?.length === 0) {
                return <td key={dataIndex}><i className="fa fa-circle"></i>{" Human"}</td>
            }
            if(value?.[0] === 'Droid') {
                return <td key={dataIndex}><i className="fa fa-brands fa-android"></i>{" " + value}</td>
            }
            return <td key={dataIndex}><i className="fa fa-question-circle" aria-hidden="true"></i></td>
        }
        if(typeof value === 'string') {
            if(value.includes('http')) {
                return <td key={dataIndex}><a href={value}>{value}</a></td>
            }
            return <td key={dataIndex}>{value}</td>
        } else if(Array.isArray(value)) {
            return <td key={dataIndex}>
                {
                    value.map((val, valIndex) => <p key={valIndex}>{val}</p>)
                }
            </td>
        }
        return <td key={dataIndex}>ooo</td>;
    }

    const sortTable = (type) => {
        let temp = [...peopleDataRows];
        temp.sort();
        if(type === 'asc') {
            setPeopleDataRows(temp);
        } else {
            temp.reverse();
            setPeopleDataRows(temp);
        }
    }

    const changePageData = (type) => {
        if(type === 'prev' && page > 1) {
            setPage(page - 1)
        } else if(type === 'next' && page < totalPages) {
            setPage(page + 1)
        }
    }

    return (
        <>
            <div className='actionPanel'>
                <SearchTable setPeopleData={setPeopleData} page={page} setIsLoading={setIsLoading} />
                <span className='fa fa-sort-alpha-asc sortIcon' onClick={() => sortTable('asc')}></span>
                <span className='fa fa-sort-alpha-desc sortIcon' onClick={() => sortTable('desc')}></span>
                <div className='pageDisplay'>
                    <span className='fa fa-arrow-left changePageIcon' onClick={() => changePageData('prev')}></span>
                    <p>Page no. <span className='page'>{page}</span> / {totalPages}</p>
                    <span className='fa fa-arrow-right changePageIcon' onClick={() => changePageData('next')}></span>
                </div>
            </div>
        
            {isLoading && <span className="fa fa-spinner fa-pulse loaderIcon"></span>}

            {
                (peopleData && peopleData?.data?.length > 0) ?
                <table className='peopleTable'>
                    <thead>
                        <tr>
                            {
                                tableHeaders?.map((header, headerIndex) => <th className='thead' key={headerIndex}>{header}</th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            peopleDataRows?.map((rowdata, rowIndex) => (
                                <tr key={rowIndex}>
                                    {
                                        rowdata?.map((row, dataIndex) => displayDataValues(row, dataIndex))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table> :
                peopleData?.data?.length === 0 ?
                    <div className='noData'>
                        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        <p>No data avaialble</p>
                    </div>: <></>
            }
        </>
    )
}

export default PeopleTable;