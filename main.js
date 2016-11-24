'use strict';

let multicharting = new MultiCharting(),
	datastore = multicharting.createDataStore(),
	table = multicharting.dataTable(datastore, 'table-container'),
	filter;

datastore.setData({dataSource: data.slice(0, 100)});
filter = new FCDataFilterExt(datastore, {}, 'filter-container');