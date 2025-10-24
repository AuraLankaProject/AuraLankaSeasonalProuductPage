pipeline {
    agent any

    environment {
        IMAGE_NAME = 'auralanka-seasonal-products:latest'
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/seasonal-products', url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    docker.build(IMAGE_NAME, './')
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                script {
                    echo "Running backend tests inside Docker container..."
                    docker.image(IMAGE_NAME).inside("-p 5000:5000") {
                        sh '''
                            # Example backend test command, replace with actual tests
                            echo "Running backend tests..."
                            node backend/server.js &
                            sleep 5
                            curl -f http://localhost:5000 || exit 1
                            pkill node
                        '''
                    }
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                script {
                    echo "Running frontend tests inside Docker container..."
                    docker.image(IMAGE_NAME).inside("-p 5000:5000") {
                        sh '''
                            # Example frontend check, replace with actual frontend test commands
                            echo "Checking frontend availability..."
                            curl -f http://localhost:5000 || exit 1
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI Pipeline completed successfully!'
        }
        failure {
            echo '❌ Build or tests failed. Check console output!'
        }
    }
}
