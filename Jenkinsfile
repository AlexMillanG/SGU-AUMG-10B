pipeline {
    agent any
    
    stages {
        stage('Verificar Docker') {
            steps {
                bat '''
                    docker --version || echo Docker no está disponible
                '''
            }
        }

        stage('Parando los servicios...') {
            steps {
                bat ''' 
                    docker compose -p SGU-IYRB-10B down || exit /b 0
                '''
            }
        }

        stage('Eliminando las imágenes anteriores...') {
            steps {
                powershell '''
                    $images = docker images --filter "label=com.docker.compose.project=SGU-AUMG-10B" -q
                    if ($images) {
                        docker rmi -f $images
                    } else {
                        Write-Host "No hay imágenes por eliminar"
                    }
                '''
            }
        }

        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando servicios...') {
            steps {
                bat '''
                    docker compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con exito'
        }
        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }
        always {
            echo 'Pipeline finalizado'
        }
    }
}