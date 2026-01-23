set -e

APP_NAME=myapp
VERSION=INSECURE

docker rm -rf $APP_NAME 2>/dev/null || true
docker build -t $APP_NAME:$VERSION .

docker scout cves $APP_NAME:$VERSION --output ../docs/vulns.report
docker scout cves $APP_NAME:$VERSION --only-severity critical --exit-code
docker scout sbom --output ../docs/$APP_NAME.sbom $APP_NAME:$VERSION

docker run -d -p 5173:5173 --name myapp $APP_NAME:$VERSION