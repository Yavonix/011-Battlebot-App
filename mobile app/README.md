### Quickstart

Install dependencies

```bash
npm install
```

Install ionic tooling

```bash
npm install -g @ionic/cli native-run cordova-res
```

Now run the development server:

```bash
ionic serve
```

Now view the app in your web browser on `localhost:8100`

If you want to connect to a local BattleBot server instance I suggest changing:

```const config: SocketIoConfig = { url: 'http://192.168.1.17:9999', options: {} };```

To:

```const config: SocketIoConfig = { url: 'localhost:9999', options: {} };```

Under:

`011-Battlebot-App/mobile app/src/app/app.module.ts`

For build instructions please see [here](https://ionicframework.com/docs/developing/android).
