# aws --profile=${profile} ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${account}.dkr.ecr.eu-west-1.amazonaws.com
# docker build -t ${account}.dkr.ecr.eu-west-1.amazonaws.com/logto:latest .
# docker push ${account}.dkr.ecr.eu-west-1.amazonaws.com/logto:latest
# https://github.com/Zerve-AI/zerve-platform/blob/master/helm-charts/logto/values.yaml#L3

FROM svhd/logto:1.37

COPY ./dist/ /etc/logto/packages/experience/dist
