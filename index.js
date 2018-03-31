'use strict'

const Chainsaw = require('eth-chainsaw').Chainsaw
const Web3     = require('web3')
const dotenv   = require('dotenv').config()
const fetch    = require('node-fetch')
const fs       = require('fs')


const ETH_NODE = process.env.ETH_NODE || 'http://localhost:8545'
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE))

const addresses = []
const abis = []


function watchContract(filename) {
  try {
    let contr = fs.readFileSync(__dirname + `/contracts/${filename}`)
    contr = JSON.parse(contr)
    addresses.push(contr.networks['4'].address)
    abis.push(contr.abi)
  } catch(er) {
    console.error('failed to parse contract abi. ensure it is built and try again')
    process.exit(1)
  }
}


const files = fs.readdirSync(__dirname + '/contracts/')
files.forEach(function(filename) {
  watchContract(filename)
})

console.log('watching contract addresses:', addresses)

const chainsaw = new Chainsaw(web3, addresses)


addresses.forEach(function(address, idx) {
  const abi = abis[idx]
  const contractInstance = web3.eth.contract(abi).at(address)
  chainsaw.addABI(abi)

  // The polling method of event listening

  // const eventCallBack = (error, eventData) => {
  //   if (!error && eventData.length > 0) {
  //     const args = eventData[0][1].fields

  //     console.log(`Address of who called: ${args[0].value},
  //                 placeData: ${args[1].value},
  //                 assetId: ${args[2].value}`);
  //   }
  // }
  // chainsaw.turnOnPolling(eventCallBack)

  // triggered every time somebody calls the claim method on the contract
  contractInstance.Claimed().watch((err, event) => {
    const args = event.args
    console.log(`Address of who called: ${args._claimer},
                 placeData: ${args._placeData},
                 assetId: ${args._assetId.toString(10)}`)

    // TODO: sign body with secret
    // TODO: fire POST request
    //fetch()
  })
})
