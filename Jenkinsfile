// ─── Jenkinsfile ────────────────────────────────────────────────────────────────────
pipeline {
    agent any

    environment {
        // adjust these
        DOCKER_IMAGE      = 'fundflow-ui'
        DOCKER_CONTAINER  = 'fundflow-ui-container'
        SERVER_IP         = '65.20.85.208'
        SSH_CREDENTIALS   = '9e9a4819-6f54-4c0b-b62a-36b6dd011583'
        GIT_CREDENTIALS   = 'github-credentials'
        GIT_BRANCH        = 'developer'
        GIT_REPO          = 'git@github.com:soulsrfer/fundflow-UI.git'
        REGISTRY_URL      = 'docker.io/soulsrfer'                        // e.g. docker.io/your-org
        HOST_PORT        = '4200' // Port on the host machine
        CONTAINER_PORT    = '4000'   // Port inside the container
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning UI repository...'
                git credentialsId: GIT_CREDENTIALS, branch: GIT_BRANCH, url: GIT_REPO
            }
        }

        stage('Install & Build') {
            steps {
                echo 'Installing NPM dependencies and building Angular app...'
                sh 'npm ci'
                sh 'npm run build:ssr'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // if using a registry: "${REGISTRY_URL}/${DOCKER_IMAGE}:latest"
                    sh "docker build -t ${REGISTRY_URL}/${DOCKER_IMAGE}:latest -f Dockerfile ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                    echo "Tagging the Docker image as soulsrfer/${DOCKER_IMAGE}:latest"
                    sh "docker tag ${REGISTRY_URL}/${DOCKER_IMAGE}:latest ${REGISTRY_URL}/${DOCKER_IMAGE}:latest"

                    echo 'Pushing the Docker image to Docker Hub...'
                    sh "docker push ${REGISTRY_URL}/${DOCKER_IMAGE}:latest"

                    echo 'Verifying Docker image was pushed...'
                    sh "docker images | grep ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                withCredentials([
            sshUserPrivateKey(
                credentialsId: "${SSH_CREDENTIALS}",
                keyFileVariable: 'SSH_KEY'
            )
        ]) {
                    script {
                        // 1. Test SSH connection
                        sh '''
                    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" soulsrfer@${SERVER_IP} \
                    'echo SSH connection successful for UI deploy!'
                '''

                        // 2. Deploy UI Docker container
                        sh """
                    ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" soulsrfer@${SERVER_IP} \\
                      "docker pull ${REGISTRY_URL}/${DOCKER_IMAGE}:latest && \\
                       docker stop ${DOCKER_CONTAINER} || true && \\
                       docker rm ${DOCKER_CONTAINER} || true && \\
                       docker run -d --name ${DOCKER_CONTAINER} -p ${HOST_PORT}:${CONTAINER_PORT} \\
                         ${REGISTRY_URL}/${DOCKER_IMAGE}:latest"
                """

                        // now verify while the key is still injected:
                        sh """
          ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" \
            soulsrfer@${SERVER_IP} \\
            'curl -s -o /dev/null -w "%{http_code}" http://localhost:${HOST_PORT}'
        """
                    }
        }
            }
        }
    }

    post {
        success {
            echo 'UI build & deployment succeeded!'
        }
        failure {
            echo 'Something went wrong. Please check the logs.'
        }
    }
}
