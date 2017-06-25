var assert = chai.assert,
    nav = null,
    server = null;

menuMock = {
    items: [{
            label: "Work",
            url: "#/work",
            items: []
        },
        {
            label: "About",
            url: "#/about",
            items: [{
                    label: "What we do",
                    url: "#/about/what-we-do"
                },
                {
                    label: "How we work",
                    url: "#/about/how-we-work"
                },
                {
                    label: "Leadership",
                    url: "#/about/leadership"
                }
            ]
        }
    ]
};

describe('nav testing...', function() {

    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    var nav = document.createElement('div');
    beforeEach(function() {
        nav.setAttribute('class', 'nav-bar');
        document.body.appendChild(nav);

        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.respondWith("GET", "./api/nav.json", [200, { "Content-Type": "application/json" }, JSON.stringify(menuMock)]);
    });

    afterEach(function() {
        while (nav.firstChild)
            nav.removeChild(nav.firstChild);
        server.restore();
    });

    describe('Testing menu click event', function() {
        it('should ADD opened class on click on Nav Item (li)', function(done) {
            var navUl = document.getElementById('nav').firstElementChild;
            var eventClick = new Event('click');
            var navLi = navUl.lastElementChild;
            navLi.firstChild.dispatchEvent(eventClick);
            assert.equal(navLi.classList[0], 'opened');
            done();
        });
    });
});