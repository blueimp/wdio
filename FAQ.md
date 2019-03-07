# FAQ

- [Privileged ports on Docker for Mac](#privileged-ports-on-docker-for-mac)

## Privileged ports on Docker for Mac
There is an
[issue](https://github.com/moby/vpnkit/issues/92) with the MacOS firewall and
Docker that prevents accessing privileged ports (`< 1024`) from outside of the
Docker host if the firewall is turned on, despite allowing incoming connections.

As a workaround, we can use the MacOS built-in packet filter (`pf`) to forward
privileged ports to non-privileged ports on the host with the use of a helper
script:
```sh
bin/forward-ports.sh [[nic:]port=[ip:]port [...]]
```

If no network interface is given, forwards from all interfaces.  
**This is not recommended on a public network.**

If no IP is given, forwards to `localhost` (`127.0.0.1`).

e.g. the following command forwards ports `80` and `443` on the network
interface `vnic0` to ports `8080` and `8443` on `localhost` respectively:
```sh
bin/forward-ports.sh vnic0:80=8080 vnic0:443=8443
```

To display a list of available network interfaces, run the following command:
```sh
ifconfig
```

To reset to the original packet filter rules, simply run the helper script
without arguments:
```sh
bin/forward-ports.sh
```
Please note that the helper script forwarding rules are only loaded in-memory
and will be reset after a restart.
