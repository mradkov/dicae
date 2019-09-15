/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */
const path = require('path');
const chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

const AeSDK = require('@aeternity/aepp-sdk');
const Universal = AeSDK.Universal;
const config = require("./constants/config.json")
const utils = require('./utils/utils');

const CONTRACT_FILE_PATH = "./../contracts/Dicae.aes";
const getClient = utils.getClient;

const contentOfContract = utils.readFileRelative(path.resolve(__dirname, CONTRACT_FILE_PATH), config.filesEncoding);

describe('Dicae Contract', async () => {

  let contractInstance;

  beforeEach(async () => {
      let client = await getClient(Universal, config, config.ownerKeyPair);

      contractInstance = await client.getContractInstance(contentOfContract);
      await contractInstance.deploy([]);
  });

  it('Deploying Dicae Contract', async () => {
    assert(contractInstance, 'Could not deploy the Dicae Smart Contract'); // Check it is deployed
  })

  it('should place bet correctly', async () => {
    let number = 5;

    const result = await contractInstance.methods.bet(number);
    assert.ok(result.decodedResult, "It doesnt bet properly");
  })

  it('should return random number between 1 and 6', async () => {
    let possibleOutputs = [0,1,2,3,4,5];

    const result = await contractInstance.methods.get_random();
    assert.equal(possibleOutputs.indexOf(result.decodedResult) > -1, true, "It doesnt return random number between 1 and 6");
  })

})