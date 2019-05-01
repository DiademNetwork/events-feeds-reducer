const R = require('ramda')

const getActivityId = ({ getAchievement, getAchievementActivity }) =>
  R.compose(
    R.then(R.prop('activityId')),
    () => Promise.resolve({ activityId: 'feeds-unique-item-id' })
  )

const createAchievement = ({ getAchievementByHash, createAchievementActivity }) =>
  R.compose(
    R.then(({ owner, link, title, time }) => createAchievementActivity({
      actor: owner,
      object: link,
      title,
      time
    })),
    getAchievementByHash,
    R.path(['returnValues', 'messageHash'])
  )

const confirmAchievement = ({ getAchievement, getAchievementActivity, confirmAchievementReaction }) =>
  R.compose(
    async ({ witness, owner, link, time }) => confirmAchievementReaction({
      activityId: await getActivityId({ getAchievement, getAchievementActivity })({ owner, link }),
      actor: witness,
      time: time
    }),
    R.prop('returnValues')
  )

const supportAchievement = ({ getAchievement, getAchievementActivity, supportAchievementReaction }) =>
  R.compose(
    async ({ userAddress, creatorAddress, link, amount, time }) => supportAchievementReaction({
      time,
      actor: userAddress,
      amount,
      activityId: await getActivityId({ getAchievement, getAchievementActivity })({ owner: creatorAddress, link })
    }),
    R.prop('returnValues')
)

module.exports = {
  createAchievement,
  confirmAchievement,
  supportAchievement
}