### simple-container-https-le

A very simple template for IPv6-based microservices that can be directly exposed to the internet without giant piles of proxies and IPv4 copium.

##### So how do I use it?

```shell
cp docker-compose.example.yml docker-compose.yml
$EDITOR docker-compose.yml
# Add relevant AAAA records
yarn install
npx greenlock add --subject my-service.location.yourdomain.com --altnames my-service.location.yourdomain.com
docker-compose up -d
```
