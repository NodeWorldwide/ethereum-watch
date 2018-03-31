#!/bin/bash

sudo apt-get update

# install node/npm dependency
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install --assume-yes nodejs build-essential

# install geth client depedency
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum

# setup the 2 systemd services

sudo cp geth.service /lib/systemd/system/
sudo chmod 664 /lib/systemd/system/geth.service

sudo cp ethereum-watch.service /lib/systemd/system/
sudo chmod 664 /lib/systemd/system/ethereum-watch.service

sudo cp logrotate /etc/logrotate.d/ethereum-watch

sudo systemctl daemon-reload

sudo systemctl enable geth.service
sudo systemctl start geth.service

sudo systemctl enable ethereum-watch.service
sudo systemctl start ethereum-watch.service
