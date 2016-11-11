class FCDataFilterExt {
  constructor () {
    var multiChart = new MultiChart();
    this.datastore = multiChart.createDataStore();
    this.dataProcessor = multiChart.createDataProcessor();
    // setting demo data
    this.datastore.setData({
      dataSource: [{
        product: 'tea',
        sale: '45',
        year: 2016
      },
      {
        product: 'coffee',
        sale: '45',
        year: 2016
      }]
    });
    // data set
  }
}
