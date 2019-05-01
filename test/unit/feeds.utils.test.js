const { describe } = require('riteway')
const feeds = require('../../lib/feeds.utils.js')
const config = require('../../lib/config.js')

const { feeds: { achievementsFeedName } } = config

const fn = (...args) => args

const createAchievement = feeds.createAchievement({ addActivity: fn, achievementsFeedName })
const confirmAchievement = feeds.confirmAchievement({ addReaction: fn })
const supportAchievement = feeds.supportAchievement({ addReaction: fn })
const getAchievement = feeds.getAchievement({ getActivities: fn })

describe('feeds', async assert => {
  const actor = 'user-loom-address'
  const object = 'achievement-external-link'
  const title = 'achievement-custom-title'
  const time = 'block-timestamp-plus-event-logIndex'

  assert({
    given: 'achievement event args',
    should: 'call fn to add achievement activity',
    actual: createAchievement({
      actor, object, title, time
    }),
    expected: [{
      actor,
      object,
      title,
      time,
      foreign_id: `create_${object}`,
      verb: 'create',
      to: [
        `${achievementsFeedName}:${actor}`
      ]
    }]
  })

  const activityId = 'generated-activity-uuid'

  assert({
    given: 'confirm event args',
    should: 'call fn to add confirm reaction',
    actual: confirmAchievement({ activityId, actor, time }),
    expected: [
      'confirm',
      activityId,
      { actor, time },
      { userId: actor }
    ]
  })

  const amount = 'transaction-value-in-wei'

  assert({
    given: 'support event args',
    should: 'call fn to add support reaction',
    actual: supportAchievement({ activityId, actor, amount, time }),
    expected: [
      'support',
      activityId,
      { actor, amount, time },
      { userId: actor }
    ]
  })

  const createdAt = 'achievement-created-timestamp'

  assert({
    given: 'link and transaction timestamp',
    should: 'call fn to fetch achievement',
    actual: getAchievement({ object, createdAt }),
    expected: [{
      foreignIDTimes: [
        { foreignID: `create_${object}`, time: createdAt }
      ]
    }]
  })
})
