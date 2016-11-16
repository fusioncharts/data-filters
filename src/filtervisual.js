'use strict';

class FilterVisual {

  constructor (filterObj, containerId, filterExt) {
    /**
     * @private
     */
    this.filterState = filterObj.data;
    this.originalFilterState = this.makeCopy(this.filterState);
    this.filterExt = filterExt;
    this.config = filterObj;
    this.config.containerId = containerId;
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
      minVal = range.min,
      maxVal = range.max,
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
              dataObj.range.min = minInput.value = rangeObj.min;
              dataObj.range.max = maxInput.value = rangeObj.max;
            }
            flag = true;
          };

        elem.addEventListener('mousedown', function (evnt) {
          var mouseUpCallBack = function () {
            self.applyFilter();
            window.removeEventListener('mousemove', callBack, false);
            window.removeEventListener('mouseup', mouseUpCallBack, false);
          };
          initX = elem.style.left;
          mousePressX = evnt.clientX;
          window.addEventListener('mousemove', callBack, false);
          window.addEventListener('mouseup', mouseUpCallBack, false);
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
          dataObj.range.min = minInput.value = rangeObj.min;
          dataObj.range.max = maxInput.value = rangeObj.max;
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
      'value': minVal
    });
    inputWrapper.appendChild(minInput);
    attachInputEvent(minInput, 'min');

    maxInput = self.createElements('input', {
      'type': 'text',
      'value': maxVal,
      'style': 'float: right;'
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
      containerId = self.config.containerId,
      parentContainer = document.getElementById(containerId),
      wrapper,
      section,
      cards,
      label,
      ul,
      li,
      i,
      j,
      button;

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
      let catObj = filterState[i],
        header,
        cardBody,
        catName = catObj.category;

      if (catObj.visible) {
        section = self.createElements('section');
        wrapper.appendChild(section);

        cards = self.createElements('div', {
          'class': 'fc_ext_filter_card'
        });
        section.appendChild(cards);

        header = self.createElements('header', {
          'style': 'cursor: pointer;'
        });
        cards.appendChild(header);

        label = self.createElements('label', {
          'style': 'cursor: pointer;'
        });
        label.innerHTML = catName.toUpperCase();
        header.appendChild(label);

        cardBody = self.createElements('div', {
          'class': 'fc_ext_filter_card-body'
        });
        cards.appendChild(cardBody);

        header.addEventListener('click', function () {
          var cardBodyStyle = cardBody.style;
          if (cardBodyStyle.display === 'none') {
            cardBodyStyle.display = 'block';
          } else {
            cardBodyStyle.display = 'none';
          }
        }, false);

        if (catObj.type === 'string') {
          ul = self.createElements('ul');
          cardBody.appendChild(ul);

          for (j = 0; j < catObj.items.length; j++) {
            let itemObj = catObj.items[j],
              input,
              itemVal = itemObj.value;

            li = self.createElements('li');
            ul.appendChild(li);

            input = self.createElements('input', {
              'type': 'checkbox',
              'value': itemVal,
              'id': 'fc_ext_filter_item_' + itemVal,
              'checked': itemObj.checked,
              'style': 'cursor: pointer;'
            });
            input.addEventListener('change', function () {
              itemObj.checked = input.checked;
              self.applyFilter();
            }, false);

            itemObj.elem = input;
            input.disabled = itemObj.disabled;
            li.appendChild(input);
            label = self.createElements('label', {
              'for': 'fc_ext_filter_item_' + itemVal,
              'style': 'cursor: pointer;'
            });
            label.innerHTML = itemVal.toUpperCase();
            li.appendChild(label);
          }
        } else {
          self.createSlider(cardBody, catObj);
        }
      }
    }
    section = self.createElements('section');
    wrapper.appendChild(section);
    button = self.createElements('button');
    button.innerHTML = 'Reset';
    button.onclick = function () {
      self.filterState = self.makeCopy(self.originalFilterState);
      self.draw();
      self.applyFilter();
    };
    section.appendChild(button);
    window.filterState = filterState;
    window.originalFilterState = self.originalFilterState;
  }

  // Apply filter to the Data
  applyFilter () {
    var self = this;
    self.filterExt.apply(self.filterState);
  }
}
