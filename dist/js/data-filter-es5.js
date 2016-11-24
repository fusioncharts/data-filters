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

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FilterVisual = __webpack_require__(1);

	/**
	 * Class representing the Data Aggregator.
	 */

	var FCDataFilterExt = function () {
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
	  function FCDataFilterExt(datastore, userconfig, id) {
	    _classCallCheck(this, FCDataFilterExt);

	    this.separator = '&*fusioncharts_()76eqw';
	    this.multiChart = new MultiCharting();
	    this.datastore = datastore;
	    this.userconfig = userconfig || {};
	    // this.userconfig = {
	    //   autoApply: true,
	    //   fieldConfig: {
	    //     'product': {
	    //       selectable: true,
	    //       collapsed: false,
	    //       nonSelectableValues: ['Rice'],
	    //       nonSelectedValues: ['Wheat']
	    //     },
	    //     'sale': {
	    //       step: 2.5,
	    //       decimal: 2,
	    //       scaleMin: 1,
	    //       scaleMax: 10
	    //     }
	    //   }
	    // };

	    this.displayConfig = this.createMenuConfigFromData();
	    this.filterVisual = new FilterVisual(this.displayConfig, id, this);
	    // data set
	  }

	  _createClass(FCDataFilterExt, [{
	    key: 'generateBlockList',
	    value: function generateBlockList(_list) {
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
	            min = item.range.activeMin;
	            max = item.range.activeMax;
	            if (includeAll || +subItem.value < min || +subItem.value > max) {
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

	  }, {
	    key: 'apply',
	    value: function apply(config) {
	      var dataprocessor = this.dataprocessor || this.multiChart.createDataProcessor();
	      this.generateBlockList(config);
	      if (!this.dataprocessor) {
	        this.dataprocessor = dataprocessor;
	        dataprocessor.filter(this.createFilter(config));
	      }
	      // Executing the callback function whenever filter is applied
	      this.datastore.addDataProcessor(this.dataprocessor);
	    }
	  }, {
	    key: 'createFilter',
	    value: function createFilter(_config) {
	      var config = _config || this.displayConfig,
	          self = this;
	      return function (object, index, array) {
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

	  }, {
	    key: 'createMenuConfigFromData',
	    value: function createMenuConfigFromData() {
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
	  }, {
	    key: '__createItemsList__',
	    value: function __createItemsList__(object) {
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
	          precision = 0,
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
	  }, {
	    key: '__applyUserConfig__',
	    value: function __applyUserConfig__(object) {
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
	        object.collapsed = pluckNumber(currentField.collapsed, items.length > 5);
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
	  }, {
	    key: '__getType__',
	    value: function __getType__(arr, category) {
	      var i = arr.length,
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
	  }]);

	  return FCDataFilterExt;
	}();

	window.FCDataFilterExt = FCDataFilterExt;

	var pluckNumber = function pluckNumber(val, def) {
	  if (val === undefined) {
	    return def;
	  }
	  return val;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HUNDREED = 100,
	    PERCENTAGESTRING = '%',
	    CLASS = 'class';

	var FilterVisual = function () {
	  function FilterVisual(filterObj, containerId, filterExt) {
	    _classCallCheck(this, FilterVisual);

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


	  _createClass(FilterVisual, [{
	    key: 'makeCopy',
	    value: function makeCopy(arrayOfObjects) {
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

	  }, {
	    key: 'createElements',
	    value: function createElements(name, attr) {
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

	  }, {
	    key: 'createSlider',
	    value: function createSlider(parentElement, dataObj) {
	      var self = this,
	          sliderWrapper,
	          inputWrapper,
	          scaleWrapper,
	          labelWrapper,
	          scaleTick,
	          minInput,
	          maxInput,
	          minLabel,
	          maxLabel,
	          sliderBase,
	          sliderConnect,
	          minSliderHandle,
	          maxSliderHandle,
	          range = dataObj.range,
	          scaleMinVal = range.scaleMin,
	          scaleMaxVal = range.scaleMax,
	          activeMinVal = range.activeMin,
	          activeMaxVal = range.activeMax,
	          diffVal = scaleMaxVal - scaleMinVal,
	          step = range.step,
	          i,
	          stepsPosArr = [],
	          pos,
	          setInputValue = function setInputValue() {
	        var min, max;

	        min = (parseInt(minSliderHandle.style.left) / HUNDREED * diffVal + scaleMinVal).toFixed(range.decimal);
	        max = (parseInt(maxSliderHandle.style.left) / HUNDREED * diffVal + scaleMinVal).toFixed(range.decimal);
	        range.activeMin = minInput.value = min;
	        range.activeMax = maxInput.value = max;
	      },

	      // Attach events to range slider handles
	      attachHandlerEvent = function attachHandlerEvent(elem, type) {
	        var _this = this;

	        var initX,
	            mousePressX,
	            flag = true,
	            moveHandler = function moveHandler(event) {
	          var element = _this;
	          if (flag) {
	            setTimeout(function () {
	              flag = false;
	              repositionElement.call(element, event);
	            }, 100);
	          }
	          event.preventDefault();
	        },


	        // Set style to slider handle to reposition along drag
	        repositionElement = function repositionElement(event) {
	          var sliderBaseWidth = sliderBase.offsetWidth,
	              clientX = event.touches ? event.touches[0].clientX : event.clientX,
	              left = parseInt(initX) + clientX - mousePressX,
	              leftPos,
	              min,
	              max;

	          if (type === 'min') {
	            min = 0;
	            max = parseInt(maxSliderHandle.style.left) / HUNDREED * sliderBaseWidth - 10;
	          } else {
	            min = parseInt(minSliderHandle.style.left) / HUNDREED * sliderBaseWidth + 10;
	            max = sliderBaseWidth;
	          }

	          if (left >= min && left <= max) {
	            leftPos = (HUNDREED / sliderBaseWidth * left).toFixed(0);
	            elem.style.left = leftPos + PERCENTAGESTRING;

	            if (type === 'min') {
	              sliderConnect.style.left = leftPos + PERCENTAGESTRING;
	            } else {
	              sliderConnect.style.right = HUNDREED - leftPos + PERCENTAGESTRING;
	            }

	            setInputValue();
	          }
	          flag = true;
	        },
	            stepHandler = function stepHandler() {
	          var posArr = range.stepsPosArr,
	              pos = parseInt(elem.style.left),
	              closest = posArr.reduce(function (prev, curr) {
	            return Math.abs(curr - pos) < Math.abs(prev - pos) ? curr : prev;
	          });

	          elem.style.left = closest.toFixed(0) + PERCENTAGESTRING;

	          if (type === 'min') {
	            sliderConnect.style.left = closest.toFixed(0) + PERCENTAGESTRING;
	          } else {
	            sliderConnect.style.right = HUNDREED - closest + PERCENTAGESTRING;
	          }
	          setInputValue();
	        },
	            downHandler = function downHandler(evnt) {
	          var body = document.body,
	              upHandler = function upHandler() {
	            body.style.cursor = '';
	            body.removeEventListener('mousemove', moveHandler, false);
	            body.removeEventListener('touchmove', moveHandler, false);
	            body.removeEventListener('mouseup', upHandler, false);
	            body.removeEventListener('touchend', upHandler, false);
	            if (step) {
	              stepHandler();
	            }
	            self.applyFilter();
	          };
	          initX = parseInt(elem.style.left) / HUNDREED * sliderBase.offsetWidth;
	          mousePressX = evnt.touches ? evnt.touches[0].clientX : evnt.clientX;
	          body.style.cursor = 'pointer';
	          body.addEventListener('mousemove', moveHandler, false);
	          body.addEventListener('touchmove', moveHandler, false);
	          body.addEventListener('mouseup', upHandler, false);
	          body.addEventListener('touchend', upHandler, false);
	          evnt.preventDefault();
	        };

	        elem.addEventListener('mousedown', downHandler, false);
	        elem.addEventListener('touchstart', downHandler, false);
	      },
	          changeInputHandler = function changeInputHandler(event) {
	        var minInputVal = Number(minInput.value),
	            maxInputVal = Number(maxInput.value),
	            tempVal;

	        if (minInputVal >= scaleMinVal && maxInputVal <= scaleMaxVal && minInputVal <= maxInputVal) {
	          sliderConnect.style.left = minSliderHandle.style.left = (HUNDREED / diffVal * (minInputVal - scaleMinVal)).toFixed(0) + PERCENTAGESTRING;
	          tempVal = HUNDREED / diffVal * (maxInputVal - scaleMinVal);
	          maxSliderHandle.style.left = tempVal + PERCENTAGESTRING;
	          sliderConnect.style.right = HUNDREED - tempVal + PERCENTAGESTRING;
	        }
	        setInputValue();
	        event && self.applyFilter();
	      },


	      // Attach event to min max input text field of range slider
	      attachInputEvent = function attachInputEvent(elem, type) {
	        elem.addEventListener('blur', changeInputHandler, false);
	      };

	      // Create slider elements
	      sliderWrapper = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_wrapper'
	      });
	      parentElement.appendChild(sliderWrapper);

	      inputWrapper = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_input'
	      });
	      sliderWrapper.appendChild(inputWrapper);

	      minInput = self.createElements('input', {
	        'type': 'text',
	        'value': activeMinVal,
	        'style': 'margin-left: 9px;'
	      });
	      inputWrapper.appendChild(minInput);
	      attachInputEvent(minInput, 'min');

	      maxInput = self.createElements('input', {
	        'type': 'text',
	        'value': activeMaxVal,
	        'style': 'float: right; margin-right: 9px;'
	      });
	      inputWrapper.appendChild(maxInput);
	      attachInputEvent(maxInput, 'max');

	      sliderBase = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_base'
	      });
	      sliderWrapper.appendChild(sliderBase);

	      sliderConnect = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_connect',
	        'style': 'left: 0%; right: 0%;'
	      });
	      sliderBase.appendChild(sliderConnect);

	      minSliderHandle = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_handle',
	        'style': 'left: 0%;'
	      });
	      sliderBase.appendChild(minSliderHandle);
	      attachHandlerEvent(minSliderHandle, 'min');

	      maxSliderHandle = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_handle',
	        'style': 'left: 100%;'
	      });
	      sliderBase.appendChild(maxSliderHandle);
	      attachHandlerEvent(maxSliderHandle, 'max');

	      changeInputHandler();

	      scaleWrapper = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_scale'
	      });
	      sliderBase.appendChild(scaleWrapper);

	      scaleTick = self.createElements('span', {
	        'style': 'left: 0%'
	      });
	      scaleWrapper.appendChild(scaleTick);
	      stepsPosArr.push(0);

	      if (step) {
	        for (i = step; i < scaleMaxVal; i += step) {
	          pos = HUNDREED / diffVal * i;
	          scaleTick = self.createElements('span', {
	            'style': 'left: ' + pos.toFixed(0) + PERCENTAGESTRING
	          });
	          scaleWrapper.appendChild(scaleTick);
	          stepsPosArr.push(pos);
	        }
	      }

	      if (parseInt(scaleTick.style.left) !== HUNDREED) {
	        scaleTick = self.createElements('span', {
	          'style': 'left: 100%'
	        });
	        scaleWrapper.appendChild(scaleTick);
	        stepsPosArr.push(HUNDREED);
	      }
	      range.stepsPosArr = stepsPosArr;

	      labelWrapper = self.createElements('div', {
	        CLASS: 'fc_ext_filter_slider_label'
	      });
	      sliderBase.appendChild(labelWrapper);

	      minLabel = self.createElements('label', {
	        'style': 'float: left;'
	      });
	      minLabel.innerHTML = scaleMinVal;
	      labelWrapper.appendChild(minLabel);

	      maxLabel = self.createElements('label', {
	        'style': 'float: right;'
	      });
	      maxLabel.innerHTML = scaleMaxVal;
	      labelWrapper.appendChild(maxLabel);
	    }

	    /**
	     * @private
	     * Draw the filter component
	     */

	  }, {
	    key: 'draw',
	    value: function draw() {
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
	        CLASS: 'fc_ext_filter_cont',
	        'style': 'overflow-y: scroll; overflow-x: hidden;'
	      });
	      wrapper.style.height = parentContainer.offsetHeight + 'px';
	      parentContainer.appendChild(wrapper);

	      var _loop = function _loop() {
	        var fieldObj = filterState[i],
	            header = void 0,
	            cardBody = void 0,
	            toggleTool = void 0,
	            headerCont = void 0,
	            fieldName = fieldObj.field;

	        if (fieldObj.visible) {
	          section = self.createElements('section');
	          wrapper.appendChild(section);

	          cards = self.createElements('div', {
	            CLASS: 'fc_ext_filter_card'
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
	            CLASS: 'fc_ext_filter_header_toggle'
	          });
	          headerCont.appendChild(toggleTool);

	          cardBody = self.createElements('div', {
	            CLASS: 'fc_ext_filter_card-body'
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

	            var _loop2 = function _loop2() {
	              var itemObj = fieldObj.items[j],
	                  input = void 0,
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
	            };

	            for (j = 0; j < fieldObj.items.length; j++) {
	              _loop2();
	            }
	          } else {
	            self.createSlider(cardBody, fieldObj);
	          }
	        }
	      };

	      for (i = 0; i < filterState.length; i++) {
	        _loop();
	      }
	      section = self.createElements('section');
	      wrapper.appendChild(section);

	      if (!self.config.autoApply) {
	        applyButton = self.createElements('button', {
	          CLASS: 'fc_ext_filter_button fc_ext_filter_button_apply'
	        });
	        applyButton.innerHTML = 'APPLY';
	        applyButton.onclick = function () {
	          self.applyFilter(true);
	        };
	        section.appendChild(applyButton);
	      }

	      resetButton = self.createElements('button', {
	        CLASS: 'fc_ext_filter_button fc_ext_filter_button_reset'
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

	  }, {
	    key: 'applyFilter',
	    value: function applyFilter(forceCall) {
	      var self = this;
	      if (self.config.autoApply || forceCall) {
	        self.filterExt.apply(self.filterState);
	      }
	    }
	  }]);

	  return FilterVisual;
	}();

	module.exports = FilterVisual;

/***/ }
/******/ ]);