/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const FilterVisual = __webpack_require__(2);

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
	  constructor (datastore, userconfig, id) {
	    this.multiChart = new MultiCharting();
	    this.datastore = datastore;
	    this.userconfig = userconfig || {};

	    this.displayConfig = this.createMenuConfigFromData();
	    this.filterVisual = new FilterVisual(this.displayConfig, id, this);
	    this.separator = '&*fusioncharts_()76eqw';
	    // data set
	  }

	  generateBlockList (_list) {
	    var self = this,
	      list = _list || [],
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
	            if (blockList.indexOf(item.field + self.separator + subItem.value) === -1) {
	              blockList.push(item.field + self.separator + subItem.value);
	            } // end if
	          } // end if
	        } // end for j
	      } // end if
	      // operation for type number
	      if (item.type === 'number') {
	        for (j = 0, jj = item.items.length; j < jj; ++j) {
	          subItem = item.items[j];
	          min = item.range.scaleMin;
	          max = item.range.scaleMax;
	          if (includeAll || subItem.value < min || subItem.value > max) {
	            if (blockList.indexOf(item.field + self.separator + subItem.value) === -1) {
	              blockList.push(item.field + self.separator + subItem.value);
	            } // end if
	          } // end if
	        } // end for j
	      } // end if
	    } // end for i
	    // sving block list to instance
	    this.blockList = blockList;
	  } // end function

	  /**
	  * @private
	  * function that will be called after
	  * apply has been clicked in ui
	  */
	  apply (config) {
	    var dataprocessor = this.dataprocessor || this.multiChart.createDataProcessor();
	    this.generateBlockList(config);
	    if (!this.dataprocessor) {
	      this.dataprocessor = dataprocessor;
	      dataprocessor.filter(this.createFilter(config));
	    }
	    // Executing the callback function whenever filter is applied
	    this.datastore.applyDataProcessor(this.dataprocessor);
	  }

	  createFilter (_config) {
	    var config = _config || this.displayConfig,
	      self = this;
	    return (object, index, array) => {
	      var key;
	      for (key in object) {
	        if (self.blockList.indexOf(key + self.separator + object[key]) !== -1) {
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
	      config = configOb.data,
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
	      activeMin = min = Math.min.apply(null, valuesArr);
	      activeMax = max = Math.max.apply(null, valuesArr);
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
	      category = object.field,
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
	      nonSelectedValues = currentField.nonSelectedValues || [];
	      nonSelectableValues = currentField.nonSelectableValues || [];
	      // setting object properties
	      selectable = pluckNumber(currentField.selectable, true);
	      object.visible = pluckNumber(currentField.visible, true);
	      object.collapsed = pluckNumber(currentField.collapsed, false);
	      // setting field properties
	      if (object.type === 'string') {
	        for (i = 0, ii = items.length; i < ii; ++i) {
	          if (!selectable) {
	            items[i].disabled = true;
	          }
	          if (!items[i].disabled && nonSelectableValues.indexOf(items[i].value) !== -1) {
	            items[i].disabled = true;
	          }
	          if (nonSelectedValues.indexOf(items[i].value) !== -1) {
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
	  return val;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	class FilterVisual {

	  constructor (filterObj, containerId, filterExt) {
	    /**
	     * @private
	     */
	    this.filterState = filterObj.data;
	    this.originalFilterState = this.makeCopy(this.filterState);
	    this.filterExt = filterExt;
	    this.config = {
	      autoApply: filterObj.autoApply,
	      containerId: containerId
	    };
	    this.draw();
	  }

	  /**
	   * @private
	   * Make copy of array of Objects
	   */
	  makeCopy (arrayOfObjects) {
	    var i,
	      copy = [];

	    for (i = 0; i < arrayOfObjects.length; i++) {
	      copy.push(JSON.parse(JSON.stringify(arrayOfObjects[i])));
	    }
	    return copy;
	  }

	  /**
	   * @private
	   * Create DOM elements and set attributes
	   */
	  createElements (name, attr) {
	    var elem = document.createElement(name),
	      key;

	    for (key in attr) {
	      elem.setAttribute(key, attr[key]);
	    }

	    return elem;
	  }

	  /**
	   * @private
	   * Create range slider component
	   */
	  createSlider (parentElement, dataObj) {
	    var self = this,
	      sliderWrapper,
	      inputWrapper,
	      labelWrapper,
	      minInput,
	      maxInput,
	      minLabel,
	      maxLabel,
	      sliderBase,
	      sliderConnect,
	      minSliderHandle,
	      maxSliderHandle,
	      range = dataObj.range,
	      minVal = range.scaleMin,
	      maxVal = range.scaleMax,
	      diffVal = maxVal - minVal,
	      getInputValue = function () {
	        var sliderBaseWidth = sliderBase.offsetWidth,
	          valuePerPixel = diffVal / sliderBaseWidth;
	        return {
	          min: Math.round((valuePerPixel * parseInt(minSliderHandle.style.left)) + minVal),
	          max: Math.round((valuePerPixel * parseInt(maxSliderHandle.style.left)) + minVal)
	        };
	      },
	      // Attach events to range slider handles
	      attachHandlerEvent = function (elem, type) {
	        var initX,
	          mousePressX,
	          flag = true,
	          rangeObj,
	          callBack = (event) => {
	            var element = this;
	            if (flag) {
	              setTimeout(() => {
	                flag = false;
	                repositionElement.call(element, event);
	              }, 100);
	            }
	          },

	          // Set style to slider handle to reposition along drag
	          repositionElement = (event) => {
	            var sliderBaseWidth = sliderBase.offsetWidth,
	              left = parseInt(initX) + event.clientX - mousePressX,
	              min,
	              max;

	            if (type === 'min') {
	              min = 0;
	              max = parseInt(maxSliderHandle.style.left) - 10;
	            } else {
	              min = parseInt(minSliderHandle.style.left) + 10;
	              max = sliderBaseWidth;
	            }

	            if (left >= min && left <= max) {
	              elem.style.left = left + 'px';
	              if (type === 'min') {
	                sliderConnect.style.left = left + 'px';
	              } else {
	                sliderConnect.style.right = (sliderBaseWidth - left) + 'px';
	              }
	              rangeObj = getInputValue();
	              dataObj.range.scaleMin = minInput.value = rangeObj.min;
	              dataObj.range.scaleMax = maxInput.value = rangeObj.max;
	            }
	            flag = true;
	          };

	        elem.addEventListener('mousedown', function (evnt) {
	          var body = document.body,
	            mouseUpCallBack = function () {
	              body.style.cursor = '';
	              body.removeEventListener('mousemove', callBack, false);
	              body.removeEventListener('mouseup', mouseUpCallBack, false);
	              self.applyFilter();
	            };
	          initX = elem.style.left;
	          mousePressX = evnt.clientX;
	          body.style.cursor = 'pointer';
	          body.addEventListener('mousemove', callBack, false);
	          body.addEventListener('mouseup', mouseUpCallBack, false);
	        }, false);
	      },

	      // Attach event to min max input text field of range slider
	      attachInputEvent = function (elem, type) {
	        elem.addEventListener('blur', function (evnt) {
	          var sliderBaseWidth = sliderBase.offsetWidth,
	            pixelPerValue = sliderBaseWidth / diffVal,
	            minInputVal = Number(minInput.value),
	            maxInputVal = Number(maxInput.value),
	            tempVal,
	            rangeObj;

	          if ((minInputVal >= minVal) && (maxInputVal <= maxVal) && (minInputVal <= maxInputVal)) {
	            sliderConnect.style.left = minSliderHandle.style.left =
	              Math.round((pixelPerValue * (minInputVal - minVal))) + 'px';
	            tempVal = Math.round(pixelPerValue * (maxInputVal - minVal));
	            maxSliderHandle.style.left = tempVal + 'px';
	            sliderConnect.style.right = (sliderBaseWidth - tempVal) + 'px';
	          }
	          rangeObj = getInputValue();
	          dataObj.range.scaleMin = minInput.value = rangeObj.min;
	          dataObj.range.scaleMax = maxInput.value = rangeObj.max;
	          self.applyFilter();
	        }, false);
	      };

	    // Create slider elements
	    sliderWrapper = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_wrapper'
	    });
	    parentElement.appendChild(sliderWrapper);

	    inputWrapper = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_input'
	    });
	    sliderWrapper.appendChild(inputWrapper);

	    minInput = self.createElements('input', {
	      'type': 'text',
	      'value': minVal,
	      'style': 'margin-left: 9px;'
	    });
	    inputWrapper.appendChild(minInput);
	    attachInputEvent(minInput, 'min');

	    maxInput = self.createElements('input', {
	      'type': 'text',
	      'value': maxVal,
	      'style': 'float: right; margin-right: 9px;'
	    });
	    inputWrapper.appendChild(maxInput);
	    attachInputEvent(maxInput, 'max');

	    sliderBase = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_base'
	    });
	    sliderWrapper.appendChild(sliderBase);

	    sliderConnect = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_connect',
	      'style': 'left: 0px; right: 0px;'
	    });
	    sliderBase.appendChild(sliderConnect);

	    minSliderHandle = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_handle',
	      'style': 'left: 0px;'
	    });
	    sliderBase.appendChild(minSliderHandle);
	    attachHandlerEvent(minSliderHandle, 'min');

	    maxSliderHandle = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_handle',
	      'style': 'left:' + sliderBase.offsetWidth + 'px'
	    });
	    sliderBase.appendChild(maxSliderHandle);
	    attachHandlerEvent(maxSliderHandle, 'max');

	    labelWrapper = self.createElements('div', {
	      'class': 'fc_ext_filter_slider_label'
	    });
	    sliderWrapper.appendChild(labelWrapper);

	    minLabel = self.createElements('label', {
	      'style': 'margin-left: 9px;'
	    });
	    minLabel.innerHTML = minVal;
	    labelWrapper.appendChild(minLabel);

	    maxLabel = self.createElements('label', {
	      'style': 'float: right; margin-right: 9px;'
	    });
	    maxLabel.innerHTML = maxVal;
	    labelWrapper.appendChild(maxLabel);
	  }

	  /**
	   * @private
	   * Draw the filter component
	   */
	  draw () {
	    var self = this,
	      filterState = self.filterState,
	      config = self.config,
	      containerId = config.containerId,
	      parentContainer = document.getElementById(containerId),
	      wrapper,
	      section,
	      cards,
	      label,
	      ul,
	      li,
	      i,
	      j,
	      applyButton,
	      resetButton;

	    if (!parentContainer) {
	      return;
	    }

	    parentContainer.innerHTML = '';

	    wrapper = self.createElements('div', {
	      'class': 'fc_ext_filter_cont',
	      'style': 'overflow-y: auto; overflow-x: hidden;'
	    });
	    wrapper.style.height = parentContainer.offsetHeight + 'px';
	    parentContainer.appendChild(wrapper);

	    for (i = 0; i < filterState.length; i++) {
	      let fieldObj = filterState[i],
	        header,
	        cardBody,
	        toggleTool,
	        headerCont,
	        fieldName = fieldObj.field;

	      if (fieldObj.visible) {
	        section = self.createElements('section');
	        wrapper.appendChild(section);

	        cards = self.createElements('div', {
	          'class': 'fc_ext_filter_card'
	        });
	        section.appendChild(cards);

	        header = self.createElements('header');
	        cards.appendChild(header);

	        headerCont = self.createElements('div');
	        header.appendChild(headerCont);

	        label = self.createElements('span');
	        label.innerHTML = fieldName;
	        headerCont.appendChild(label);

	        toggleTool = self.createElements('span', {
	          'class': 'fc_ext_filter_header_toggle'
	        });
	        headerCont.appendChild(toggleTool);

	        cardBody = self.createElements('div', {
	          'class': 'fc_ext_filter_card-body'
	        });
	        cards.appendChild(cardBody);

	        if (fieldObj.collapsed) {
	          toggleTool.innerHTML = '[ + ]';
	          cardBody.style.display = 'none';
	        } else {
	          toggleTool.innerHTML = '[ - ]';
	          cardBody.style.display = 'block';
	        }

	        toggleTool.addEventListener('click', function () {
	          var cardBodyStyle = cardBody.style;
	          if (cardBodyStyle.display === 'none') {
	            toggleTool.innerHTML = '[ - ]';
	            cardBodyStyle.display = 'block';
	          } else {
	            toggleTool.innerHTML = '[ + ]';
	            cardBodyStyle.display = 'none';
	          }
	        }, false);

	        if (fieldObj.type === 'string') {
	          ul = self.createElements('ul');
	          cardBody.appendChild(ul);

	          for (j = 0; j < fieldObj.items.length; j++) {
	            let itemObj = fieldObj.items[j],
	              input,
	              itemVal = itemObj.value;

	            li = self.createElements('li');
	            ul.appendChild(li);

	            input = self.createElements('input', {
	              'type': 'checkbox',
	              'value': itemVal,
	              'id': 'fc_ext_filter_item_' + itemVal,
	              'style': 'cursor: pointer;'
	            });
	            input.addEventListener('change', function () {
	              itemObj.checked = input.checked;
	              self.applyFilter();
	            }, false);

	            itemObj.elem = input;
	            input.disabled = itemObj.disabled;
	            input.checked = itemObj.checked;
	            li.appendChild(input);
	            label = self.createElements('label', {
	              'for': 'fc_ext_filter_item_' + itemVal,
	              'style': 'cursor: pointer;'
	            });
	            label.innerHTML = itemVal;
	            li.appendChild(label);

	            if (input.disabled) {
	              label.style.cursor = input.style.cursor = '';
	              label.style.color = '#bdbdbd';
	            }
	          }
	        } else {
	          self.createSlider(cardBody, fieldObj);
	        }
	      }
	    }
	    section = self.createElements('section');
	    wrapper.appendChild(section);

	    if (!self.config.autoApply) {
	      applyButton = self.createElements('button', {
	        'class': 'fc_ext_filter_button fc_ext_filter_button_apply'
	      });
	      applyButton.innerHTML = 'APPLY';
	      applyButton.onclick = function () {
	        self.applyFilter(true);
	      };
	      section.appendChild(applyButton);
	    }

	    resetButton = self.createElements('button', {
	      'class': 'fc_ext_filter_button fc_ext_filter_button_reset'
	    });
	    resetButton.innerHTML = 'RESET';
	    resetButton.onclick = function () {
	      self.filterState = self.makeCopy(self.originalFilterState);
	      self.draw();
	      self.applyFilter(true);
	    };
	    section.appendChild(resetButton);
	    self.applyFilter(true);
	  }

	  // Apply filter to the Data
	  applyFilter (forceCall) {
	    var self = this;
	    if (self.config.autoApply || forceCall) {
	      self.filterExt.apply(self.filterState);
	    }
	  }
	}

	module.exports = FilterVisual;


/***/ }
/******/ ]);