export PROJECT_ID=w3balance-backend-gcp-6920
gcloud config set project w3balance-backend-gcp-6920

apps="webhook trpc"
for app in $apps
do 
cd apps/$app
    yarn build:deploy
    cd ../../
done
