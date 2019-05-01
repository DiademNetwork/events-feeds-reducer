const contract = require('../lib/contracts').achievements
const reducers = require('../lib/reducers.js')

const handler = (reducer) => (err, event) => {
  if (err) return console.error(err)

  return reducer(event)
}

const main = () => {
  contract.events.onCreateAchievement(
    handler(reducers.createAchievement)
  )

  contract.events.onConfirmAchievement(
    handler(reducer.confirmAchievement)
  )

  contract.events.onSupportAchievement(
    handler(reducer.supportAchievement)
  )
}

main()