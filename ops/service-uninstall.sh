#!/bin/bash

sudo rm /lib/systemd/system/geth.service
sudo rm /lib/systemd/system/ethereum-watch.service

sudo systemctl daemon-reload

sudo systemctl disable ethereum-watch.service
sudo systemctl stop ethereum-watch.service

sudo systemctl disable geth.service
sudo systemctl stop geth.service

sudo rm /etc/logrotate.d/ethereum-watch
