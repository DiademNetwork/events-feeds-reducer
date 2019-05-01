const achievementsContract = require('./contracts').achievements
const achievementsFeed = require('./feeds').achievements
const reducers = require('./reducers.utils.js')

const getAchievementByHash = achievementsContract.getAchievementByHash
const getAchievement = achievementsContract.getAchievement
const createAchievementActivity = achievementsFeed.addActivity
const getAchievementActivity = achievementsFeed.getAchievementActivity
const confirmAchievementReaction = achievementsFeed.confirmAchievement
const supportAchievementReaction = achievementsFeed.supportAchievementReaction

const createAchievement = reducers.createAchievement({ getAchievementByHash, createAchievementActivity })
const confirmAchievement = reducers.confirmAchievement({ getAchievement, getAchievementActivity, confirmAchievementReaction })
const supportAchievement = reducers.supportAchievement({ getAchievement, getAchievementActivity, supportAchievementReaction })

module.exports = {
  createAchievement, confirmAchievement, supportAchievement
}