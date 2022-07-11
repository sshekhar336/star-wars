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

    return peopleData;
}

export const getNameFromUrl = (url) => {
    // let name = '';
    return fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // name = res?.name || '';
            return res.name || res.title || '';
        })
        .catch((err) => {
            console.log('Error: ', err);
        })
    // return name;
}

// export const getSpecies = () => {
//     let speciesData = null;
//     fetch('https://swapi.dev/api/species/')
//         .then
// }