const getstream = require('getstream')
const config = require('./config')
const feeds = require('./feeds.utils.js')

const {
  feeds: {
    streamKey, streamSecret, streamAppId, achievementsFeedName
  }
} = config

const feedsClient = getstream.connect(streamKey, streamSecret, streamAppId)

const achievementsFeed = feedsClient.feed(achievementsFeedName, 'common')

const addReaction = feedsClient.reactions.add.bind(feedsClient.reactions)
const addActivity = achievementsFeed.addActivity.bind(achievementsFeed)
const getActivities = feedsClient.getActivities.bind(feedsClient)

const createAchievement = feeds.createAchievement({ addActivity, achievementsFeedName })
const confirmAchievement = feeds.confirmAchievement({ addReaction })
const supportAchievement = feeds.supportAchievement({ addReaction })
const getAchievement = feeds.getAchievement({ getActivities })

module.exports = {
  achievements: {
    getAchievement,
    createAchievement, confirmAchievement, supportAchievement
  },
}
