### Chrome

Run the tests with Chrome:

```sh
docker-compose run --rm wdio [conf/chrome.js]
```

Connect to Chrome via VNC:

```sh
open vnc://user:secret@localhost:5900
```

**Please Note:**  
To be able to see Chrome running via VNC or screen recordings, disable headless
mode in [../conf/chrome.js](../conf/chrome.js).
