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
                script {
                    docker.build("${IMAGE_NAME}", "--file Dockerfile .")
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo "Running backend tests inside Docker container..."
                script {
                    docker.image("${IMAGE_NAME}").inside('-u root -p 5000:5000') {
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
                sshagent(['auralanka-vm-key']) {  // <-- Updated ID here
                    sh '''
                        cd ansible
                        ansible-playbook -i hosts.ini deploy.yml
                    '''
                }
                echo "✅ Deployment completed successfully!"
            }
        }
    }

    post {
        success {
            echo '✅ Build, Tests & Deployment Passed!'
        }
        failure {
            echo '❌ Build, Tests, or Deployment failed!'
        }
    }
}
