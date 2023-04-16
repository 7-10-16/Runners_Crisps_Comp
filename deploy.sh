#!/bin/bash

# Set variables
AWS_REGION="your-region"
PRESENTATION_ECR_REPO_NAME="your-presentation-repo-name"
BUSINESS_ECR_REPO_NAME="your-business-repo-name"
CFN_STACK_NAME="your-stack-name"
CFN_TEMPLATE_PATH="your-cfn-template-path"

# Get the AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

# Create ECR repositories for presentation and business tiers if they don't exist
aws ecr describe-repositories --repository-names $PRESENTATION_ECR_REPO_NAME --region $AWS_REGION > /dev/null 2>&1 || aws ecr create-repository --repository-name $PRESENTATION_ECR_REPO_NAME --region $AWS_REGION
aws ecr describe-repositories --repository-names $BUSINESS_ECR_REPO_NAME --region $AWS_REGION > /dev/null 2>&1 || aws ecr create-repository --repository-name $BUSINESS_ECR_REPO_NAME --region $AWS_REGION

# Generate a unique S3 bucket name
S3_BUCKET_NAME="${CFN_STACK_NAME}-$(date +%Y%m%d%H%M%S)"

# Create an S3 bucket
aws s3api create-bucket --bucket $S3_BUCKET_NAME --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION

# Change directory to presentation tier folder, build the Docker image, tag it, and push it to ECR
cd presentation_tier
docker build -t $PRESENTATION_ECR_REPO_NAME .
docker tag $PRESENTATION_ECR_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PRESENTATION_ECR_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PRESENTATION_ECR_REPO_NAME:latest
cd ..

# Change directory to business tier folder, build the Docker image, tag it, and push it to ECR
cd business_tier
docker build -t $BUSINESS_ECR_REPO_NAME .
docker tag $BUSINESS_ECR_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BUSINESS_ECR_REPO_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BUSINESS_ECR_REPO_NAME:latest
cd ..

# Package the CloudFormation template
aws cloudformation package --template-file $CFN_TEMPLATE_PATH --s3-bucket $S3_BUCKET

# Deploy the CloudFormation stack
aws cloudformation deploy --template-file packaged-stack.yaml --stack-name $CFN_STACK_NAME --capabilities CAPABILITY_NAMED_IAM
