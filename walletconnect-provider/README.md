# walletconnect-provider

WalletConnect provider to connect Matic Network

### Installation

```bash
$ npm install --save @maticnetwork/walletconnect-provider
```

### Usage

Create network providers by instantiating provider objects.

```js
import WalletConnectProvider from "@maticnetwork/walletconnect-provider"

// ropsten provider
const ropstenProvider = new WalletConnectProvider({
  host: "https://ropsten.infura.io/v3/<your-infura-api-key>",
  callbacks: {
    onConnect: () => {
      // connected
    },
    onDisconnect: () => {}
  }
})

// createm matic testnet provider
const maticTestnetProvider = new WalletConnectProvider({
  host: "https://testnet2.matic.network",
  onConnect: () => {
    // connected
  },
  onDisconnect: () => {}
})
```

### License

MIT
