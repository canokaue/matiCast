<img src="img/matic-min.png" align="right"/>

# matiCast

> DIY Hardware NFT Art Display using Matic Network 🧥 🗄️ 👊


#### Dependencies
* matic-cli
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

### Configureye

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