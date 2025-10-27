pipeline {
    agent any

    environment {
        IMAGE_NAME = "auralanka-seasonal-products:latest"
        NODE_ENV = "production"
        DOCKERHUB_USER = credentials('dockerhub-username')
        DOCKERHUB_PASS = credentials('dockerhub-password')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/seasonal-products',
                    url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $IMAGE_NAME --file Dockerfile .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                echo "Logging in to Docker Hub..."
                sh '''
                    echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                    docker tag $IMAGE_NAME $DOCKERHUB_USER/$IMAGE_NAME
                    docker push $DOCKERHUB_USER/$IMAGE_NAME
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "Running backend tests..."
                sh '''
                    cd backend
                    npm install
                    nohup node server.js &
                    for i in {1..10}; do
                        curl -f http://localhost:5000 && break
                        echo "Waiting for backend..."
                        sleep 1
                    done
                    pkill node
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
                // Use your actual SSH credential ID
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
            echo '✅ Build, Tests & Deployment Passed!'
        }
        failure {
            echo '❌ Build or Tests Failed!'
        }
        always {
            echo 'Cleaning up temporary SSH keys...'
            sh 'rm -rf $WORKSPACE/.ssh || true'
        }
    }
}
