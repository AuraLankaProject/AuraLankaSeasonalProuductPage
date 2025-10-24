pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/seasonal-products', 
                    url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("auralanka-seasonal-products:latest", ".")
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'echo "Running unit and integration tests..."'
                // Replace with actual test commands if available
            }
        }
    }

    post {
        success {
            echo '✅ Build and tests completed successfully!'
        }
        failure {
            echo '❌ Build or tests failed.'
        }
    }
}
