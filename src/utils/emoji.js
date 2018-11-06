
let emojiBaseUrl = `http://yx-web.nosdn.127.net/webdoc/h5/emoji`

let emojiList = {
    'emoji': {
        '[大笑]': {file: 'emoji_0.png'},
        '[可爱]': {file: 'emoji_01.png'},
        '[色]': {file: 'emoji_02.png'},
        '[嘘]': {file: 'emoji_03.png'},
        '[亲]': {file: 'emoji_04.png'},
        '[呆]': {file: 'emoji_05.png'},
        '[口水]': {file: 'emoji_06.png'},
        '[汗]': {file: 'emoji_145.png'},
        '[呲牙]': {file: 'emoji_07.png'},
        '[鬼脸]': {file: 'emoji_08.png'},
        '[害羞]': {file: 'emoji_09.png'},
        '[偷笑]': {file: 'emoji_10.png'},
    }
}

for (let emoji in emojiList) {
    let emojiItem = emojiList[emoji]
    for (let key in emojiItem) {
        let item = emojiItem[key]
        item.img = `${emojiBaseUrl}/${emoji}/${item.file}`
    }
}

let pinupList = {
    'ajmd': {},
    'xxy': {},
    'lt': {}
}

for (let i = 1; i <= 48; i++) {
    let key = 'ajmd0' + (i >= 10 ? i : '0' + i)
    pinupList['ajmd'][key] = {file: key + '.png'}
}
for (let i = 1; i <= 40; i++) {
    let key = 'xxy0' + (i >= 10 ? i : '0' + i)
    pinupList['xxy'][key] = {file: key + '.png'}
}
for (let i = 1; i <= 20; i++) {
    let key = 'lt0' + (i >= 10 ? i : '0' + i)
    pinupList['lt'][key] = {file: key + '.png'}
}

for (let emoji in pinupList) {
    let emojiItem = pinupList[emoji]
    for (let key in emojiItem) {
        let item = emojiItem[key]
        item.img = `${emojiBaseUrl}/${emoji}/${item.file}`
    }
}

export default {
    emojiList,
    pinupList
}
