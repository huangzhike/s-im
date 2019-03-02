import protoRoot from '@/proto/proto'
import protobuf from 'protobufjs'


export default (url, onConnect, onMessage, onError, onClose) => {

    let t = {
        running: true,
        timeOut: undefined,
        websocket: {},
    }

    t.close = (event) => {
        event.returnValue = "close..."
        t.running = false
        t.websocket && t.websocket.close()
    }

    t.send = (data, done) => {

        protoRoot.lookup('protoBean.xxx').encode(data).finish()
        // let bytes = []
        // let buffer = new ArrayBuffer(bytes.length + 4);
        // let view = new DataView(buffer);
        // view.setUint32(0, bytes.length);
        // for (let i = 0; i < bytes.length; i++) {
        //     view.setUint8(i + 4, bytes[i]);
        // }
        // t.websocket.send(view)


        t.websocket && t.websocket.send(data)
        done instanceof Function && done()
    }

    t.open = () => {
        try {
            t.websocket = new WebSocket(url);
            t.websocket.binaryType = "arraybuffer";
            // 接收缓冲区
            t.receive = [];


            t.websocket.addEventListener('open', (event) => {

                setInterval(() => {
                    // 开启心跳
                }, 1000)
                onConnect()
                console.log('WebSocket opened', event)

            });

            t.websocket.addEventListener('message', (event) => {

                // ArrayBuffer不能直接操作它，转成Unit8Array
                // Uint8Array将ArrayBuffer中的字节作为8位无符号整数来对待，正好一byte字节对应一个uint8整数
                // Uint16Array将ArrayBuffer中的字节作为16位无符号整数来对待，则每两位对应一个uint16整数
                let unit8 = new Uint8Array(event.data);
                // DataView将ArrayBuffer中的数据作为网络流对待，采用大端编码，可以用它来读取或写入数据
                let dataView = new DataView(event.data);
                let unit82 = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);


                t.receive = t.receive.concat(Array.from(unit8));
                // 小于标记头长度
                if (t.receive.length < 4 + 1 + 2) {
                    return;
                }

                let d = new DataView(new Uint8Array(t.receive).buffer)

                let flag = d.getUint32(0);
                console.error("flag=== 0xbabe", flag === 0xbabe)

                let commandId = d.getUint8(4);
                console.error("commandId", commandId)

                let bodyLength = d.getUint16(5)
                console.error("bodyLength", bodyLength)


                if (t.receive.length < bodyLength + 4 + 1 + 2) {
                    return;
                }
                let bodyBytes = t.receive.slice(4 + 1 + 2, bodyLength + 4 + 1 + 2);

              let ab=  new Uint8Array(bodyBytes).buffer

                try {
                    const buf = protobuf.util.newBuffer(ab)
                    // decode响应体
                    const pf = protoRoot.lookup('framework.PBMessageResponse').decode(buf)

                    return pf
                } catch (err) {
                    return err
                }

                // 用剩余字节重置缓冲区以备下一次读取
                t.receive = t.receive.slice(bodyLength + 4 + 1 + 2);

                onMessage(event.data);
                console.log('Message from server...', event);
            });

            t.websocket.onerror = onError

            t.websocket.onclose = (event) => {
                if (t.running) {
                    clearTimeout(t.timeOut)
                    t.timeOut = setTimeout(() => t.open(), 30000)
                }
                onClose()
                console.error("WebSocket is closed now...", event);
            }

            window.addEventListener('beforeunload', t.close, true);

        } catch (e) {
            onError(e)
        }

    }

    return t
}
