class FCDataFilterExt {
  constructor () {
    var multiChart = new MultiCharting();
    this.datastore = multiChart.createDataStore();
    // setting demo data
    this.demoData = {
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
    };
    this.datastore.setData(this.demoData);
    // data set
  }

  getConfigFromData () {
    var config = {};

    if (!this.datastore) {
      return;
    }
  }

  updateConfig (config) {
  }
}
window.FCDataFilterExt = FCDataFilterExt;
