'use strict';

class FilterVisual {

  constructor (filterState, containerId, filterExt) {
    /**
     * @private
     */
    this.filterState = filterState;
    this.filterExt = filterExt;
    this.config = {};
    this.config.containerId = containerId;
    this.draw();
  }

  draw () {
    var self = this,
      filterState = self.filterState,
      containerId = self.config.containerId,
      parentContainer = document.getElementById(containerId),
      wrapper,
      section,
      cards,
      header,
      input,
      label,
      cardBody,
      ul,
      li,
      i,
      j,
      catName,
      catObj,
      itemObj,
      itemVal,
      button;

    if (!parentContainer) {
      return;
    }

    parentContainer.innerHTML = '';

    wrapper = self.createElements('div', {
      'class': 'fc_ext_filter_cont'
    });
    wrapper.setAttribute('style', 'overflow-y: scroll; overflow-x: hidden;');
    wrapper.style.height = parentContainer.style.height;

    for (i = 0; i < filterState.length; i++) {
      catObj = filterState[i];
      catName = catObj.category;

      if (catObj.visible) {
        section = self.createElements('section');
        wrapper.appendChild(section);

        cards = self.createElements('div', {
          'class': 'fc_ext_filter_card'
        });
        section.appendChild(cards);

        header = self.createElements('header');
        cards.appendChild(header);

        input = self.createElements('input', {
          'type': 'checkbox',
          'value': catName,
          'id': 'fc_ext_filter_cat_' + catName,
          'checked': catObj.checked
        });
        catObj.elem = input;
        input.disabled = catObj.disabled;
        header.appendChild(input);

        label = self.createElements('label', {
          'for': 'fc_ext_filter_cat_' + catName
        });
        label.innerHTML = catName;
        header.appendChild(label);

        cardBody = self.createElements('div', {
          'class': 'fc_ext_filter_card-body'
        });
        cards.appendChild(cardBody);

        if (catObj.type === 'string') {
          ul = self.createElements('ul');
          cardBody.appendChild(ul);

          for (j = 0; j < catObj.items.length; j++) {
            itemObj = catObj.items[j];
            itemVal = itemObj.value;

            li = self.createElements('li');
            ul.appendChild(li);

            input = self.createElements('input', {
              'type': 'checkbox',
              'value': itemVal,
              'id': 'fc_ext_filter_item_' + itemVal,
              'checked': itemObj.checked
            });
            itemObj.elem = input;
            input.disabled = itemObj.disabled;
            li.appendChild(input);
            label = self.createElements('label', {
              'for': 'fc_ext_filter_item_' + itemVal
            });
            label.innerHTML = itemVal;
            li.appendChild(label);
          }
        }
      }
    }
    section = self.createElements('section');
    wrapper.appendChild(section);
    button = self.createElements('button');
    button.innerHTML = 'Apply';
    button.onclick = self.applyFilter.bind(this);
    section.appendChild(button);

    parentContainer.appendChild(wrapper);
    window.filterState = filterState;
  }

  applyFilter () {
    var self = this,
      filterState = self.filterState,
      i,
      j,
      catObj,
      itemObj,
      catElem,
      itemElem;

    for (i = 0; i < filterState.length; i++) {
      catObj = filterState[i];
      catElem = catObj.elem;

      if (catObj.type === 'string') {
        if (catElem && !catObj.disabled) {
          catObj.checked = catElem.checked;
        }
        for (j = 0; j < catObj.items.length; j++) {
          itemObj = catObj.items[j];
          itemElem = itemObj.elem;
          if (itemElem && !itemObj.disabled) {
            itemObj.checked = itemElem.checked;
          }
        }
      }
    }
    self.filterExt.apply(filterState);
  }

  createElements (name, attr) {
    var elem = document.createElement(name),
      key;

    for (key in attr) {
      elem.setAttribute(key, attr[key]);
    }

    return elem;
  }
}
