# aws --profile=${profile} ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${account}.dkr.ecr.eu-west-1.amazonaws.com
# docker buildx build --platform linux/amd64,linux/arm64 -t 780139020131.dkr.ecr.eu-west-1.amazonaws.com/logto:X.X.X --push .
# https://github.com/Zerve-AI/zerve-platform/blob/master/helm-charts/logto/values.yaml#L3

FROM svhd/logto:1.37

COPY ./dist/ /etc/logto/packages/experience/dist
