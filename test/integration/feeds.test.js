const R = require('ramda')
const getstream = require('getstream')
const { describe } = require('riteway')

const feeds = require('../../lib/feeds.js')
const config = require('../../lib/config.js')

const {
  feeds: {
    streamKey, streamSecret, streamAppId, achievementsFeedName
  }
} = config

const feedsClient = getstream.connect(streamKey, streamSecret, streamAppId)
const achievementsFeed = feedsClient.feed(achievementsFeedName, 'common')

const flushFeed = async (feed) => {
  const { results } = await feed.get({ reactions: { recent: false, counts: false, own: false }, limit: 100 })

  return R.compose(
    R.flatten,
    R.map(({ id }) => feed.removeActivity(id))
  )(results)
}

describe('feeds', async assert => {
  const creator = '0x123'
  const witness = '0x456'
  const sponsor = '0x789'
  const object = 'facebook.com/donate/object'
  const title = 'donation title'
  const time = Number(new Date())
  const amount = 10

  await flushFeed(achievementsFeed)

  const user1 = await feedsClient.user(witness).get({ userName: 'Name' })

  const { id: activityId } = await feeds.achievements.createAchievement({ actor: creator, object, title, time })

  assert({
    given: 'new achievement',
    should: 'add achievement to feed',
    actual: typeof activityId,
    expected: 'string'
  })

  const confirmReaction = await feeds.achievements.confirmAchievement({ activityId, actor: witness, time })

  assert({
    given: 'new confirmation',
    should: 'add confirm reaction for achievement',
    actual: confirmReaction.activity_id,
    expected: activityId
  })

  const supportReaction = await feeds.achievements.supportAchievement({ activityId, actor: sponsor, time, amount })

  assert({
    given: 'new transaction',
    should: 'add support reaction for achievement',
    actual: supportReaction.activity_id,
    expected: activityId
  })

  const response = await achievementsFeed.get({ enrich: true, reactions: { recent: true, counts: true } })
  const achievement = response.results[0]

  assert({
    given: 'result achievement',
    should: 'have reactions',
    actual: {
      latest_reactions: {
        confirm: [
          R.pick(['activity_id', 'kind', 'data', 'user_id'], achievement.latest_reactions.confirm[0])
        ],
        support: [
          R.pick(['activity_id', 'kind', 'data', 'user_id'], achievement.latest_reactions.support[0])
        ]
      },
      reaction_counts: achievement.reaction_counts
    },
    expected: {
      latest_reactions: {
        confirm: [
          {
            activity_id: activityId,
            kind: 'confirm',
            data: {
              actor: witness,
              time
            },
            user_id: witness
          },
        ],
        support: [
          {
            activity_id: activityId,
            kind: 'support',
            data: {
              actor: sponsor,
              amount,
              time
            },
            user_id: sponsor
          }
        ]
      },
      reaction_counts: {
        confirm: 1, support: 1
      }
    }
  })
})