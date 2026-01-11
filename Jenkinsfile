pipeline {
  agent any

  environment {
    REGION     = "us-east-1"
    ACCOUNT_ID = "194273216057"
    ECR_REPO   = "mynodeapp"
    IMAGE_URI  = "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO}"
  }

  stages {

    stage('Ensure ECR Repository') {
      steps {
        sh '''
        aws ecr describe-repositories \
          --repository-names $ECR_REPO \
          --region $REGION \
        || aws ecr create-repository \
          --repository-name $ECR_REPO \
          --region $REGION
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t mynodeapp:${BUILD_NUMBER} mynodeapp'
      }
    }

    stage('Login to ECR') {
      steps {
        sh '''
        aws ecr get-login-password --region $REGION | \
        docker login --username AWS --password-stdin $IMAGE_URI
        '''
      }
    }

    stage('Push Image to ECR') {
      steps {
        sh '''
        docker tag mynodeapp:${BUILD_NUMBER} $IMAGE_URI:${BUILD_NUMBER}
        docker push $IMAGE_URI:${BUILD_NUMBER}
        '''
      }
    }

    stage('Deploy to EKS') {
      steps {
        sh '''
        kubectl get deployments
        kubectl set image deployment/nodeapp-deploy \
        nodeapp=$IMAGE_URI:${BUILD_NUMBER}
        '''
      }
    }
  }
}
