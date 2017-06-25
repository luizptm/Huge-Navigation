(function() {
    var logo = document.getElementsByClassName('logo')[0];
    var toogleButton = document.getElementsByClassName('toogle')[0];
    var navbar = document.getElementsByClassName("nav-bar")[0];

    if (toogleButton && toogleButton !== undefined) {
        toogleButton.addEventListener('click', toogleNavBar);
    }

    var overlay = document.getElementsByClassName("overlay")[0];
    if (overlay && overlay !== undefined) {
        overlay.addEventListener('click', function() {
            if (navBarIsOpened())
                closeNavBar();
            else
                toogleSubItem();
        });
    }

    getResources();

    /**
     * Get resources from JSON.
     */
    /** @function getResources */
    function getResources() {
        ajax_get('./api/nav.json', function(data) {
            var logo = '<a class="logo"><img src="/images/HUGE-white.png" alt="HUGE"/></a>';
            var navigation = createNavigation(data.items);
            navbar.insertAdjacentHTML('afterbegin', logo + navigation);

            var items = document.getElementsByClassName('nav-item');
            for (var count = 0; count < items.length; count++) {
                if (items.item(count).childNodes.length > 1) {
                    items.item(count).addEventListener('click', toogleSubItem);
                }
            }

            var countLinks = navbar.getElementsByTagName('a');
            for (count = 0; count < countLinks.length; count++) {
                if (!countLinks[count].hasChildNodes()) {
                    countLinks[count].parentElement.removeChild(countLinks[count]);
                    countLinks[count].parentElement.removeChild(countLinks[count]);
                }
            }
        });
    }

    /**
     * Private function to load menu data JSON from a URL.
     */
    /** @function ajax_get */
    function ajax_get(url, callback) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                    callback(data);
                } catch (err) {
                    console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    /**
     * Private function to create and populate a Ul list and insert inside a nav.
     */
    /** @function createNavigation */
    function createNavigation(items) {
        var menu = "";
        var i = 0;
        if (items === undefined || items.length === 0) return menu;
        while (i < items.length) {
            var item = items[i];
            var childItems = item && item.items && item.items.length;
            var li = '<li class="nav-item">';
            if (item !== undefined) {
                li += '<a ' + (childItems ? '' : 'href="' + item.url + '"') + '>';
                if (item.label !== "")
                    li += '<span class="nav-item-text">' + item.label + '</span>';
                if (childItems) {
                    li += '<span class="nav-item-icon"></span>';
                    li += createNavigation(item.items);
                }
                li += '</a>';
            }
            menu += li;
            i++;
        }
        return '<ul class="nav">' + menu + '</ul>';
    }

    /**
     * Private function to create and populate a Ul list and insert inside a nav.
     */
    /** @function createNavigation2 */
    function createNavigation2(items) {
        var menu = "";
        var i = 0;
        var navMainUl = document.createElement('ul');
        navMainUl.setAttribute('class', "nav");
        if (items === undefined || items.length === 0) return menu;
        while (i < items.length) {
            var item = items[i];
            var childItems = item && item.items && item.items.length;
            var navLi = document.createElement('li');
            navLi.setAttribute('class', "nav-item");

            var navLink = document.createElement('a');
            var spanText = document.createElement('span');
            spanText.innerHTML = item.label;
            spanText.setAttribute('class', "nav-item-text");

            navLink.appendChild(spanText);
            navLi.appendChild(navLink);
            if (childItems) {
                var subNavUl = document.createElement('ul');
                subNavUl.setAttribute('class', "nav");
                var spanIcon = document.createElement('span');
                spanIcon.setAttribute('class', "nav-item-icon");
                for (var j = 0; j < childItems; j++) {
                    var subnavLi = document.createElement('li');
                    subnavLi.setAttribute('class', "nav-item");
                    var sub_item = item.items[j];

                    var subnavLink = document.createElement('a');
                    subnavLink.setAttribute('href', sub_item.url);
                    subnavLink.addEventListener('click', toogleSubItem);

                    spanText = document.createElement('span');
                    spanText.innerHTML = sub_item.label;
                    spanText.setAttribute('class', "nav-item-text");

                    subnavLink.appendChild(spanText);
                    subnavLink.appendChild(spanIcon);
                    subnavLi.appendChild(subnavLink);
                    subNavUl.appendChild(subnavLi);
                }
                navLi.appendChild(subNavUl);
            }
            navMainUl.appendChild(navLi);
            i++;
        }
        return '<ul class="nav">' + getOuterHtml(navMainUl) + '</ul>';
    }

    /**
     * Private function that toogle subitem.
     */
    /** @function toogleSubItem  */
    function toogleSubItem() {
        var oldItem = document.getElementsByClassName('nav-item open')[0];
        if (oldItem) {
            removeClass(oldItem, 'open');
        }
        if (this && oldItem !== this) {
            this.className += ' open';
        }
        if (!navBarIsOpened() && hasSubItemOpened() && !overlayIsAppearing()) {
            showOverlay();
        }
        if (!navBarIsOpened() && !hasSubItemOpened() && overlayIsAppearing()) {
            hideOverlay();
        }
    }

    /**
     * Private function that verify if has subitem opened.
     */
    /** @function hasSubItemOpened */
    function hasSubItemOpened() {
        return document.getElementsByClassName('nav-item open').length;
    }

    /**
     * Private function that .
     */
    /** @function toogleNavBar */
    function toogleNavBar() {
        if (navBarIsOpened()) {
            closeNavBar();
        } else {
            openNavBar();
        }
    }

    /**
     * Private function that open navbar.
     */
    /** @function openNavBar */
    function openNavBar() {
        if (navBarIsOpened())
            return;

        showHideOverlay();
        removeClass(toogleButton, 'open');
        toogleButton.className += ' close';
        navbar.className += ' open';
        logo.className += ' show';
    }

    /**
     * Private function that close navbar.
     */
    /** @function closeNavBar */
    function closeNavBar() {
        if (!navBarIsOpened())
            return;

        showHideOverlay();
        removeClass(toogleButton, 'close');
        toogleButton.className += ' open';
        removeClass(navbar, 'open');
        removeClass(logo, 'show');
    }

    /**
     * Private function that verify status of navbar.
     */
    /** @function navBarIsOpened */
    function navBarIsOpened() {
        return navbar.className.indexOf('open') >= 0;
    }

    /**
     * Private function that verify overlay.
     */
    /** @function overlayIsAppearing */
    function overlayIsAppearing() {
        return overlay.className.indexOf('hide') < 0;
    }

    /**
     * Private function that show/hide overlay.
     */
    /** @function showHideOverlay */
    function showHideOverlay() {
        if (overlay.className.indexOf("hide") > 0) {
            removeClass(overlay, 'hide');
            document.body.style.overflowY = 'hidden';
        } else {
            overlay.className += ' hide';
            document.body.style.overflowY = 'initial';
        }
    }

    /**
     * Private function that remove class.
     */
    /** @function removeClass */
    function removeClass(element, className) {
        var classArray = element.className.split(' ');
        var index = classArray.indexOf(className);
        classArray.splice(index, 1);
        element.className = classArray.toString();
    }

    /**
     * Private function that gets the outer html.
     */
    /** @function getOuterHtml */
    function getOuterHtml(node) {
        var parent = node.parentNode;
        var element = document.createElement(parent.tagName);
        element.appendChild(node);
        var html = element.innerHTML;
        parent.appendChild(node);
        return html;
    }
})();