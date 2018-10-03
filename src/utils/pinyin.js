/**
 * 收录常用汉字6763个，不支持声调，支持多音字，并按照汉字使用频率由低到高排序
 */
var pinyinNoToneDict = {
    "a": "阿啊呵腌嗄吖锕",
    "e": "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭",
    "ai": "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹",
    "ei": "诶",

}

let dict = {}

function parseDict() {
    dict.notone = {};
    for (var i in pinyinNoToneDict) {
        var temp = pinyinNoToneDict[i];
        for (var j = 0, len = temp.length; j < len; j++) {
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
    splitter = splitter == undefined ? ' ' : splitter;
    var result = [];

    for (var i = 0, len = chinese.length; i < len; i++) {
        var temp = chinese.charAt(i);
        result.push(dict.notone[temp] || temp);
    }

    return result.join(splitter);

}

export {getPinyin}