# ethereum-watch

watch ethereum contract events and fire webhooks


## installation

```bash
cd ops
./service-install.sh
```


Here's the output from puchasing a token
```bash
event occured involving address 0xec91feb6edcff328e24376e0abd08812d305073e event data:
[ [ { name: 'Transfer',
      events: [Array],
      address: '0xec91feb6edcff328e24376e0abd08812d305073e',
      logIndex: 0,
      blockHash: '0xdaa8b31217c3fe9015f5cd1357076958116b0027fb0eb99215c391ae4af752b6',
      blockNumber: 2031471,
      contractAddress: '0xec91feb6edcff328e24376e0abd08812d305073e',
      sender: '0x69117dc22d8154a28e42b94dd9d2cbcb564639ef',
      receiver: '0xec91feb6edcff328e24376e0abd08812d305073e',
      eventType: 'Transfer',
      fields: [Array],
      ts: 1522542107 } ] ]
```

## notes and links
https://medium.com/mercuryprotocol/how-to-run-an-ethereum-node-on-aws-a8774ed3acf6
