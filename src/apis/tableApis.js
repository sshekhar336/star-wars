export const getPeopleData = async (page, searchText = '') => {
    let peopleData = null;
    await fetch(`https://swapi.dev/api/people/?page=${page}&search=${searchText}`)
        .then((response) => response.json())
        .then((res) => {
            peopleData = {
                count: res.count,
                data: res.results
            }
        })
        .catch((err) => {
            console.log("error: ", err);
            peopleData = {
                count: 0,
                data: []
            }
        })

    return peopleData;
}

export const getNameFromUrl = (url) => {
    return fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // name = res?.name || '';
            return res.name || res.title || '';
        })
        .catch((err) => {
            console.log('Error: ', err);
            return '';
        })
}
