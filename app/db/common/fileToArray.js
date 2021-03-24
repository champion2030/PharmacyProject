const fs = require('fs')
exports.fileToArray = (filePath, array) => {
    return new Promise((res, rej) => {
        try {
            const lineReader = require('readline').createInterface({
                input: fs.createReadStream(filePath),
            });
            lineReader.on('line', (line) => {
                array.push(line);
            });
            lineReader.on('close', () => {
                res(array)
            })
        } catch (e) {
            rej(e)
        }
    })
}