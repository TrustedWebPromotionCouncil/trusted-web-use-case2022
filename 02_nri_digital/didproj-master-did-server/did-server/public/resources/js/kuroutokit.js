/*! KUROUTO kit 0.0.2 | https://playree.github.io/kuroutokit/ | (c) 2020 Kazuki Minakawa (funlab, Inc.) | MIT License */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('kuroutokit', factory) :
  (global = global || self, global.KuroutoKit = factory());
}(this, (function () { 'use strict';
  window.addEventListener('load', () => {
    loaded();
  });

  function loaded() {
    KuroutoKit.initInput();
    KuroutoKit.initAccordion();
    KuroutoKit.initMovableLabel();
  }
})));

let kk_initAccordion = false;
let kk_initInput = false;
let kk_initMovableLabel = false;
let kk_initTab = false;
let kk_initEnableWithCheck = false;
let kk_initModal = false;
let kk_initToast = false;
let kk_modalArgs = null;

function _initTab() {
  [].forEach.call(document.getElementsByClassName('kk-tab'), (el) => {
    const view = document.getElementById(el.getAttribute('for'))
    if(el.checked){
      view.removeAttribute('hidden');
    } else {
      view.setAttribute('hidden', '');
    }
  });
}

function _initAccordion() {
  [].forEach.call(document.getElementsByClassName('kk-accordion'), (el) => {
    if(!el.hasAttribute('closed')) {
      const ac = el.nextElementSibling;
      ac.style.height = ac.scrollHeight + 'px';
    }
  });
}

function _resizeAccordion(target, addHight) {
  const parent = target.parentElement;
  if (parent) {
    const previous = parent.previousElementSibling;
    if (previous) {
      if(previous.classList.contains('kk-accordion')) {
        if(!previous.hasAttribute('closed')) {
          _resizeAccordion(parent, addHight);
          parent.style.height = (parent.scrollHeight + addHight) + 'px';
        }
      }
    }
  }
}

class KuroutoKit {
  static initAccordion() {
    if(kk_initAccordion) return;
    kk_initAccordion = true;

    document.addEventListener('click', (event) => {
      // Accordion.
      if(event.target.classList.contains('kk-accordion')) {
        const ac = event.target.nextElementSibling;
        if(event.target.hasAttribute('closed')) {
          _resizeAccordion(ac, ac.scrollHeight);
          ac.style.height = ac.scrollHeight + 'px';
          event.target.removeAttribute('closed');
        } else {
          ac.style.height = 0;
          event.target.setAttribute('closed', '');
          _resizeAccordion(ac, ac.scrollHeight * -1);
        }
      }
    }, false);

    // Accordion Init
    _initAccordion();
  }

  static convUnitNotation(num) {
    if (!isNaN(num)) {
      let ret = '';
      let _a = 0;
      let _b = Number(num);

      _a = Math.floor(_b / 100000000);
      _b = _b % 100000000;
      if (_a > 0) {
        ret += _a.toLocaleString() + '億';
      }

      _a = Math.floor(_b / 10000);
      _b = _b % 10000;
      if (_a > 0) {
        ret += _a.toLocaleString() + '万';
      }

      if (_b > 0) {
        ret += _b.toLocaleString();
      }

      if (ret == '') {
        return '0';
      }
      return ret;
    }
    return '0';
  }

  static initInput() {
    if(kk_initInput) return;
    kk_initInput = true;

    [].forEach.call(document.getElementsByTagName('INPUT'), (el) => {
      if(el.hasAttribute('invalid')) {
        el.addEventListener('focus', (event) => {
          el.removeAttribute('invalid')
        }, {once:true});
      }
    });
    [].forEach.call(document.getElementsByTagName('TEXTAREA'), (el) => {
      if(el.hasAttribute('invalid')) {
        el.addEventListener('focus', (event) => {
          el.removeAttribute('invalid')
        }, {once:true});
      }
    });
    [].forEach.call(document.getElementsByClassName('kk-input-unit'), (el) => {
      let lb = document.createElement('label');
      lb.setAttribute('id', '_unit_' + el.id);
      lb.classList.add('kk-input-label-end');
      lb.innerHTML = KuroutoKit.convUnitNotation(el.value);
      el.parentElement.appendChild(lb);
      el.addEventListener('input', (event) => {
        document.getElementById('_unit_' + event.target.id).innerHTML = KuroutoKit.convUnitNotation(event.target.value);
      });
    });
  }

  static initMovableLabel() {
    if(kk_initMovableLabel) return;
    kk_initMovableLabel = true;

    document.addEventListener('change', (event) => {
      if(event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA') {
        if(event.target.parentElement.classList.contains('kk-input-field')) {
          if(event.target.value == '') {
            event.target.removeAttribute('kk-active');
          } else {
            event.target.setAttribute('kk-active', '');
          }
        }
      }
    }, false);
    [].forEach.call(document.getElementsByTagName('INPUT'), (el) => {
      if(el.parentElement.classList.contains('kk-input-field')) {
        if(el.value != '') {
          el.setAttribute('kk-active', '');
        }
      }
    });
    [].forEach.call(document.getElementsByTagName('TEXTAREA'), (el) => {
      if(el.parentElement.classList.contains('kk-input-field')) {
        if(el.value != '') {
          el.setAttribute('kk-active', '');
        }
      }
    });
  }

  static initTab() {
    if(kk_initTab) return;
    kk_initTab = true;

    document.addEventListener('change', (event) => {
      if(event.target.tagName == 'INPUT') {
        if(event.target.classList.contains('kk-tab')) {
          _initTab()
        }
      }
    }, false);
    _initTab()
  }

