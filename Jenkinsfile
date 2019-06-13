@Library ('folio_jenkins_shared_libs@folio-2100-workaround') _

buildNPM {
  publishModDescriptor = 'yes'
  runLint = 'yes'
  runSonarqube = true
  runTest = 'yes'
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
}
