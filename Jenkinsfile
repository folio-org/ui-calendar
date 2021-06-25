buildNPM {
  publishModDescriptor = 'yes'
  runLint = 'yes'
  runSonarqube = true
  runScripts = [
    ['formatjs-compile': ''],
    ['test':'--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'],
  ]
}
