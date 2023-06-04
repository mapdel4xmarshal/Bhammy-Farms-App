  #!/bin/bash

sudo /opt/bitnami/ctlscript.sh stop nginx
sudo /opt/bitnami/letsencrypt/lego --tls --email="bhammyfarms@gmail.com" --domains="bhammyfarms.com" --path="/opt/bitnami/letsencrypt" renew --days 90
sudo /opt/bitnami/ctlscript.sh start nginx