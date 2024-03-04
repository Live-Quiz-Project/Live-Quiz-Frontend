//Define variables
def scmVars

//Start Pipeline
pipeline {
    
  //Configure Jenkins Slave
  agent {
    //Use Kubernetes as dynamic Jenkins Slave
    kubernetes {
      //Kubernetes Manifest File to spin up Pod to do build
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: docker
    image: docker:25.0.3-dind
    command:
      - dockerd
      - --iptables=false
      - --host=unix:///var/run/docker.sock
      - --host=tcp://0.0.0.0:2376
      - --storage-driver=overlay2
    tty: true
    securityContext:
      privileged: true
  - name: node
    image: node:21.6.1
    tty: true
    command:
      - cat
  - name: helm
    image: lachlanevenson/k8s-helm:v3.10.2
    imagePullPolicy: IfNotPresent
    command:
    - cat
    tty: true
"""
    }//End kubernetes
  }//End agent
  
    environment {
        ENV_NAME = "${BRANCH_NAME == "main" ? "prd" : "${BRANCH_NAME}"}"

        GIT_SSH = "git@github.com:Live-Quiz-Project/Live-Quiz-Frontend.git"
        APP_NAME = "oqp-live-frontend"
        IMAGE = "ghcr.io/phurits/${APP_NAME}"
    }
  
  //Start Pipeline
  stages {
      stage('Notify Pipeline Start') {
          steps{
              script {
                  withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
                      discordSend description: "Jenkins Pipeline Build", footer: "Start Build", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK}"
                  }
              }
          }
      }
      
      // ***** Stage Clone *****
      stage('Clone reviews source code') {
        steps {
          container('jnlp') {
            script {
              scmVars = git branch: "${BRANCH_NAME}",
                            credentialsId: 'git',
                            url: "${GIT_SSH}"
            }
          }
        }
      }
      
      // ***** Dependency Check ******
      stage('Download Package Dependencies'){
          steps{
              container('node') {
                  script{
                      sh 'npm install -g pnpm'
                      sh 'pnpm install'
                  }
              }
          }
      }

      // ***** Stage Build *****
      stage('Build reviews Docker Image and push') {
          steps {
              container('docker') {
                  script {
                      withCredentials([usernamePassword(credentialsId: 'ghcr-registry', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                          sh "docker login ghcr.io -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                          sh "docker build -f Dockerfile.jenkins -t ${IMAGE}:${ENV_NAME} ."
                          sh "docker push ${IMAGE}:${ENV_NAME}"
                      }
                  }
              }
          }
      }
      
      // ***** Deploy ******
      stage('Deploy reviews with Helm Chart') {
          steps {
              container('helm') {
                  script {
                      withKubeConfig([credentialsId: 'kubeconfig']) {
                          def helmListExitCode = sh(script: "helm list -q -n ${ENV_NAME} | grep ${APP_NAME}", returnStatus: true)

                          if (helmListExitCode == 0) {
                              sh "helm delete --namespace ${ENV_NAME} ${APP_NAME} --wait"
                          }

                          sh "helm upgrade -i ${APP_NAME} k8s/helm -f k8s/helm-values/apps-${ENV_NAME}.yaml --wait --namespace ${ENV_NAME}"

                      }
                  }
              }
          }
      }
  }// End stages

  post {
    success {
      script {
          withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
              discordSend description: "Jenkins Pipeline Build", footer: "Finish Build", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK}"
          }
      }
    }
    
    failure {
      script {
          withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
              discordSend description: "Jenkins Pipeline Build", footer: "Failed", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK}"
          }
      }
    }
  }
}// End pipeline
