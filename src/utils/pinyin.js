/**
 * 收录常用汉字6763个，不支持声调，支持多音字，并按照汉字使用频率由低到高排序
 */
let pinyinNoToneDict = {
    "a": "啊",
    "e": "额",
    "ai": "唉",
    "ei": "诶",
}

let dict = {}

function parseDict() {
    dict.notone = {};
    for (let i in pinyinNoToneDict) {
        let temp = pinyinNoToneDict[i];
        for (let j = 0, len = temp.length; j < len; j++) {
            dict.notone[temp[j]] = i; // 不考虑多音字
        }
    }
}

/**
 * 根据汉字获取拼音，如果不是汉字直接返回原字符
 * @param chinese 要转换的汉字
 * @param splitter 分隔字符，默认用空格分隔
 */
function getPinyin(chinese, splitter) {
    parseDict()
    if (!chinese || /^ +$/g.test(chinese)) return '';
    splitter = splitter === undefined ? ' ' : splitter;
    let result = [];

    for (let i = 0, len = chinese.length; i < len; i++) {
        let temp = chinese.charAt(i);
        result.push(dict.notone[temp] || temp);
    }

    return result.join(splitter);

}

export {getPinyin}
