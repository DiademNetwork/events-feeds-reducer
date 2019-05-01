const R = require('ramda')

const achievementActivity = (achievementsFeedName) => ({ actor, object, title, time }) => ({
  actor, object, title, time,
  foreign_id: `create_${object}`,
  verb: 'create',
  to: [`${achievementsFeedName}:${actor}`]
})

const getAchievement = ({ getActivities }) => ({ object, createdAt }) =>
  getActivities({
    foreignIDTimes: [
      { foreignID: `create_${object}`, time: createdAt }
    ]
  })

const createAchievement = ({ addActivity, achievementsFeedName }) =>
  R.compose(
    addActivity,
    achievementActivity(achievementsFeedName)
  )

const confirmAchievement = ({ addReaction }) => ({ activityId, actor, time }) =>
  addReaction('confirm', activityId, { actor, time }, { userId: actor } )

const supportAchievement = ({ addReaction }) => ({ activityId, actor, amount, time }) =>
  addReaction('support', activityId, { actor, amount, time }, { userId: actor } )

module.exports = {
  getAchievement,
  createAchievement, confirmAchievement, supportAchievement
}