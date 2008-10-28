// Anonymous function, keep the global namespace squeeky clean..
(function() {

// For browserFun
// TODO:
// Make it so that you can make the code editing window wider...
// Make it so that you can click links to the documentation of each object

// TODO: make css rules for minimizing stuff easily

var fileTypes = {
  'js' : 'javascript', 
  'html' : 'html',
  'php' : 'php'
};

function InteractiveSample(){
  this.categories = [];
  this.subCategories = [];
  this.codeTitles = [];
  this.selectCode;
  this.codeDiv;
  this.runBox;
  this.codeLIs = [];
  this.currentCode = new Object();
  this.curI = '';
	this.cleanWindowObj;
	
  // Assume we're offline until we know that file reading doesn't work
	this.online = false;
	
	this.uiEffects;
	this.runBox;
};

function sortByCategory(a, b) {
  return a.category > b.category;
}

function sortByName(a, b) {
  return a.sampleName > b.sampleName;
}

function nameToHashName(name) {
  var hashName = name.toLowerCase();
  hashName = hashName.replace(/ /g, '_');
  return hashName;
}

InteractiveSample.prototype.init = function(codeDiv) {
  this.codeDiv = codeDiv;
  this.createCategories();
  this.addShowHideClicks();
  
    // TODO: Sort samples
    // codeArray.sort(sortByCategory);
    // 
    // for (var i=0; i < codeArray.length; i++) {
    //   codeArray[i].samples.sort(sortByName);
    // }
  
  
    // This is so that we can restore the first level of the window object
    // after we run a sample... so samples can get run a lot and not clutter
    // the window object.
  this.cleanWindowObj = singleLevelKeyCopy(window);
  
  this.uiEffects = new UIEffects();
  this.uiEffects.init(this);
  this.runBox = new RunBox();
  this.runBox.init(this);
};

InteractiveSample.prototype.createCategories = function() {
  // codeArray is from interactive_samples.js
  this.selectCode = _gel('selectCode');
  for (var i=0; i < codeArray.length; i++) {
    var category = codeArray[i].category;
    var container = subCategory = categoryDiv = subCategoryDiv = null;
    
    if (category.indexOf('-') != -1) {
      // that means that this category is a subcategory
      var categorySplit = category.split('-');
      category = categorySplit[0];
      subCategory = categorySplit[1];
    }

    categoryDiv = document.getElementById(category);
    if (categoryDiv == null) {
      categoryDiv = _cel('span');
      categoryDiv.className = 'category categoryClosed';
      categoryDiv.id = category;
      var catName = _cel('span');
      catName.className = 'categoryTitle';
      var img = _cel('img');
      img.className = 'expand';
      img.src = 'images/cleardot.gif';
      // addEvent(img, 'click', this.toggleExpand(img), false);

      catName.appendChild(img);
      catName.innerHTML += category;

      categoryDiv.appendChild(catName);
      this.selectCode.appendChild(categoryDiv);
      
      this.categories.push(categoryDiv);
    }
    
    if (subCategory) {
      subCategoryDiv = document.createElement('div');
      var subCatName = _cel('span');
      subCatName.className = 'subCategoryTitle';
      
      var img = _cel('img');
      img.className = 'collapse';
      img.src = 'images/cleardot.gif';
      // addEvent(img, 'click', this.toggleExpand(img), false);
      
      subCatName.appendChild(img);
      subCatName.innerHTML += subCategory;
      
      subCategoryDiv.appendChild(subCatName);
      categoryDiv.appendChild(subCategoryDiv);
    }
    
    container = subCategoryDiv || categoryDiv;
    
    var ul = _cel('ul');
    ul.className = 'categoryItems';
    
    container.appendChild(ul);
    
    for (var j=0; j < codeArray[i].samples.length; j++) {
      var item = codeArray[i].samples[j];
      var li = _cel('li');
      
      li.innerHTML = item.sampleName;
      
      this.codeTitles.push(li);
      var files = codeArray[i].samples[j].files;
      addEvent(li, 'click', this.showSample(this, files, li));
      
      if (i == 0 && j == 0) {
        this.showSample(this, files, li, true)();
        this.hideAllCategoriesExcept(categoryDiv);
      }
      
      if (window.location.hash.length > 0) {
        var hashName = nameToHashName(item.sampleName);
        if (window.location.hash.substring(1) == hashName) {
          this.showSample(this, files, li)();
          this.hideAllCategoriesExcept(categoryDiv);
        }
      }
      
      this.codeLIs.push(li);
      ul.appendChild(li);
    }
    
    if (container != categoryDiv) {
      this.subCategories.push(container);
    }
  }
};

InteractiveSample.prototype.toggleShowHideLIs = function(category) {
  return function() {
    var ul = category.nextSibling;
    var el = category.childNodes[0];
    if (el.className == 'expand') 
      el.className = 'collapse';
    else
      el.className = 'expand';
    
    if (ul.style.display == 'none') {
      ul.style.display = 'block';
    } else {
      ul.style.display = 'none';
    }
  };
};

InteractiveSample.prototype.toggleShowHideSubCategories = function(category) {
  return function() {
    // Change the collapse img to a + or a -
    var collapseImg = category.childNodes[0].childNodes[0];
    if (collapseImg.className == 'expand') {
      collapseImg.className = 'collapse';
      category.className = 'category categoryOpen';
    } else {
      collapseImg.className = 'expand';
      category.className = 'category categoryClosed';
    }
  };
};

InteractiveSample.prototype.hideAllCategoriesExcept = function(category) {
  for (var i=0; i < this.categories.length; i++) {
    var curCategory = this.categories[i];
    var collapseImg = curCategory.childNodes[0].childNodes[0];
    if (curCategory != category) {
      curCategory.className = 'category categoryClosed';
      collapseImg.className = 'expand';
    } else {
      curCategory.className = 'category categoryOpen';
      collapseImg.className = 'collapse';
    }
  };
};

InteractiveSample.prototype.addShowHideClicks = function() {
  for (var i=0; i < this.categories.length; i++) {
    var cat = this.categories[i];
    var catTitle = cat.childNodes[0];
    addEvent(catTitle, 'click', this.toggleShowHideSubCategories(cat));
  }
  
  for (var i=0; i < this.subCategories.length; i++) {
    var subCatTitle = this.subCategories[i].childNodes[0];
    addEvent(subCatTitle, 'click', this.toggleShowHideLIs(subCatTitle));
  };
};

InteractiveSample.prototype.loadLocally = function(relativeUrl, filename, fileType, opt_changeCodeMirror) {
  // readFile is in utils.js
  var data = readFile(relativeUrl);    
  if (data == null) {
    this.online = true;
    return false;
  }
  if (opt_changeCodeMirror == true) {
    this.changeCodeMirror(data, fileType);
  }
  is_instance.currentCode[filename] = {
    code : data
  };  
  console.log(relativeUrl + ': loaded locally.');
  this.runCode();
  return true;
}

InteractiveSample.prototype.loadRemotely = function(relativeUrl, filename, fileType, opt_changeCodeMirror) {
  is_instance = this;
  downloadUrl(relativeUrl, function(data, status) {
    if (opt_changeCodeMirror == true) {
      is_instance.changeCodeMirror(data, fileType);
    }
    is_instance.currentCode[filename] = {
      code : data
    };
    is_instance.runCode();
  });
}

InteractiveSample.prototype.loadCode = function(filename, opt_changeCodeMirror) {
  // If the code is in the currentCode buffer, then grab it there
  // otherwise, load it via XHR
  // If opt_changeCodeMirror is specified, load it into the window
  
  // Get filetype
  var filenameSplit = filename.split('.');
  var extension = filenameSplit[filenameSplit.length - 1];
  var fileType = fileTypes[extension.toLowerCase()];
  var inBuffer = (this.currentCode[filename] && this.currentCode[filename].code) ? true : false;
  if (inBuffer && opt_changeCodeMirror == true) {
    this.changeCodeMirror(this.currentCode[filename].code, fileType);
  } else {
    var relativeUrl = 'samples/' + filename;
    
    is_instance = this;
    
    if (!this.online) {
      this.loadLocally(relativeUrl, filename, fileType, opt_changeCodeMirror);
    } 
    
    if (this.online) {
      this.loadRemotely(relativeUrl, filename, fileType, opt_changeCodeMirror);
    }
  }
};

// TODO: can is_instance just be set as is_instance = this above return function()
InteractiveSample.prototype.showSample = function(is_instance, files, thisLI, def) {
  return function() {
    var codeDiv = is_instance.codeDiv;
    var codeLIs = is_instance.codeLIs;
    for (var i=0; i < codeLIs.length; i++) {
      codeLIs[i].className = '';
    }
    
    // For linking purposes
    if (!def) {
      window.location.hash = nameToHashName(thisLI.innerHTML);
    }
    
    // Make code selected designate this as selected
    thisLI.className = 'selected';
    
    is_instance.currentCode = new Object();
    
    
    // add file names at top
    // var tab_bar = _gel('tab_bar');
    // tab_bar.innerHTML = '';
    
    for (var i=0; i < files.length; i++) {
      var file = files[i];
      var index = i;
      
      var tabClass = 'lb';
      if (index == 0) {
        tabClass = 'db';
        is_instance.loadCode(file, true);
      } else {
        is_instance.loadCode(file, false);
      }
        
      
      var containerDiv = _cel('div');
      containerDiv.className = 'roundedcornr_box';
      addEvent(containerDiv, 'click', is_instance.changeTab(file, is_instance));
      
      var html = '<div class="' + tabClass + '_top" ><div></div></div>';
      html += '<div class="' + tabClass + '_roundedcornr_content" >';
      html += file;
      html += '</div>';
      
      containerDiv.innerHTML = html;
      
      // tab_bar.appendChild(containerDiv);
    }
    
    // is_instance.loadCode(files[0], textArea);
    is_instance.curI = files[0];
  };
};

InteractiveSample.prototype.changeTab = function(i, is_instance) {
  return function() {
    var siblings = this.parentNode.childNodes;
    is_instance.currentCode[is_instance.curI].code = is_instance.getCode();
    
    // Swap the colors of the tabs
    for (var z=0; z < siblings.length; z++) {
      if (siblings[z].childNodes[1].innerHTML == i) {
        siblings[z].childNodes[0].className = 'db_top';
        siblings[z].childNodes[1].className = 'db_roundedcornr_content';
      } else {
        siblings[z].childNodes[0].className = 'lb_top';
        siblings[z].childNodes[1].className = 'lb_roundedcornr_content';
      }
    }
    
    is_instance.loadCode(i, true);    
    is_instance.curI = i;
  };
};

InteractiveSample.prototype.decreaseCodeBoxHeight = function() {
  var curHeight = this.textArea.style.height;
  curHeight = curHeight.substr(0, curHeight.indexOf('px'));
  var newHeight = parseInt(curHeight) - this.adjustCodeBoxAmount;
  newHeight += 'px';
  this.textArea.style.height = newHeight;
};

InteractiveSample.prototype.runCode = function() {
  try {
    this.currentCode[this.curI].code = this.getCode();
    is.codeToRun = this.getCode();
    this.runBox.runCode();
  } catch (e) {
    // this will fail sometimes and that's OK.  It just means that CodeMirror
    // doesn't have the code loaded that we are trying to use.
  }
};

InteractiveSample.prototype.changeCodeMirror = function(content, lang) {
  try {
    window.jsEditor.setCode(content);
  } catch (e) {
    // hasn't loaded
  }
  
};

InteractiveSample.prototype.getCode = function() {
  return window.jsEditor.getCode();
};

// Todo have the window automatically size to the size of the window

InteractiveSample.prototype.increaseWidth = function() {
  var container = document.getElementById('container');
  var curWidth = container.style.maxWidth = '1800px';
};

/* 
 * UIEffects sets up all of the jQuery UI stuff for draggable etc.
 */
function UIEffects() {
  this.is;
  this.mousePos;
}

UIEffects.prototype.init = function(is) {
  this.is = is;
  
  this.mousePos = {
    'x': 0,
    'y': 0
  }
  
  var me = this;
  // So that we can track the mouse movement
  $().mousemove(function(e){
    me.mousePos.x = e.pageX;
    me.mousePos.y = e.pageY;
  }); 
  
  this.setOutputDivResizable();
  this.setOutputDivDraggable();
  this.setOutputDivShadow();
  this.setWindowResize();
};

UIEffects.prototype.setWindowResize = function() {
  var me = this;
  $(window).bind('resize', function() {
    me.setOutputDivShadow();
  });
};


UIEffects.prototype.setOutputDivResizable = function() {
  var me = this;
  var width = $("#outputDiv").width();
  var height = $("#outputDiv").height();
  $("#outputDiv").css('position', 'absolute').css('width', width).css('height', height);
  $("#outputDiv").resizable({
    handles: "se",
    helper: 'proxy',
    resize: function(e, ui) {
      me.updateDragSafeDiv();
    },
    stop: function(e, ui) {
      me.hideDragSafeDiv();
      me.setShadowDivSize('shadowContainer', ui.size.width, ui.size.height);
      me.is.runBox.setNewCodeRunIframeWidthHeight($('#runFrame'));
    }
  });
};

UIEffects.prototype.setOutputDivDraggable = function(first_argument) {
  var me = this;
  $("#outputDiv").draggable({ 
    handle: "outputDrag",
    drag: function(e, ui) {
      me.updateDragSafeDiv();
      me.setShadowDivPosition('shadowContainer', ui.position.top, ui.position.left);
    },
    stop: function(e, ui) {
      me.hideDragSafeDiv();
    }
  });
};

UIEffects.prototype.setOutputDivShadow = function() {
  var outputContainer = $("#outputDiv");
  var outputContainerWidth = $(outputContainer).width();
  var outputContainerHeight = $(outputContainer).height();
  var outputContainerPos = $(outputContainer).position();
  
  this.setShadowDivSize('shadowContainer', outputContainerWidth, outputContainerHeight);
  this.setShadowDivPosition('shadowContainer', outputContainerPos.top, outputContainerPos.left);
  this.showShadowDiv('shadowContainer');
};

UIEffects.prototype.updateDragSafeDiv = function() {
  var newTop = this.mousePos.y - 300;
  var newLeft = this.mousePos.x - 300;
  $('#dragsafe').css('top', newTop + 'px').css('left', newLeft + 'px');
}

UIEffects.prototype.hideDragSafeDiv = function() {
  $('#dragsafe').css('top', '-600px').css('left', '-600px');
}

UIEffects.prototype.showShadowDiv = function(containerName) {
  $('#' + containerName).show();
}

UIEffects.prototype.setShadowDivPosition = function(containerName, top, left) {
  containerName = '#' + containerName;
  var shadowContainer = $(containerName);
  $(shadowContainer).css('top', top + 'px').css('left', left + 'px');
}

UIEffects.prototype.setShadowDivSize = function(containerName, newWidth, newHeight) {
  containerName = '#' + containerName;
  var shadowContainer = $(containerName);
  var oldWidth = $(shadowContainer).width();
  var oldHeight = $(shadowContainer).height();
  
  var changeWidth = newWidth - oldWidth;
  var changeHeight = newHeight - oldHeight;
  
  // Make bottom 1px shadow width change
  var bShadow = $(containerName + " div.bShadow")[0];
  var bShadowWidth = $(bShadow).width();
  var newBShadowWidth = bShadowWidth + changeWidth;
  $(bShadow).css('width', newBShadowWidth + 'px');
  
  // Make right 1px shadow height change
  var rShadow = $(containerName + " div.rShadow")[0];
  var rShadowHeight = $(rShadow).height();
  var newRShadowHeight = rShadowHeight + changeHeight;
  $(rShadow).css('height', newRShadowHeight + 'px');
  
  var bShadows = $(containerName + " .bottomShadows");
  var bShadowsCurTop = $(bShadows[0]).position().top;
  // alert(bShadowsCurTop);
  var newBShadowsTop = bShadowsCurTop + changeHeight;
  $(bShadows).css('top', newBShadowsTop + 'px');
  
  $(shadowContainer).css('width', newWidth + 'px').css('height', newHeight + 'px');
}


function RunBox() {
  this.outputContainer;
  this.shadowContainer;
  this.runBoxPoppedOut;
  this.popoutWindow;
  this.is;
  this.runBoxDiv;
  this.popoutRunBoxDiv;
}

RunBox.prototype.init = function(is) {
  this.runBoxDiv = document.getElementById('runbox');
  this.runBoxPoppedOut = false;
  this.outputContainer = $("#outputContainer");
  this.shadowContainer = $("#shadowContainer");
  this.is = is;
};

RunBox.prototype.hideOnScreenRun = function() {
  // body...
};

RunBox.prototype.createIframe = function() {
  var iFrame = $('<iframe src="iframes/search.html" id="runFrame"></iframe>');
  iFrame = this.setNewCodeRunIframeWidthHeight(iFrame);
  $(this.runBoxDiv).empty().append(iFrame);
};


RunBox.prototype.setNewCodeRunIframeWidthHeight = function(iFrame) {
  var fakeDiv = $('<div id="fakeCalcDiv"></div>');
  $(this.runBoxDiv).prepend(fakeDiv);
  var outputDiv = $('#outputDiv');
  var containerHeight = outputDiv.height();
  var containerCurPos = outputDiv.offset();
  var curDivPos = $(fakeDiv).offset();
  var height = containerHeight - curDivPos.top + containerCurPos.top - 15;
  var width = outputDiv.width();

  return $(iFrame).css('height', height + 'px');
}

RunBox.prototype.runCode = function() {
  if (this.runBoxPoppedOut == false) {
    this.createIframe();
  } else {
    // Run code in the popout window
    var runbox = this.popoutWindow.document.getElementById('runbox');
    runbox.innerHTML = '';

    this.popoutWindow.is = {
      'codeToRun': this.is.codeToRun
    };

    var newFrame = $('<iframe src="../iframes/search.html" id="runFrame"></iframe>').get(0);
    runbox.appendChild(newFrame);
  }
};

RunBox.prototype.changeToPopout = function() {
  this.runBoxPoppedOut = true;
  $(this.outputContainer).hide();
  $(this.shadowContainer).hide();
  this.popoutWindow = window.open('iframes/popout.html','popout', 'left=20,top=20,width=600,height=500,toolbar=1,resizable=1');
  this.popoutWindow.is = {
    'codeToRun': this.is.codeToRun
  };
  var me = this;
  addEvent(this.popoutWindow, 'load', function() {
    me.is.runCode();
    
    var run = me.popoutWindow.document.getElementById('run');
    
    window.addEvent(run, 'click', function() {
      me.is.runCode();
    });
    
    var popin = me.popoutWindow.document.getElementById('popin');
    
    window.addEvent(popin, 'click', function() {
      me.changeToInline();
      me.popoutWindow.close();    
    });
     
  });
  // this.popoutWindow.onload = function() {
  //   var run = me.popoutWindow.document.getElementById('run');
  //   run.onclick = function() {
  //     me.is.runCode();
  //   }
  //   
  //   var popin = me.popoutWindow.document.getElementById('popin');
  //   popin.onclick = function() {
  //     me.changeToInline();
  //     me.popoutWindow.close();
  //   }
  //   
  //   me.is.runCode();
  // }
}

RunBox.prototype.changeToInline = function() {
  this.runBoxPoppedOut = false;
  $(this.outputContainer).show();
  $(this.shadowContainer).show();
  this.is.runCode();
};


// Create and export the interactive sample instance to the global.
is = new InteractiveSample();
window.is = is;
})();