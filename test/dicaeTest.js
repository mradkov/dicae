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
import {encodeBase58Check, encodeUnsigned, hash} from "@aeternity/aepp-sdk/es/utils/crypto";

const Universal = require('@aeternity/aepp-sdk').Universal;
const Bytes = require('@aeternity/aepp-sdk/es/utils/bytes');
const Crypto = require('@aeternity/aepp-sdk').Crypto;
const blake2b = require('blake2b');
const BN = require('bn.js');

const Deployer = require('aeproject-lib').Deployer;
const migrationSource = utils.readFileRelative('./contracts/Dicae.aes', 'utf-8');


const config = {
    host: 'http://localhost:3001/',
    internalHost: 'http://localhost:3001/internal/',
    compilerUrl: 'http://localhost:3080'
};

describe('Dicae Contract', () => {

    let ownerKeypair, ownerClient, secondKeypair, secondClient, thirdKeypair;
    let contractInstance;

    before(async () => {
        ownerKeypair = wallets[0];
        secondKeypair = wallets[1];
        thirdKeypair = wallets[2];
        ownerClient = await Universal({
            url: config.host,
            internalUrl: config.internalHost,
            keypair: ownerKeypair,
            nativeMode: true,
            networkId: 'ae_devnet',
            compilerUrl: config.compilerUrl
        });
    });

    const hashTopic = topic => blake2b(32).update(Buffer.from(topic)).digest('hex');
    const topicHashFromResult = result => Bytes.toBytes(result.result.log[0].topics[0], true).toString('hex');

    const eventArgument = (result, index) => result.result.log[0].topics[index + 1];
    const encodeEventAddress = (result, index, prefix) => `${prefix}${Crypto.encodeBase58Check(new BN(result.result.log[0].topics[index + 1]).toBuffer('be', 32))}`;

    it('Deploying Migration', async () => {
        contractInstance = await ownerClient.getContractInstance(migrationSource);
        const init = await contractInstance.methods.init();
        assert.equal(init.result.returnType, 'ok');
    });
    
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