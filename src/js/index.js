'use strict';

const FilterVisual = require('./filtervisual');

/**
 * Class representing the Data Aggregator.
 */
class FCDataFilterExt {
  /**
   * Create a Data Filter.
   * @param {Object} datastore - Defines the Global Data Store
   * @param {Object} userconfig - Defines the user's configauration
   * @param {Boolean} [userconfig.autoApply=true] - If 'true', filter applies on any change in filter
      else an apply button is provided to filter.
   * @param {Object} userconfig.fieldConfig - Defines the field configurations
   * @param {Object} userconfig.fieldConfig.fieldName - Defines the config for the particular field
   * @param {Boolean} [userconfig.fieldConfig.fieldName.visible=true] - If 'true', the field will be visible in control
     panel and vice versa.
   * @param {Boolean} [userconfig.fieldConfig.fieldName.selectable=true] - If 'false', all the values of the field
     cannot be interacted and vice versa.
   * @param {Array} [userconfig.fieldConfig.fieldName.nonSelectableValues=[]] - Defines the values of a field which
     cannot be interacted.
   * @param {Array} [userconfig.fieldConfig.fieldName.nonSelectedValues=[]] - Defines the values of a field which
     will not be selected (i.e., unchecked) initially.
   * @param {Boolean} [userconfig.fieldConfig.fieldName.collapsed=false] - If 'true', the field in control panel
     will be in collapsed mode else it will be expanded initially.
   * @param {number} [userconfig.fieldConfig.fieldName.step=0] - Defines the step interval of range slider, if '0' then
     the range slider will be continuos else it will be discrete.
   * @param {number} [userconfig.fieldConfig.fieldName.decimal=0] - Defines the number of decimal point in range
   * @param {number} [userconfig.fieldConfig.fieldName.scaleMin=min value of all fields] - Defines the minimum
     value of the scale in range slider
   * @param {number} [userconfig.fieldConfig.fieldName.scaleMax=max value of all fields] - Defines the maximum
     value of the scale in range slider
   * @param {number} [userconfig.fieldConfig.fieldName.activeMin=scaleMin] - Defines the value of min slider
     handle in range slider initially.
   * @param {number} [userconfig.fieldConfig.fieldName.activeMax=scaleMax] - Defines the value of max slider
     handle in range slider initially.
   * @param {string} containerId - Defines the container id of control box
   */
  constructor (datastore, userconfig, id, cb) {
    this.multiChart = new MultiCharting();
    this.datastore = datastore;
    this.callback = cb;
    this.userconfig = userconfig || {};
    this.displayConfig = this.createMenuConfigFromData();
    this.filterVisual = new FilterVisual(this.displayConfig, id, this);
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
          min = item.range.min;
          max = item.range.max;
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
  * @private
  * function that will be called after
  * apply has been clicked in ui
  */
  apply (config) {
    var dataprocessor = this.multiChart.createDataProcessor(),
      datastore = this.multiChart.createDataStore();
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
  * @private
  * Create config menu according to which
  * view will be rendered.
  */
  createMenuConfigFromData () {
    var userconfig = this.userconfig,
      configOb = {
        autoApply: pluckNumber(userconfig.autoApply, true),
        data: []
      },
      config = configOb.fieldConfig,
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
        field: key,
        visible: true
      };
      this.__createItemsList__(temp);
      this.__applyUserConfig__(temp);
      config.push(temp);
    }
    return configOb;
  }

  __createItemsList__ (object) {
    var datastore = this.datastore,
      category = object.field,
      valuesArr = datastore.getUniqueValues(category),
      type = this.__getType__(valuesArr, category),
      userconfig = this.userconfig,
      fieldConfig = userconfig.fieldConfig,
      min = 0,
      max = 0,
      activeMin = 0,
      activeMax = 0,
      i = 0,
      ii = 0,
      step = 0,
      precision = 2,
      currentField = {};
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
      if (fieldConfig && fieldConfig[category]) {
        currentField = fieldConfig[category];
        if (currentField.scaleMin && currentField.scaleMin > min) {
          min = currentField.scaleMin;
        }
        if (currentField.scaleMax && currentField.scaleMax < max) {
          max = currentField.scaleMax;
        }
        activeMin = min;
        activeMax = max;
        if (currentField.activeMin && currentField.activeMin > activeMin) {
          activeMin = currentField.activeMin;
        }
        if (currentField.activeMax && currentField.activeMax < activeMax) {
          activeMax = currentField.activeMax;
        }
        step = pluckNumber(currentField.step, 0);
        precision = pluckNumber(currentField.decimal, 2);
      } // end if fieldConfig
      // Setting range to object
      object.range = {
        scaleMin: min,
        scaleMax: max,
        activeMin: activeMin,
        activeMax: activeMax,
        step: step,
        decimal: precision
      };
    }
  }

  __applyUserConfig__ (object) {
    var userconfig = this.userconfig,
      type = object.type,
      category = object.category,
      disabledItems = userconfig.disabledItems && userconfig.disabledItems[category],
      items = object.items || [],
      i = 0,
      ii = items.length,
      fieldConfig = userconfig.fieldConfig,
      currentField = {},
      nonSelectableValues = [],
      nonSelectedValues = [],
      selectable = true;
    // Check if field exists
    if (fieldConfig && fieldConfig[category]) {
      currentField = fieldConfig[object.field];
      nonSelectedValues = currentField.nonSelectedValues;
      nonSelectableValues = currentField.nonSelectableValues;
      selectable = pluckNumber(currentField.selectable, true);
      // setting object properties
      object.visible = pluckNumber(currentField.visible, true);
      object.collapsed = pluckNumber(currentField.collapsed, false);
      // setting field properties
      if (object.type === 'string') {
        for (i = 0, ii = items.length; i < ii; ++i) {
          if (!selectable) {
            items[i].disabled = true;
          }
          if (!items[i].disabled && nonSelectableValues.indexOf(items[i].value)) {
            items[i].disabled = true;
          }
          if (nonSelectedValues.indexOf(items[i].value)) {
            items[i].checked = false;
          }
        }
      }
    }
  }

  __getType__ (arr, category) {
    let i = arr.length,
      userconfig = this.userconfig,
      type = {
        string: 'string',
        number: 'number'
      };
    while (i--) {
      if (isNaN(+arr[i])) {
        return type.string;
      }
    }
    if (!userconfig.range || !userconfig.range[category]) {
      // return type.string;
    }
    return type.number;
  }
}
window.FCDataFilterExt = FCDataFilterExt;

function pluckNumber (val, def) {
  if (val === undefined) {
    return def;
  }
  return !!val;
}
