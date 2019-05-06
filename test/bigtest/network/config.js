export default function config() {
  this.get('/service-points', function (schema) {
    return schema.servicePoints.all();
  });

  this.get('/calendar/periods/:servicePointId/period', ({ periods }, request) => {
    const {
      params: {
        servicePointId
      }
    } = request;
    const { models } = periods.where({ servicePointId });

    return {
      openingPeriods: models.map(model => model.attrs),
      totalRecords: models.length,
    };
  });

  this.delete('/calendar/periods/:servicePointId/period/:periodId', ({ periods }, request) => {
    const {
      params: {
        periodId,
      }
    } = request;
    const period = periods.find(periodId);

    return period.destroy();
  });

  this.put('/calendar/periods/:id/period/:periodId', ({ periods }, request) => {
    const newData = JSON.parse(request.requestBody);
    const patronNoticePolicy = periods.find(newData.id);

    patronNoticePolicy.update(newData);

    return patronNoticePolicy.attrs;
  });

  this.post('/calendar/periods/:id/period', ({ periods }, request) => {
    const body = JSON.parse(request.requestBody);
    const period = periods.create(body);

    return period.attrs;
  });
}
