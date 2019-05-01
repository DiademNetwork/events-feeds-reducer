const R = require('ramda')
const Web3 = require('web3')
const { CryptoUtils, LocalAddress, Client, LoomProvider } = require('loom-js')
const achievementsABI = require('./abi/Achievements.json')
const config = require('./config')

const {
  blockchain: {
    privateKey, networkId, writeUrl, readUrl, serviceAddress, achievementsAddress, fromBlock
  }
} = config

const privateKeyRaw = CryptoUtils.B64ToUint8Array(privateKey)

const loomClient = new Client(networkId, writeUrl, readUrl)

const web3 = new Web3(new LoomProvider(loomClient, privateKeyRaw))

const achievements = new web3.eth.Contract(achievementsABI, achievementsAddress, { from: serviceAddress })

module.exports = {
  achievements: {
    events: {
      'onCreate': (handler) => achievements.events.Create({ fromBlock }, handler),
      'onConfirm': (handler) => achievements.events.Confirm({ fromBlock }, handler),
      'onSupport': (handler) => achievements.events.Support({ fromBlock }, handler)
    },
    getAchievement: achievements.methods.getAchievement.bind(achievements.methods),
    getAchievementByHash: achievements.methods.getAchievementByHash.bind(achievements.methods)
  }
}