function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div;
}

function clickedOwnerRow() {
  console.log(this.getAttribute("id"));
  var ownerString = this.getAttribute("id").split("_")[1];
  var ownerSet = owners[ownerString];
  var allChangeRows = document.getElementsByClassName("differential-changeset");
  var allDiffSummaryRows = document.getElementsByTagName("tr");
  if (ownerString == activeOwner) {
    activeOwner = "";
    for (var n = 0; n < allChangeRows.length; n++) {
      var changeRow = allChangeRows[n];
      changeRow.classList.remove("ghost");
    }
    for (var n = 0; n < allDiffSummaryRows.length; n++) {
      var summaryRow = allDiffSummaryRows[n];
      try {
        if (summaryRow.parentNode.parentNode.classList.contains("aphront-table-view")) {
            summaryRow.classList.remove("ghost");
        }
      } catch(erro) {

      }
    }
    hideDropDizzle();
    return;
  }

  activeOwner = ownerString;

  for (var n = 0; n < allChangeRows.length; n++) {
    var changeRow = allChangeRows[n];
    changeRow.classList.add("ghost");
  }
  for (var n = 0; n < allDiffSummaryRows.length; n++) {
    var summaryRow = allDiffSummaryRows[n];
    try {
      if (summaryRow.parentNode.parentNode.classList.contains("aphront-table-view")) {
          summaryRow.classList.add("ghost");
      }
    } catch(erro) {

    }
  }
  for (var n = 0; n < ownerSet.length; n++) {
    var fid = ownerSet[n]["fid"];
    var rowNode = ownerSet[n]["row"];
    rowNode.classList.remove("ghost");
    var fidDiff = "diff-" + fid;
    document.getElementById(fidDiff).classList.remove("ghost");
  }
  hideDropDizzle();
}

function hideDropDizzle() {
  var dropDownDiv = document.getElementById("theDropDizzle");
  dropDownDiv.classList.remove("show");
}

var activeOwner = "";
var owners = {};
var titles = [];

function selectOwner() {
    var dropDownDiv = document.getElementById("theDropDizzle");
    if (dropDownDiv.classList.contains("show")) {
      var dropDizzle = document.getElementById("theDropDizzle");
      while (dropDizzle.firstChild) {
          dropDizzle.removeChild(dropDizzle.firstChild);
      }
      dropDownDiv.classList.toggle("show");
      return;
    }
    dropDownDiv.classList.toggle("show");
    dropDownDiv.style.zIndex = "1000";

    var dropdownItemTemplate = document.getElementById("dropdownItemTemplate");
    // Note: getElementsByClassName will return an array of elements (even if there's only one).

    owners = {};
    titles = [];

    var allLinkElements = document.getElementsByClassName("phui-handle");
    var dropDizzle = document.getElementById("theDropDizzle");
    while (dropDizzle.firstChild) {
        dropDizzle.removeChild(dropDizzle.firstChild);
    }
    for (var n = 0; n < allLinkElements.length; n++) {
      var node = allLinkElements[n];
      var href = node.getAttribute("href");
      console.log(href);
      if (href != null && href.indexOf("/owners/") != -1) {
        try {
          var ownerString = node.innerHTML;
          var dropdownItem = dropdownItemTemplate.cloneNode();
          dropdownItem.addEventListener("click", clickedOwnerRow);
          dropdownItem.innerHTML = ownerString;
          dropdownItem.setAttribute("id", "owner_" + ownerString);
          var rowParent = node.parentNode.parentNode.parentNode;
          var fileChild = node.parentNode.parentNode.parentNode.getElementsByClassName('differential-toc-file')[0].childNodes[0];
          var fileUnifyingIdentifer = fileChild.getAttribute("href").substr(1); //#diff-xxxxxx
          var row = { "row": rowParent, "owner": ownerString, "dropdownItem": dropdownItem, "fid": fileUnifyingIdentifer};
          var nodes = [];
          if (ownerString in owners) {
            nodes = owners[ownerString];
            titles.push(ownerString);
          } else {
            dropDizzle.appendChild(dropdownItem);
            dropdownItem.addEventListener("click", clickedOwnerRow);
          }
          nodes.push(row);
          owners[ownerString] = nodes;
          dropdownItem.classList.toggle("show");
        } catch(err) {
          console.log(err);
        }
      }
    }
}

var dropdownURL = chrome.extension.getURL("dropdown.html");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var $dropdownHTML = createElementFromHTML(this.responseText);
      var filesChangedActionElementDiv = document.getElementsByClassName("phui-header-action-links")[1];
      filesChangedActionElementDiv.insertBefore($dropdownHTML, filesChangedActionElementDiv.nextSibling);

      var hideMe = document.getElementById("hideMeFromAllSeeingChrome");
      console.log(hideMe);
      butt.addEventListener("click", selectOwner);
    } else if (this.status > 400) {
        console.log('files not found');
    }
};
xhttp.open("GET", dropdownURL, true);
xhttp.send();
