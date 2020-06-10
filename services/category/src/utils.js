
const factorCity = data => {
    return data._id !== undefined ? {
        _id: data._id,
        code: data.code,
        cityName: data.cityName
    } : null;
}

module.exports = {
    factorCity: factorCity
}