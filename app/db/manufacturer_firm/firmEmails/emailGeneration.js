const endings = ["mail.ru", "list.ru", "rambler.ru", "yandex.ru", "gmail.com"],
    symbols = "qwertyuiopasdfghjklzxcvbnm1234567890";

function rand(min, max) {
    return (min + Math.random() * (max - min + 1)) | 0
}

function getRandomStr(len) {
    let ret = "";
    for (let i = 0; i < len; i++)
        ret += symbols[rand(0, symbols.length - 1)]
    return ret;
}

exports.getEmail = async () => {
    const a = getRandomStr(rand(3, 5)),
        b = getRandomStr(rand(3, 5));
    return a + "." + b + "@" + endings[rand(0, endings.length - 1)];
}