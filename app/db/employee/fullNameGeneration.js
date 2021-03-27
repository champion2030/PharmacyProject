const {fileToArray} = require("../common/fileToArray");

exports.fullNameGeneration = async () => {
    let female_firstnames = []
    female_firstnames = await fileToArray("./employee/female/female-firstnames", female_firstnames)
    let female_lastnames = []
    female_lastnames = await fileToArray("./employee/female/female-lastnames", female_lastnames)
    let female_middlenames = []
    female_middlenames = await fileToArray("./employee/female/female-middlenames", female_middlenames)
    let male_firstnames = []
    male_firstnames = await fileToArray("./employee/male/male-firstnames", male_firstnames)
    let male_lastnames = []
    male_lastnames = await fileToArray("./employee/male/male-lastnames", male_lastnames)
    let male_middlenames = []
    male_middlenames = await fileToArray("./employee/male/male-middlenames", male_middlenames)
    if (Math.random() < 0.5) {
        const randomFirstname = female_firstnames[Math.floor(Math.random() * female_firstnames.length)]
        const randomLastname = female_lastnames[Math.floor(Math.random() * female_lastnames.length)]
        const randomMiddlename = female_middlenames[Math.floor(Math.random() * female_middlenames.length)]
        return {
            randomLastname,
            randomFirstname,
            randomMiddlename
        }
    }
    const randomFirstname = male_firstnames[Math.floor(Math.random() * male_firstnames.length)]
    const randomLastname = male_lastnames[Math.floor(Math.random() * male_lastnames.length)]
    const randomMiddlename = male_middlenames[Math.floor(Math.random() * male_middlenames.length)]
    return {
        randomLastname,
        randomFirstname,
        randomMiddlename
    }
}
