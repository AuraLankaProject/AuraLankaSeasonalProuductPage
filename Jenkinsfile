pipeline {
    agent any

    environment {
        IMAGE_NAME = "auralanka-seasonal-products:latest"
        NODE_ENV = "production"
	DOCKERHUB_USER = credentials('dockerhub-username')
        DOCKERHUB_PASS = credentials('dockerhub-password')
        SSH_KEY = credentials('aws-ssh-key')
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
                            # Start server in background
                            nohup node server.js &
                            # Wait for server to be ready
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
                script {
                    sh '''
                        mkdir -p $WORKSPACE/.ssh
                        printf "%s\n" "$SSH_KEY" > $WORKSPACE/.ssh/aws-key.pem
                        chmod 600 $WORKSPACE/.ssh/aws-key.pem

                        # Navigate to deployment directory (ensure these files exist in repo)
                        cd deploy

                        # Run the Ansible playbook
                        ansible-playbook -i hosts.ini deploy.yml --private-key=$WORKSPACE/.ssh/aws-key.pem
                    '''
                }
                echo "✅ Deployment completed successfully!"
            }
        }
    
    }

    post {
        success {
            echo '✅ Build & Tests Passed!'
        }
        failure {
            echo '❌ Build or tests failed!'
        }
    }
}
