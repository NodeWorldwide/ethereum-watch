'use strict'

const delay      = require('delay')
const abiDecoder = require('abi-decoder')


// this logic is based on the chainsaw npm package but simplified
module.exports = function chainsaw(options={}) {
  const { web3, contractAddresses } = options
  const pollingInterval = options.pollingInterval || 1000

  const eth = web3.eth

  console.log('eth.syncing:', eth.syncing)
  console.log('blockNumber:', eth.blockNumber)//, eth.getBlock('2003471'))

  let lastReadBlockNumber = eth.blockNumber
  let isPolling = false


  const turnOnPolling = function(handler) {
    if(isPolling)
      return

    isPolling = true
    setTimeout(runPolling, 0, handler)
  }


  const turnOffPolling = function() {
    isPolling = false
  }


  const runPolling = async function(handler) {
    while(isPolling) {

      let blockNumber = eth.blockNumber

      //console.log('erp,', lastReadBlockNumber, blockNumber)
      // process all new blocks
      if(lastReadBlockNumber < blockNumber) {
        console.log('new blocks!', lastReadBlockNumber, blockNumber)
        let logs = await getLogs(lastReadBlockNumber, eth.blockNumber)
        console.log('read', logs.length, 'logs')
        if(logs.length)
          handler(null, logs)

        lastReadBlockNumber = blockNumber
      }

      await delay(pollingInterval)
    }
  }

  // Given an startBlock and endBlock range, decoded logs are returned.
  //
  // @param startBlock: Starting block to read the block.
  // @param endBlock: End block to read the block.
  const getLogs = async function(startBlock, endBlock) {
    if (startBlock > eth.blockNumer || startBlock < 0)
      throw new Error('Invalid startBlock: Must be below web3.eth.blockNumber or startBlock cannot be below 0')

    if (startBlock > endBlock)
      throw new Error('Invalid startBlock: Must be below endBlock')

    if (endBlock > eth.blockNumber)
      throw new Error('Invalid endBlock: Must be less than or equal to latest block')

    let logs = []

    for (let i = startBlock; i <= endBlock; i++) {
      const logsInTheBlock = getLogsByBlockNumber(i)
      let transactionIndex = 0
      logs.push(logsInTheBlock.map(log => {
        log = log.filter(a => contractAddresses.indexOf(a.address) >= 0)


        let decodedLogs = abiDecoder.decodeLogs(log)
        // Formating decoded logs to add extra data needed.
        decodedLogs = decodedLogs.map((dLog, i) => {
          return constructLogs(dLog, i, transactionIndex, log, logsInTheBlock)
        })

        transactionIndex += 1
        return decodedLogs
      }).filter(a => a.length > 0))
    }

    // Flatten the logs array
    logs = logs.reduce((prev, curr) => {
      return prev.concat(curr)
    }, []).filter(a => a.length > 0)

    return logs
  }

  const constructLogs  = function(dLog, i, transactionIndex, decodedLogs, logsInTheBlock) {
    dLog['logIndex'] = decodedLogs[i]['logIndex']
    dLog['blockHash'] = decodedLogs[i]['blockHash']
    dLog['blockNumber'] = decodedLogs[i]['blockNumber']
    dLog['contractAddress'] = decodedLogs[i]['address']
    dLog['sender'] = logsInTheBlock[transactionIndex]['sender']
    dLog['receiver'] = logsInTheBlock[transactionIndex]['receiver']
    dLog['eventType'] = dLog['name']
    dLog['fields'] = dLog['events']
    dLog['ts'] = logsInTheBlock[transactionIndex]['timestamp']
    return dLog
  }

  // Given the blocknumber return the array of logs for each transaction.
  //
  // @param blockNumber -> Block: [ txHash1, txHash2] -> Logs: [logs1, logs2]
  const getLogsByBlockNumber = function(blockNumber) {
    if (blockNumber < 0 || blockNumber > eth.blockNumber)
      throw new Error('Invalid blockNumber : blockNumber should be greater than zero and less than latestBlock.')

    const block = eth.getBlock(blockNumber)
    if(!block || !block.hash)
      return []

    const transactionHashes = block['transactions']
    return transactionHashes.map(tx => {
      // We need to get the transactions sender and receiver
      let transactionData = eth.getTransaction(tx)
      // If no logs for a transaction it is omitted
      let receipt = eth.getTransactionReceipt(tx)
      if (receipt && receipt['logs']) {
        receipt['logs']['timestamp'] = block['timestamp']
        receipt['logs']['sender'] = transactionData['from']
        receipt['logs']['receiver'] = transactionData['to']
        return receipt['logs']
      }
    }).filter(a => a.length > 0)
  }


  return { turnOnPolling, turnOffPolling }
}
