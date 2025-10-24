pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/seasonal-products', url: 'https://github.com/AuraLankaProject/AuraLankaSeasonalProuductPage.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('auralanka-seasonal-products:latest', './')
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Example: run backend tests
                    docker.image('auralanka-seasonal-products:latest').inside {
                        sh 'echo "Run unit tests here"'
                        // Replace with your actual test commands
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build & Tests Passed!'
        }
        failure {
            echo '❌ Build or tests failed.'
        }
    }
}
