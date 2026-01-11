pipeline {
  agent any

  environment {
    REGION     = "us-east-1"
    ACCOUNT_ID = "194273216057"
    ECR_REPO   = "mynodeapp"
    IMAGE_URI  = "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO}"
    APP_NAME   = "nodeapp"
    DEPLOYMENT = "nodeapp-deploy"
    SERVICE    = "nodeapp-service"
    NAMESPACE  = "default"
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

    stage('Create Deployment if Not Exists') {
      steps {
        sh '''
        kubectl get deployment $DEPLOYMENT -n $NAMESPACE \
        || kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $DEPLOYMENT
  namespace: $NAMESPACE
spec:
  replicas: 2
  selector:
    matchLabels:
      app: $APP_NAME
  template:
    metadata:
      labels:
        app: $APP_NAME
    spec:
      containers:
      - name: $APP_NAME
        image: $IMAGE_URI:${BUILD_NUMBER}
        ports:
        - containerPort: 3000
EOF
        '''
      }
    }

    stage('Create Service if Not Exists') {
      steps {
        sh '''
        kubectl get service $SERVICE -n $NAMESPACE \
        || kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: nodeapp-service
  namespace: default
spec:
  type: LoadBalancer
  selector:
    app: nodeapp
  ports:
  - port: 80
    targetPort: 3000
EOF
        '''
      }
    }

    stage('Deploy to EKS (Rolling Update)') {
      steps {
        sh '''
        kubectl set image deployment/$DEPLOYMENT \
        $APP_NAME=$IMAGE_URI:${BUILD_NUMBER} \
        -n $NAMESPACE
        '''
      }
    }
  }
}
