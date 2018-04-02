'use strict'

const Chainsaw = require('eth-chainsaw').Chainsaw
const Web3     = require('web3')
const dotenv   = require('dotenv').config()
const fetch    = require('node-fetch')


const ETH_NETWORK_MAIN = '1'
const ETH_NETWORK_RINKEBY = '4'

const addressesToWatch = [
  {
    toAddress: '0x69117dC22D8154a28E42B94dD9D2cbcb564639Ef', // nodeworldwide test payment address
    networkId: ETH_NETWORK_RINKEBY,
    postbackURL: 'https://stage.nodeworldwide.io/webhooks/ethereum-payment'
  },
  {
    toAddress: '0x3578C91A9B3dE921BB29c61e57edb5410Cd1229C', // nodweworldwide production payment address
    networkId: ETH_NETWORK_MAIN,
    postbackURL: 'https://nodeworldwide.io/webhooks/ethereum-payment'
  },
]

const ETH_NODE_MAIN = process.env.ETH_NODE_MAIN || 'http://localhost:8545'
const ETH_NODE_RINKEBY = process.env.ETH_NODE_RINKEBY || 'http://localhost:8546'

const ethereumNodes = {
  '1': {
    web3: new Web3(new Web3.providers.HttpProvider(ETH_NODE_MAIN))
  },
  '4': {
    web3: new Web3(new Web3.providers.HttpProvider(ETH_NODE_RINKEBY))
  }
}


const mainAddresses = []

addressesToWatch.forEach(function(addressToWatch) {
  if(addressToWatch.networkId === ETH_NETWORK_MAIN)
    mainAddresses.push(addressToWatch.toAddress)
})

const rinkebyAddresses = []
addressesToWatch.forEach(function(addressToWatch) {
  if(addressToWatch.networkId === ETH_NETWORK_RINKEBY)
    rinkebyAddresses.push(addressToWatch.toAddress)
})


ethereumNodes[ETH_NETWORK_MAIN].chainsaw = new Chainsaw(ethereumNodes[ETH_NETWORK_MAIN].web3, mainAddresses)
ethereumNodes[ETH_NETWORK_RINKEBY].chainsaw = new Chainsaw(ethereumNodes[ETH_NETWORK_RINKEBY].web3, rinkebyAddresses)

for(let networkId in ethereumNodes) {
  const network = ethereumNodes[networkId]

  // The polling method of event listening
  const eventCallBack = (error, eventData) => {
    if (error || !eventData.length)
      return

    console.log('event occurred involving address', address, 'event data:')
    console.log(JSON.stringify(eventData))

    // fire webhooks for all matching addresses
    addressesToWatch.forEach(function(a) {
      if(a.networkId !== networkId)
        return
      if(a.toAddress !== eventData[0][0].receiver)
        return

      console.log('firing postback to ', address.postbackURL)
      try {
        fetch(address.postbackURL, { method: 'POST', body: JSON.stringify(eventData) })
      } catch(er){
        console.log(`https POST request to webhook at ${address.postbackURL} failed. er:`, er)
      }
    })
  }

  network.chainsaw.turnOnPolling(eventCallBack)
}
