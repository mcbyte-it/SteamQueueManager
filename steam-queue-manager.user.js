// ==UserScript==
// @name         Steam Auto Clicker
// @version      0.1
// @description  Click 'Not Interested' automatically for games in specified user tags.
// @author       tech_engineer / maestro_it
// @match        *://store.steampowered.com/app/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.onload = function () {

    var unwantedGames = ['FPS', 'JRPG', 'Horror', 'Dark Fantasy', 'Fantasy', 'Action RPG', 'Hack and Slash', 'Gore', 'Violent'];

    try {
        if ($J("#next_in_queue_form") !== null) {

            var needToClick = false;
            $J("a.app_tag").each(function () {
                var appTag = $J(this).text().trim();
                if ($J.inArray(appTag, unwantedGames) > -1) {
                    console.log("Game will be marked because of: " + appTag);
                    needToClick = true;
                }
            });

            if (needToClick) {
                $J("div.btn_medium span").each(function() {
                    if ($J(this) != null && $J(this).text() === 'Not Interested') {
                        console.log("Clicking on the 'Not Interested' Button...");
                        $J(this).click();
                        return false;
                    }
                });
            }

            var allTags = "";
            $J("a.app_tag").each(function () {
                allTags += $J(this).text().trim() + ", ";
            });
            console.log("List of all tags: " + allTags);
        };
    } catch(e) {
        console.log("Error: " + e);
    }
}
