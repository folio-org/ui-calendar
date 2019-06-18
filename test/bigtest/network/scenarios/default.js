/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
// eslint-disable-next-line  no-unused-vars
export default function defaultScenario(server) {
  const servicePoints = server.createList('servicePoint', 2);

  server.createList('period', 2, {
    servicePointId: servicePoints[0].id
  });
}
