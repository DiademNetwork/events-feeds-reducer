const { describe } = require('riteway')
const reducers = require('../../lib/reducers.utils.js')

const creator = '0x123'
const witness = '0x456'
const sponsor = '0x789'
const object = 'achievement-external-link'
const title = 'achievement-custom-title'
const time = 'block-timestamp-plus-event-logIndex'
const activityId = 'feeds-unique-item-id'
const amount = 'support-transaction-value'
const messageHash = 'achievement-blockchain-identifier'
const createdAt = 'achievement-blockchain-timestamp'

const getAchievementByHash = (hash) => {
  return hash === messageHash ? Promise.resolve({ owner: creator, link: object, title, time }) : {}
}

const getAchievement = (args) => {
  return args.owner === creator && args.link === object ? Promise.resolve({ createdAt }) : {}
}

const getAchievementActivity = (args) => {
  return args.createdAt === createdAt ? Promise.resolve({ activityId }) : {}
}

const createAchievementActivity = (...args) => args
const confirmAchievementReaction = (...args) => args
const supportAchievementReaction = (...args) => args

const createAchievement = reducers.createAchievement({ getAchievementByHash, createAchievementActivity })
const confirmAchievement = reducers.confirmAchievement({ getAchievement, getAchievementActivity, confirmAchievementReaction })
const supportAchievement = reducers.supportAchievement({ getAchievement, getAchievementActivity, supportAchievementReaction })

describe('reducers', async assert => {
  const createEvent = {
    returnValues: {
      'messageHash': messageHash
    }
  }

  const confirmEvent = {
    returnValues: {
      witness, owner: creator, link: object, time
    },
  }

  const supportEvent = {
    returnValues: {
      userAddress: sponsor,
      creatorAddress: creator,
      link: object,
      amount,
      time
    }
  }

  assert({
    given: 'Create event object',
    should: 'pass achievement activity to createAchievementActivity',
    actual: await createAchievement(createEvent),
    expected: [{ actor: creator, object, title, time }]
  })

  assert({
    given: 'Confirm event object',
    should: 'pass confirm reaction to addReaction',
    actual: await confirmAchievement(confirmEvent),
    expected: [{ activityId, actor: witness, time }]
  })

  assert({
    given: 'Support event object',
    should: 'pass support reaction to addReaction',
    actual: await supportAchievement(supportEvent),
    expected: [{ activityId, actor: sponsor, amount, time }]
  })
})