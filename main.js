'use strict';

let multicharting = new MultiCharting(),
	datastore = multicharting.createDataStore(),
	filter;

datastore.setData({dataSource: data});
debugger;
filter = new FCDataFilterExt(datastore, {}, 'filter-container');