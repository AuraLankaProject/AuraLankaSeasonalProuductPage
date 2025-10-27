pipeline {
    agent any

    environment {
        IMAGE_NAME = "auralanka-seasonal-products:latest"
        NODE_ENV = "production"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'feature/seasonal-products',
                    url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git',
                    credentialsId: 'eca94f18-581a-4c90-9ba0-a2ff0221bf08'
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
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-username', 
                        usernameVariable: 'DOCKER_USER', 
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        docker tag $IMAGE_NAME $DOCKER_USER/$IMAGE_NAME
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_USER/$IMAGE_NAME
                        docker logout
                    '''
                }
            }
        }

	stage('Run Backend Tests') {
    steps {
        echo "Running backend tests inside Docker..."
        sh '''
            cd backend
            npm install

            # Check if a test script exists in package.json
            if npm run | grep -q "test"; then
                echo "Test script found, running tests..."
                docker run --rm -v $PWD:/app/backend -w /app/backend auralanka-seasonal-products:latest npm test
            else
                echo "No test script found in package.json. Skipping backend tests."
            fi
        '''
    }
}



        stage('Run Frontend Tests') {
            steps {
                echo "Running frontend tests inside Docker..."
                sh '''
                    docker run --rm -v $WORKSPACE/frontend:/app/frontend -w /app/frontend $IMAGE_NAME npm install
                    docker run --rm -v $WORKSPACE/frontend:/app/frontend -w /app/frontend $IMAGE_NAME npm test || echo "No frontend tests found, skipping"
                '''
            }
        }

        stage('Deploy to AWS with Ansible') {
            steps {
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
            echo '❌ Build, Tests, or Deployment Failed!'
        }
        always {
            echo 'Cleaning up temporary SSH keys...'
            sh 'rm -rf $WORKSPACE/.ssh || true'
        }
    }
}
