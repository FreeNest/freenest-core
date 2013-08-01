/*********************************************************************************************************************************************
* NEST PROJECT PLATFORM WIKIWORD SCRIPT
* Copyright JAMK University of Applied Sciences 2011
* Teemu Myller, 12.8.2011
* Riku Hokkanen, 2011
*
* Replaces WikiWords on a page with links if the named topic exists.
*
*Replaces either Web.WikiWord or WikiWord (and assumes default web).
*At the moment Notexistingweb.WikiWord is also accepted, and makes a link to
*Defaultweb.WikiWord.
*
*Requires wikiTopics.php
***********************************************************************************************************************************************/
var $j = jQuery.noConflict();

var WikiWordLinks = function () {

    /*Webs which will be linked*/
    var webs = ["Main", "Requirements", "System"],

    /* If WikiWord doesn't contain web, default web to link to */
        defaultWeb = "Main",

    /* Url of the wiki */
        wikiUrl = "/ProjectFOSWIKI/bin/view/",
        wikiFolder = 'ProjectFOSWIKI',

    /* Now what could this be? */
        phpLocation = '/navibar/php/wikiTopics.php',

    /* Elements/classes to exclude from linking. Jquery syntax, elements separated
    by commas, classes preceded by . etc */
        blackListElements = "a, option, input, pre";
        
    /* Locations where links are disabled */
    var disabledLocations = ['ProjectFOSWIKI', 'ProjectTRAC'];



    function getWikiwords() {

        $j.fn.textNodes = function () {
            var ret = [];
            $j.each(this.contents(), function () {
                try {
                    if (this.nodeType === 3) {
                        ret.push(this);
                    } else {
                        $j(this).not(blackListElements).contents().each(arguments.callee);
                    }
                } catch (e) {}
            });
            return $j(ret);
        };

        var websString = webs.join("|"),
            camelCaseRegexp = new RegExp("\\b(?:(" + websString + ")\\.)?([A-Z]+[a-z0-9]+[A-Z]+\\w*)\\b", 'g'),
            nodes = [];

        $j(document.body).textNodes().each(function () {
            var matchedText = [],
                wikiWord = '',
                newNode = [],
                newTopic;

            newNode.node = this;
            newNode.topics = [];
            while ((wikiWord = camelCaseRegexp.exec(this.nodeValue)) !== null) {
                newTopic = {};

                for (var i = 0; i < wikiWord.length; i += 3) {
                    newTopic.matchWord = wikiWord[i];

                    if(wikiWord[i+1] === undefined || wikiWord[i+1] === '') {	
                        newTopic.web = defaultWeb;
                    } else {
                        newTopic.web = wikiWord[i+1];
                    }

                    newTopic.topic = wikiWord[i + 2];
                    newTopic.container = this;

                    addIfDoesntExist(newNode, newTopic);

                }
            }
            if (newNode.topics.length > 0) {
                nodes.push(newNode);
            }
        });

        return nodes;
    }

    function addIfDoesntExist(node, topic) {
        for (var i=0; i<node.topics.length; i++) {
            if (node.topics[i].matchWord === topic.matchWord) return;
        }
        node.topics.push(topic);
    }

    /**Returns the current location (first folder inside the domain) */
    function getLocation() {
        var pathName = window.location.pathname,
            location = pathName.split('/');

        if (location.length > 0) {
            return location[1];
        } else {
            return false;
        }
    }

    /**TODO: Add an option to make links appear only once per word per page,
    *       these functions are for that purpose */
    //http://www.developersnippets.com/2008/10/30/remove-duplicates-from-array-using-javascript/
    //removes duplicate values from an array

    //Will check for the Uniqueness
    function contains(a, e) {
        var j;
        for (j = 0; j < a.length; j += 1) {
            if (a[j] === e) {
                return true;
            }
        }
        return false;
    }

    //Adds new uniqueArr values to temp array
    function uniqueArr(a) {
        var temp = [], i;
        for (i = 0; i < a.length; i += 1) {
            if (!contains(temp, a[i])) {
                temp.length += 1;
                temp[temp.length - 1] = a[i];
            }
        }
        return temp;

    }

    function fullWikiword(wikiword) {
        return wikiword.web + '.' + wikiword.topic;
    }

    function createLinks() {

        //disable links on disabledLocations
        if(contains(disabledLocations, getLocation())) return;

        var wikiWords = getWikiwords();
        if (wikiWords.length === 0) {
            return;
        }

        var postData = [],
            node,
            wikiword;

        for (node = 0; node < wikiWords.length; node += 1) {
            for (wikiword = 0; wikiword < wikiWords[node].topics.length; wikiword += 1) {
                postData.push(fullWikiword(wikiWords[node].topics[wikiword]));
            }
        }

        $j.post(phpLocation, {'matchedText[]': postData }, //array in php : array in javascript

            function (data) {
                var node, wikiword, text, url, html, foundInArr,
                    matches = $j.parseJSON(data);

                for (var i = 0; i < wikiWords.length; i++) {
                    node = $j(wikiWords[i].node).parent();
                    html = node.html();
                    for (var topic = 0; topic < wikiWords[i].topics.length; topic++) {
                        wikiword = wikiWords[i].topics[topic];
                        
                        if ($j.inArray(fullWikiword(wikiword), matches) === -1) {
                            continue;
                        }

                        url = "https://" + document.domain + wikiUrl + wikiword.web + "/" + wikiword.topic;
                        link = '<a href="' + url + '" class="nestWikiLink" target="_top">' + wikiword.matchWord + '</a>';
                        
                        var regex = new RegExp('\\b' + wikiword.matchWord + '\\b', 'g');
                        html = html.replace(regex,link);
                    }
                    node.html(html);
                }
            });
    }



    return {
        'createLinks' : createLinks,
        'getLocation' : getLocation
    };

}(); //end namespace


