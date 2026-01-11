pipeline {
  agent any

  environment {
    REGION = "us-east-1"
    ACCOUNT_ID = "194273216057"
    ECR_REPO = "mynodeapp"
    IMAGE_URI = "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO}"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/yourrepo/mynodeapp.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t mynodeapp:${BUILD_NUMBER} .'
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

    stage('Push Image') {
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
        kubectl set image deployment/nodeapp \
        nodeapp=$IMAGE_URI:${BUILD_NUMBER}
        '''
      }
    }
  }
}
