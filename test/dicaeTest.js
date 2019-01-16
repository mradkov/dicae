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
const Ae = require('@aeternity/aepp-sdk').Universal;
const Crypto = require('@aeternity/aepp-sdk').Crypto;

const config = {
  host: "http://localhost:3001/",
  internalHost: "http://localhost:3001/internal/",
  contractSourcePath: "./contracts/Dicae.aes",
  gas: 200000,
  ttl: 55
}

describe('Dicae Contract', () => {

  let owner;
  let nonOwner;
  let contractSource;
  let compiledContract;
  let contractInstance;

  before(async () => {
    owner = await Ae({
      url: config.host,
      internalUrl: config.internalHost,
      keypair: {
        publicKey: "ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU",
        secretKey: "bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca"
      },
      nativeMode: true,
      networkId: 'ae_devnet'
    });

    nonOwner = await Ae({
      url: config.host,
      internalUrl: config.internalHost,
      keypair: wallets[1],
      nativeMode: true,
      networkId: 'ae_devnet'
    });

    // Read the source file
    contractSource = utils.readFileRelative(config.contractSourcePath, "utf-8");
    compiledContract = await owner.contractCompile(contractSource, { // Compile it
      gas: config.gas
    })

    contractInstance = await compiledContract.deploy({ // Deploy it
      options: {
        ttl: config.ttl,
      },
      abi: "sophia"
    });
  })

  it('Deploying Dicae Contract', async () => {
    assert(contractInstance, 'Could not deploy the Dicae Smart Contract'); // Check it is deployed
  })

  it('should place bet correctly', async () => {
    let number = 5;
    
    const bet = await owner.contractCall(compiledContract.bytecode, 'sophia', contractInstance.address, "bet", {
      args: `(${number})`,
      options: {
        amount: 1000000000000000000,
        ttl: config.ttl
      },
      abi: "sophia"
    })

    const betResult = await bet.decode('bool');
    assert.equal(betResult.value, true, "It doesnt bet properly");
  })

})