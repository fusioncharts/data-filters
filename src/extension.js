class FCDataFilterExt {
  constructor (datastore, userconfig, cb) {
    /**
    * User configuration format
    * {
    *   blockedCategories: ['Product'],
    *   disabledCategories: ['Product'],
    *   disabledItems: {
    *     'Product' : ['Tea']
    *   },
    *   range: {
    *     year: {min: 2000, max: 2010}
    *   }
    * }
    */
    this.multiChart = new MultiCharting();
    this.datastore = datastore;
    this.callback = cb;
    this.userconfig = userconfig || {};
    this.displayConfig = this.createMenuConfigFromData();
    this.filterVisual = new FilterVisual(this.displayConfig, 'filter-parent', this);
    // data set
  }

  generateBlockList (_list) {
    var list = _list || [],
      i = 0,
      ii = list.length,
      key,
      includeAll = false,
      blockList = [],
      item = {},
      itemListArr = [],
      j = 0,
      jj = 0,
      min = 0,
      max = 0,
      subItem = {};
    for (i = 0; i < ii; ++i) {
      item = list[i];
      includeAll = false;
      // if config was disabled or not visible; skip
      if (item.disabled || !item.visible) {
        continue;
      }
      if (!item.checked) {
        includeAll = true;
      }
      // Operation for type string
      if (item.type === 'string') {
        for (j = 0, jj = item.items.length; j < jj; ++j) {
          subItem = item.items[j];
          if (!subItem.disabled && (includeAll || !subItem.checked)) {
            if (blockList.indexOf(item.category + subItem.value) === -1) {
              blockList.push(item.category + subItem.value);
            } // end if
          } // end if
        } // end for j
      } // end if
      // operation for type number
      if (item.type === 'number') {
        for (j = 0, jj = item.items.length; j < jj; ++j) {
          subItem = item.items[j];
          min = item.range[0];
          max = item.range[1];
          if (includeAll || subItem.value < min || subItem.value > max) {
            if (blockList.indexOf(item.category + subItem.value) === -1) {
              blockList.push(item.category + subItem.value);
            } // end if
          } // end if
        } // end for j
      } // end if
    } // end for i
    return blockList;
  } // end function

  /**
  * function that will be called after
  * apply has been clicked in ui
  */
  apply (config) {
    var dataprocessor = this.multiChart.createDataProcessor();
    dataprocessor.filter(this.createFilter(config));
    // Executing the callback function whenever filter is applied
    this.callback(this.datastore.getData(dataprocessor));
  }

  createFilter (_config) {
    var config = _config || this.displayConfig,
      blockList = this.generateBlockList(config);
    return function (object, index, array) {
      var key;
      for (key in object) {
        if (blockList.indexOf(key + object[key]) !== -1) {
          return;
        }
      }
      return object;
    };
  }

  /**
  * Create config menu according to which
  * view will be rendered.
  */
  createMenuConfigFromData () {
    var config = [],
      datastore = this.datastore,
      key = '',
      temp = {},
      tempArr = {},
      type = '',
      keysArr = datastore.getKeys(),
      i = 0,
      ii = 0;
    if (!datastore) {
      return;
    }
    // Iterating over unique keys
    for (i = 0, ii = keysArr.length; i < ii; ++i) {
      key = keysArr[i];
      temp = {
        category: key,
        disabled: false,
        checked: true,
        visible: true,
        enableCheck: false
      };
      this.__createItemsList__(temp);
      this.__applyUserConfig__(temp);
      config.push(temp);
    }
    return config;
  }

  __createItemsList__ (object) {
    var datastore = this.datastore,
      category = object.category,
      valuesArr = datastore.getUniqueValues(category),
      type = this.__getType__(valuesArr),
      min = 0,
      max = 0,
      i = 0,
      ii = 0;
    // setting type
    object.type = type;
    if (type === 'string') {
      // string will have items list
      object.items = [];
      for (i = 0, ii = valuesArr.length; i < ii; ++i) {
        object.items.push({
          value: valuesArr[i],
          disabled: false,
          checked: true
        });
      }
    } else if (type === 'number') {
      // numbers will have range and a value list
      object.items = [];
      for (i = 0, ii = valuesArr.length; i < ii; ++i) {
        object.items.push({
          value: valuesArr[i]
        });
      }
      min = Math.min.apply(null, valuesArr);
      max = Math.max.apply(null, valuesArr);
      if (this.userconfig.range && this.userconfig.range[category]) {
        if (this.userconfig.range[category].min && this.userconfig.range[category].min > min) {
          min = this.userconfig.range[category].min;
        }
        if (this.userconfig.range[category].max && this.userconfig.range[category].max < max) {
          max = this.userconfig.range[category].max;
        }
      }
      object.range = [min, max];
    }
  }

  __applyUserConfig__ (object) {
    var userconfig = this.userconfig,
      type = object.type,
      category = object.category,
      blockedCategories = userconfig.blockedCategories,
      disabledCategories = userconfig.disabledCategories,
      disabledItems = userconfig.disabledItems && userconfig.disabledItems[category],
      items = object.items || [],
      i = 0,
      ii = items.length;

    if (Array.isArray(blockedCategories) && blockedCategories.indexOf(category) !== -1) {
      object.visible = false;
    }
    if (Array.isArray(disabledCategories) && disabledCategories.indexOf(category) !== -1) {
      object.disabled = true;
    }

    if (Array.isArray(disabledItems)) {
      for (; i < ii; ++i) {
        if (disabledItems.indexOf(items[i].value) !== -1) {
          object.items[i].disabled = true;
        }
      }
    }
  }

  __getType__ (arr) {
    let i = arr.length,
      type = {
        string: 'string',
        number: 'number'
      };
    while (i--) {
      if (isNaN(+arr[i])) {
        return type.string;
      }
    }
    return type.number;
  }
}
window.FCDataFilterExt = FCDataFilterExt;
