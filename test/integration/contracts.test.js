const R = require('ramda')
const { describe } = require('riteway')
const contract = require('../../lib/contracts.js').achievements

const checkEvents = (eventSubscription, requiredEventsNumber, handler) =>
  new Promise(resolve => {
    let currentEventsCounter = 0

    eventSubscription((err, event) => {
      if (err) return console.error(err)

      currentEventsCounter++

      handler(event)

      if (currentEventsCounter >= requiredEventsNumber)
        resolve()
    })
  })

const eventArgumentTypes = (fields, event) =>
  R.compose(
    R.map((value) => typeof value),
    R.pick(fields),
    R.prop('returnValues')
  )(event)

describe('contracts', async assert => {
  try {
    await checkEvents(contract.events.onCreate, 1, (event) => {
      assert({
        given: `create achievement`,
        should: 'emit Create event',
        actual: eventArgumentTypes(['messageHash'], event),
        expected: {
          messageHash: 'string'
        }
      })
    })

    await checkEvents(contract.events.onConfirm, 1, (event) => {
      assert({
        given: `confirm achievement`,
        should: 'emit Confirm event',
        actual: eventArgumentTypes(['owner', 'link', 'witness'], event),
        expected: {
          owner: 'string',
          link: 'string',
          witness: 'string'
        }
      })
    })

    await checkEvents(contract.events.onSupport, 1, (event) => {
      assert({
        given: 'support achievement',
        should: 'emit Support event',
        actual: eventArgumentTypes(['userAddress', 'creatorAddress', 'link', 'amount'], event),
        expected: {
          userAddress: 'string',
          creatorAddress: 'string',
          link: 'string',
          amount: 'number'
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
})