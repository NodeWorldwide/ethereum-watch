# ethereum-watch

watch ethereum contract events and fire webhooks


## installation

```bash
cd ops
./service-install.sh
```


Here's an example event that fires when purchasing a token
```javascript
[
  [{
    "name": "Transfer",
    "events": [{
      "name": "from",
      "type": "address",
      "value": "0x0000000000000000000000000000000000000000"
    }, {
      "name": "to",
      "type": "address",
      "value": "0x69117dc22d8154a28e42b94dd9d2cbcb564639ef"
    }, {
      "name": "assetId",
      "type": "uint256",
      "value": "106426312931277267304608430754406144260365593437795917950666279101627564215339"
    }, {
      "name": "operator",
      "type": "address",
      "value": "0x69117dc22d8154a28e42b94dd9d2cbcb564639ef"
    }, {
      "name": "userData",
      "type": "bytes",
      "value": "0x"
    }],
    "address": "0xec91feb6edcff328e24376e0abd08812d305073e",
    "logIndex": 1,
    "blockHash": "0xf15589e41496005f1869385f0eece67d5984fd7a5a348b42dd7594461afac887",
    "blockNumber": 2031549,
    "contractAddress": "0xec91feb6edcff328e24376e0abd08812d305073e",
    "sender": "0x69117dc22d8154a28e42b94dd9d2cbcb564639ef",
    "receiver": "0xec91feb6edcff328e24376e0abd08812d305073e",
    "eventType": "Transfer",
    "fields": [{
      "name": "from",
      "type": "address",
      "value": "0x0000000000000000000000000000000000000000"
    }, {
      "name": "to",
      "type": "address",
      "value": "0x69117dc22d8154a28e42b94dd9d2cbcb564639ef"
    }, {
      "name": "assetId",
      "type": "uint256",
      "value": "106426312931277267304608430754406144260365593437795917950666279101627564215339"
    }, {
      "name": "operator",
      "type": "address",
      "value": "0x69117dc22d8154a28e42b94dd9d2cbcb564639ef"
    }, {
      "name": "userData",
      "type": "bytes",
      "value": "0x"
    }],
    "ts": 1522543277
  }]
]
```

## notes and links
https://medium.com/mercuryprotocol/how-to-run-an-ethereum-node-on-aws-a8774ed3acf6

https://ethereum.stackexchange.com/questions/7006/how-to-run-two-nodes-on-the-same-device
