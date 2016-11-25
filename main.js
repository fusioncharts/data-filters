'use strict';

let multicharting = new MultiCharting(),
	datastore = multicharting.createDataStore(),
	table = multicharting.dataTable({
		datastore: datastore,
		container: 'table-container',
		hiddenFields: [],
		fieldsorder: []
	}),
	filter,
	config = {
		autoApply: false
	};

datastore.setData({dataSource: data.slice(0, 100)});
filter = new FCDataFilterExt(datastore, config, 'filter-container');