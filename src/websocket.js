const util = require("./websocket_util")
const openWebSocket = require("./open-websocket")
const deflate = require('zlib-node');

let ws = null;
let initialized = null;

const getWs = async (BASE) => {
    if (ws && ws.readyState <= 1) {
        return ws;
    }
    ws = await openWebSocket(`${BASE}`)
    return ws;
}

const openMarketMatches = async (BASE, symbols, cb) => {
    const w = await getWs(`${BASE}`)

    w.onmessage = (msg) => {
        let msg_data = JSON.parse(deflate(msg.data))

        if (msg_data.type === "error") {
            //console.log("Error!", msg)
        }
        // Connect or Reconnect fire the subscribe!
        if (msg_data.type === "welcome") {
            //Add heartbeat
            setInterval(() => {
                w.send(util.ping())
            }, 20000)

            // Subscribe
            w.send(util.subscribe("/market/match:", symbols))
        }

        if (msg_data.type === "message") {
            cb(msg_data.data)
            // console.log("On message data", msg_data)
        }
    }

    return {
        name: 'openMarketConnection',
        close: () => {
            w.close(1000, 'Open markets connection closed.', {keepClosed: true})
        }
    }
}

const openMarketLevel2 = async (BASE, symbols, cb) => {
    const w = await getWs(`${BASE}`)

    w.onmessage = (msg) => {
        let msg_data = JSON.parse(deflate(msg.data))

        if (msg_data.type === "error") {
            //console.log("Error!", msg)
        }
        // Connect or Reconnect fire the subscribe!
        if (msg_data.type === "welcome") {
            //Add heartbeat
            setInterval(() => {
                w.send(util.ping())
            }, 20000)

            // Subscribe
            w.send(util.subscribe("/market/level2:", symbols))
        }

        if (msg_data.type === "message") {
            cb(msg_data.data)
            // console.log("On message data", msg_data)
        }
    }


    return {
        name: 'marketLevel2Connection',
        close: () => {
            w.close(1000, 'Market Level 2 connection closed.', {keepClosed: true})
        }
    }
}

const openTicker = async (BASE, symbols, cb) => {

    const w = await getWs(`${BASE}`)

    w.onmessage = (msg) => {
        let msg_data = JSON.parse(deflate(msg.data))

        if (msg_data.type === "error") {
            //console.log("Error!", msg)
        }
        // Connect or Reconnect fire the subscribe!
        if (msg_data.type === "welcome" && !initialized) {
            //Add heartbeat
            initialized = setInterval(() => {
                w.send(util.ping())
            }, 20000)

            // Subscribe
            w.send(util.subscribe("/market/ticker:", symbols))
        }

        if (msg_data.type === "message") {
            cb(msg_data)
        }
    }

    return {
        name: 'tickerConnection',
        close: () => {
            w.close(1000, 'Ticker connection closed.', {keepClosed: true})
        }
    }
}

module.exports = { openMarketMatches, openMarketLevel2, openTicker }