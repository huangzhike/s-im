let WS = function (url, onConnect, onMessage, onError, onClose) {

    let t = {}

    t.running = true


    t.timeOut = undefined


    t.close = function () {
        t.running = false
        t.websocket.close()
    }
    t.open = function () {

        try {

            if ('WebSocket' in window) {
                t.websocket = new WebSocket(url);
            } else {
                onError('不支持该浏览器')
            }

            t.websocket.onerror = onError

            t.websocket.onopen = function (event) {
                console.log('websocket opened', event)
                onConnect()
            }
            t.websocket.onmessage = function (event) {
                console.log('websocket onmessage', event)
                onMessage(event.data);
            }
            t.websocket.onclose = function () {

                console.error("websocket.onclose")
                if (t.running) {
                    clearTimeout(t.timeOut)
                    t.timeOut = setTimeout(() => t.open(), 30000)

                }
                onClose()


            }
            window.onbeforeunload = function () {
                t.close()
            }

        } catch (e) {
            onError(e)
        }


    }


    return t
}

export default WS
