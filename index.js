"use strict"

const { openMarketMatches, openMarketLevel2, openTicker} = require("./src/websocket")
const axios = require("axios")

class Kucoin_API {
    constructor() {
        this.baseURL = "https://openapi-v2.kucoin.com"
    }

    async MarketMatches(symbols, callback) {
        let endpoint = await this.getSocketEndpoint()

        let result = await openMarketMatches(endpoint, symbols, callback)

        // Return Close function
        return result
    }

    async MarketLevel2(symbols, callback) {
        let endpoint = await this.getSocketEndpoint()

        let result = await openMarketLevel2(endpoint, symbols, callback)

        // Return Close function
        return result
    }

    async Ticker(symbols, callback) {
        let endpoint = await this.getSocketEndpoint()

        let result = await openTicker(endpoint, symbols, callback)

        // Return Close function
        return result
    }

    // Kucoin token methods

    async getPublicWsToken() {
        let endpoint = "/api/v1/bullet-public"
        let url = this.baseURL + endpoint
        let result = await axios.post(url, {})
        return result.data
    }

    async getSocketEndpoint() {
        let r

        r = await this.getPublicWsToken()

        let token = r.data.token
        let endpoint = r.data.instanceServers[0].endpoint

        return `${endpoint}?token=${token}&[connectId=${Date.now()}]`
    }
}

module.exports = Kucoin_API