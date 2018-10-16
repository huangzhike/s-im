let WS = function (url, onConnect, onMessage, onError, onClose) {

    let t = {}

    t.running = true

    t.timeOut = undefined

    t.close = (event) => {
        event.returnValue = "Fucking..."
        t.running = false
        t.websocket.close()
    }

    t.open = function () {

        try {

            if ('WebSocket' in window) {
                t.websocket = new WebSocket(url);
            } else {
                onError('不支持该浏览器...')
            }

            t.websocket.addEventListener('open', function (event) {
                onConnect()
                console.log('WebSocket opened', event)
                t.websocket.send('Hello Server!');
            });

            t.websocket.addEventListener('message', function (event) {
                onMessage(event.data);
                console.log('Message from server ', event);
            });

            t.websocket.onerror = onError

            t.websocket.onclose = function (event) {
                if (t.running) {
                    clearTimeout(t.timeOut)
                    t.timeOut = setTimeout(() => t.open(), 30000)
                }
                onClose()
                console.error("WebSocket is closed now.", event);
            }

            window.addEventListener('beforeunload', t.close, true);


        } catch (e) {
            onError(e)
        }


    }


    return t
}

export default WS
