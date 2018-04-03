'use strict'

const Chainsaw = require('eth-chainsaw').Chainsaw
const Web3     = require('web3')
const dotenv   = require('dotenv').config()
const fetch    = require('node-fetch')


const ETH_NETWORK_MAIN = 1
const ETH_NETWORK_RINKEBY = 4

const ETH_NODE_MAIN = process.env.ETH_NODE_MAIN || 'http://localhost:8545'
const ETH_NODE_RINKEBY = process.env.ETH_NODE_RINKEBY || 'http://localhost:8546'

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


function watchNetwork(networkId, eth_node_address, addresses) {
  const filtered = []

  addresses.forEach(function(addressToWatch) {
    if(addressToWatch.networkId === networkId)
      filtered.push(addressToWatch.toAddress)
  })

  if(!filtered.length)
    return

  const web3 = new Web3(new Web3.providers.HttpProvider(eth_node_address))
  const chainsaw = new Chainsaw(web3, filtered)

  // The polling method of event listening
  const eventCallBack = (error, eventData) => {
    if (error || !eventData.length)
      return

    console.log(networkId, 'event occurred. event data:')
    console.log(JSON.stringify(eventData))

    // fire webhooks for all matching addresses
    addresses.forEach(function(a) {
      if(a.networkId !== networkId)
        return
      if(a.toAddress !== eventData[0][0].receiver)
        return

      console.log(networkId, 'firing postback to ', a.postbackURL)
      try {
        fetch(a.postbackURL, { method: 'POST', body: JSON.stringify(eventData) })
      } catch(er){
        console.log(`network: ${networkId} https POST request to webhook at ${a.postbackURL} failed. er:`, er)
      }
    })
  }

  chainsaw.turnOnPolling(eventCallBack)
}


watchNetwork(ETH_NETWORK_MAIN, ETH_NODE_MAIN, addressesToWatch)
watchNetwork(ETH_NETWORK_RINKEBY, ETH_NODE_RINKEBY, addressesToWatch)
