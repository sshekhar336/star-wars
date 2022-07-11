import { getNameFromUrl } from "./apis/tableApis";

export const getTableHeaders = (obj) => {
    let keys = Object.keys(obj);
    keys = keys.map((key) => key.replace('_', ' '))
    return keys;
}

export const getRowsData = async (peopleDataObj) => {
    let peopleDataArray = Object.values(peopleDataObj);
    // let newArray = await updatingData(peopleDataArray);
    let updatedArray = [];

    for(let i=0; i<peopleDataArray.length; i++) {
        if(typeof peopleDataArray[i] === 'string') {
            if(peopleDataArray[i].includes('http') && !peopleDataArray[i].includes('people')) {
                await getNameFromUrl(peopleDataArray[i]).then(val => {
                    updatedArray[i] = val;
                });
            } else if(peopleDataArray[i].includes('T') && peopleDataArray[i][peopleDataArray[i].length - 1] === 'Z') {
                updatedArray[i] = new Date(peopleDataArray[i]).toDateString();
            } else {
                updatedArray[i] = peopleDataArray[i];
            }
        } else if(Array.isArray(peopleDataArray[i])) {
            if(peopleDataArray[i].length > 0) {
                let promisesArray = await peopleDataArray[i].map(url => new Promise(async (res, rej) => {
                    await getNameFromUrl(url).then(val => {
                        res(val)
                    }).catch(err => {
                        rej('')
                    });

                }));
                await Promise.all(promisesArray)
                    .then(val => {
                        updatedArray[i] = val;
                    })
                    .catch(errValue => {
                        updatedArray[i] = '';
                    })
            } else {
                updatedArray[i] = peopleDataArray[i];
            }
        }
    }
    return updatedArray;
}
