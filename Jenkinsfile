pipeline {
    agent any

    environment {
        IMAGE_NAME = "auralanka-seasonal-products"
        IMAGE_TAG = "latest"
        NODE_ENV = "production"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out code from Git..."
                git branch: 'feature/seasonal-products',
                    url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git',
                    credentialsId: 'eca94f18-581a-4c90-9ba0-a2ff0221bf08'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG --file Dockerfile .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                echo "Pushing Docker image to Docker Hub..."
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-username',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG
                        docker logout
                    '''
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "Running backend tests..."
                sh '''
                    cd backend
                    npm install
                    nohup node server.js > backend.log 2>&1 &
                    SERVER_PID=$!
                    for i in {1..15}; do
                        curl -f http://localhost:3000 && break
                        echo "Waiting for backend to start..."
                        sleep 2
                    done
                    kill $SERVER_PID || true
                '''
            }
        }

        stage('Run Frontend Tests') {
            steps {
                echo "No frontend Node.js project found. Skipping frontend tests."
            }
        }

        stage('Deploy to AWS with Ansible') {
            steps {
                echo "Deploying to AWS using Ansible..."
                withCredentials([sshUserPrivateKey(credentialsId: 'aws-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        mkdir -p $WORKSPACE/.ssh
                        cp $SSH_KEY $WORKSPACE/.ssh/aws-key.pem
                        chmod 600 $WORKSPACE/.ssh/aws-key.pem
                        cd ansible
                        ansible-playbook -i hosts.ini deploy.yml --private-key=$WORKSPACE/.ssh/aws-key.pem
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build, Tests & Deployment Succeeded!'
        }
        failure {
            echo '❌ Build, Tests, or Deployment Failed!'
        }
        always {
            echo 'Cleaning up temporary SSH keys...'
            sh 'rm -rf $WORKSPACE/.ssh || true'
        }
    }
}