  static initEnableWithCheck() {
    if(kk_initEnableWithCheck) return;
    kk_initEnableWithCheck = true;

    document.addEventListener('change', (event) => {
      if(event.target.tagName == 'INPUT') {
        if(event.target.classList.contains('kk-enable-with-check')) {
          const targets = event.target.getAttribute('target').split(',');
          [].forEach.call(targets, (target) => {
            if(event.target.checked) {
              document.getElementById(target.trim()).removeAttribute('disabled');
            } else {
              document.getElementById(target.trim()).setAttribute('disabled', '');
            }
          });
        } else if(event.target.classList.contains('kk-disable-with-check')) {
          const targets = event.target.getAttribute('target').split(',');
          [].forEach.call(targets, (target) => {
            if(event.target.checked) {
              document.getElementById(target.trim()).setAttribute('disabled', '');
            } else {
              document.getElementById(target.trim()).removeAttribute('disabled');
            }
          });
        }
      }
    }, false);
    [].forEach.call(document.getElementsByTagName('INPUT'), (el) => {
      if(el.classList.contains('kk-enable-with-check')) {
        if(el.hasAttribute('target')) {
          const targets = el.getAttribute('target').split(',');
          [].forEach.call(targets, (target) => {
            if(el.checked) {
              document.getElementById(target.trim()).removeAttribute('disabled');
            } else {
              document.getElementById(target.trim()).setAttribute('disabled', '');
            }
          });
        }
      } else if(el.classList.contains('kk-disable-with-check')) {
        if(el.hasAttribute('target')) {
          const targets = el.getAttribute('target').split(',');
          [].forEach.call(targets, (target) => {
            if(el.checked) {
              document.getElementById(target.trim()).setAttribute('disabled', '');
            } else {
              document.getElementById(target.trim()).removeAttribute('disabled');
            }
          });
        }
      }
    });
  }

  static initModal() {
    if(kk_initModal) return;
    kk_initModal = true;

    var body_element = document.getElementsByTagName('body')[0];
    body_element.insertAdjacentHTML('beforeend',
      '<div id="kk_modal" class="kk-modal" closed><div id="kk_modal_inner">' + 
        '<div id="kk_modal_title" class="kk-border-bottom kk-font-bold kk-padding-ss"></div>' +
        '<div id="kk_modal_contents" class="kk-margin-top kk-padding-s"></div>' +
        '<div class="kk-margin-top kk-padding" grid-col>' + 
          '<div class="kk-col5"><button id="kk_modal_no" class="kk-button" onclick="KuroutoKit.onModalNo();"></button></div>' +
          '<div class="kk-col2"></div>' +
          '<div class="kk-col5"><button id="kk_modal_yes" theme="primary" class="kk-button" onclick="KuroutoKit.onModalYes();"></button></div>' +
        '</div>' +
      '</div></div>');
    
    document.getElementById('kk_modal').addEventListener('click', (e) => {
      KuroutoKit.closeModal();
    });
    document.getElementById('kk_modal_inner').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  static openModal(args) {
    kk_modalArgs = args;
    document.getElementById('kk_modal_title').innerHTML = kk_modalArgs.title;
    document.getElementById('kk_modal_contents').innerHTML = kk_modalArgs.contents;
    if ('yes_str' in kk_modalArgs) {
      document.getElementById('kk_modal_yes').innerHTML = kk_modalArgs.yes_str;
    } else {
      document.getElementById('kk_modal_yes').innerHTML = 'はい';
    }
    if ('no_str' in kk_modalArgs) {
      document.getElementById('kk_modal_no').innerHTML = kk_modalArgs.no_str;
    } else {
      document.getElementById('kk_modal_no').innerHTML = 'いいえ';
    }
    document.getElementById('kk_modal').removeAttribute('closed');
  }
  static closeModal() {
    document.getElementById('kk_modal').setAttribute('closed', '');
  }
  static wrapModalClick(element_id, args) {
    document.getElementById(element_id).addEventListener("click", (event) => {
      if (event.isTrusted) {
        // clickをキャンセル
        event.stopPropagation();
        event.preventDefault();
        args.yes_func = function() {event.target.click();}
        delete args.no_func;
        KuroutoKit.openModal(args);
      }
    });
  }
  static wrapModalClickByName(element_name, args) {
    let items = document.getElementsByName(element_name);
    items.forEach( (item) => {
      item.addEventListener("click", (event) => {
        if (event.isTrusted) {
          // clickをキャンセル
          event.stopPropagation();
          event.preventDefault();
          args.yes_func = function() {event.target.click();}
          delete args.no_func;
          KuroutoKit.openModal(args);
        }
      });
    });
  }
  static onModalYes() {
    if ('yes_func' in kk_modalArgs) {
      kk_modalArgs.yes_func();
    }
  }
  static onModalNo() {
    if ('no_func' in kk_modalArgs) {
      kk_modalArgs.no_func();
    } else {
      KuroutoKit.closeModal();
    }
  }

  static initToast() {
    if(kk_initToast) return;
    kk_initToast = true;

    var body_element = document.getElementsByTagName('body')[0];
    body_element.insertAdjacentHTML('beforeend',
      '<div id="kk_toast" class="kk-toast"></div>');
  }

  static showToast(text, theme='infomation', wait=0) {
    KuroutoKit.initToast();

    var elm = document.createElement('div');
    elm.innerText = text;
    elm.classList.add('kk-message');
    elm.setAttribute('theme', theme);
    document.getElementById('kk_toast').insertAdjacentElement('beforeend', elm);
    elm.style.top = (elm.scrollHeight + 10) + 'px';
    
    setTimeout(()=>{
      elm.style.top = '0';
    }, 10 + wait);

    setTimeout(()=>{
      elm.style.opacity = 0;
      setTimeout(()=>{
        elm.remove();
      },500);
    }, 3000);
  }
}