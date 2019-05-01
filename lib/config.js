const secrets = require('../secrets.json')

module.exports = {
  blockchain: {
    "networkId": "default",
    "writeUrl": "wss://diadem.host/loom/websocket",
    "readUrl": "wss://diadem.host/loom/queryws",
    "achievementsAddress": "0xaCc7bC52599Ec656AA66cE31d8915ad123E8A693",
    "serviceAddress": "0x85a5082a6b01371cad401593ce6182e577af690f",
    "fromBlock": 720000,
    "privateKey": secrets.diademPrivateKey
  },
  feeds: {
    "streamKey": secrets.streamKey,
    "streamSecret": secrets.streamSecret,
    "streamAppId": secrets.streamAppId,
    "achievementsFeedName": "achievement"
  }
}