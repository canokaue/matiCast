<img src="img/matic-min.png" align="right"/>

# matiCast

> DIY Web + Hardware NFT Art Display using Matic Network 🧥 🗄️ 👊

<img src="example-images/maticast.png" align="center"/>

### What is matiCast?
matiCast is an expansion of codyborn's TokenCast that seamslessly integrates with Matic Network in order to bring more speed, scalabity and efficiency to the NFT-focused project.

### Ok...but what is it for?
You've probably already seen electronic picture frames around you aunt's house or something like that. Think of matiCast as one of those that you can build yourself, using accessible and easy to use electronics, leveraging the power of Ethereum + Matic to display
your digital art NFTs in real time, by simply logging into your account!

### How do I build one display?
You can follow the detailed explanation over at [this link](https://github.com/canokaue/matiCast/blob/master/instructions/index.md).
But this is the recommended display setup:
<img src="example-images/dimensions.PNG" align="center"/>

### Do I need specific hardware to do that?
Nope, all hardware tutorials are suggestions to help you out. You can use alternative material and builds as you wish, and you can leverage the dApp to demo matiCast directy in your browser.

### Am I stuck with the NFT standard view?
Nope, you can even customize how you want to display your NFTs!
<img src="example-images/swatch.PNG" align="center"/>


#### Dev Dependencies
* matic-cli
* node
* solidity 0.4.24
* truffle/remix
* Visual Studio Mac
* authereum account
* dotNET core
* redis-server (running)

### Setup

```bash
git clone https://github.com/canokaue/matiCast
cd matiCast
source install.sh
# if Windows run .exe found in matiCastWebApp/bin or /debug
# depends on you VS build config
# if Mac open VSMac and build locally
```

### Config

Required settings (=example):
* CLIENT = "matiCast0"
* ENVIRONMENT = "stable"
* API_KEY = "1hu8is1278s8da9"
* API_SECRET = "AHNG62SG379F32DSAVWSPFUNDUDZIIFSLJEAIUQUHLCG..."
* TIMEZONE = "America/Sao_Paulo"

Available settings (= std_value):
* SAVE_LOGS = False
* LOG_DIR = "logs/"
* MAX_LOG_SIZE = 100000000 # 100Mb