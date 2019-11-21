export default function defaultScenario(server) {
  server.post('/calendar/periods/:id/period', {
    errors: [
      {
        code: 'intervalsOverlap',
        message: 'Intervals can not overlap.'
      }
    ]
  }, 422);
}
