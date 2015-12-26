// ==UserScript==
// @name         Steam Auto Clicker
// @version      0.3
// @description  Click 'Not Interested' automatically for games in specified user tags.
// @author       tech_engineer / maestro_it
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/explore/
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
/* jshint -W097 */

(function(){
    "use strict";
    
    // HEY, YOU.... YES YOU.... You NEED to personalize the list of 'unwantedGames', otherwise I will follow what my master have decided...
    var unwantedGames = ['FPS', 'JRPG', 'Horror', 'Dark Fantasy', 'Gore', 'Violent', 'Zombies'];
    
    var autoSubmit = true; // automatically submit the form after the timeout (next var)
    var timeoutToSubmit = 6; // if autosubmit is enabled wait this amount in seconds before clicking next
    var showReasons = true; // show the tags next to the not interested button
    var showDonate = true; // show donation button on the Explore page
    
    /*
    // this is coming soon
    try {
        GM_setValue('GM_UnwantedList', unwantedGames);
    
        var retVar = GM_getValue('GM_UnwantedList');
        console.log('Returned list size is: ' + retVar.length);
    } catch (e) {
        console.log('ERROR in GM functions: ' + e);
    }
    */
    
    try {
        if ($J("#next_in_queue_form") !== null) {

            var needToClick = false;
            var clickReasons = [];
			
            if ($J("div#add_to_wishlist_area_success").is(":hidden")) { // fix the blacklisting of games on wishlist
                $J("a.app_tag").each(function () {
                    var appTag = $J(this).text().trim();
                    if ($J.inArray(appTag, unwantedGames) > -1) {
                        //console.log("Game will be marked because of: " + appTag);
                        clickReasons.push(appTag);
                        needToClick = true;
                    }
                });

                if (needToClick) {
                    console.log("Clicking on the 'Not Interested' Button...");
                    $J('.queue_control_button.queue_btn_ignore .queue_btn_inactive').click();
                    if (showReasons) {
                        $J('.queue_control_button.queue_btn_ignore .queue_btn_inactive').parent().append('<span> ' + clickReasons.join(", ") + "</span>");
                    }
                }
            }
            
            if (autoSubmit && ($J("div.btn_next_in_queue").length)){
                console.log('Adding a timer and setting the interval');
                $J('<div id="GM_cancelInterval" class="btn_next_in_queue  right" style="width: 25px;margin-right: 0px;background-size: 200% 200%;" title="Click to stop the timer"><div class="next_in_queue_content"><span id="GM_timeoutSubmit" style="position: relative;top: 8px;left: 6px; cursor: hand;" onclick="clearInterval(GM_interval);">' + timeoutToSubmit + '</span></div></div>').insertAfter($J("div.btn_next_in_queue"));
                var GM_interval = setInterval(function(){
                    timeoutToSubmit--;
                    $J("span#GM_timeoutSubmit").text(timeoutToSubmit);

                    if (timeoutToSubmit == 0) {
                        clearInterval(GM_interval);
                        $J('#next_in_queue_form').submit();
                    }
                }, 1000);
                $J('div#GM_cancelInterval').on('click', function() {
                    console.log('Cancelling timer.');
                    clearInterval(GM_interval);
                });
            }
            
            var allTags = [];
            $J("a.app_tag").each(function () {
                allTags.push($J(this).text().trim());
            });
            console.log("List of all tags: " + allTags.join(", "));
        };
        
        // this part is from https://github.com/mig4ng/SteamQueueBotChristmas2015
        if ($J('div.discover_queue_empty_refresh_btn').length) {
            if(showDonate){
                $J( "<br><div style='border: 3px dashed red; padding: 15px;background: linear-gradient(to bottom right, rgba(255,0,0,0.3), rgba(85,0,0,0.4));'><h3>If you find this script useful, consider sending me a gift (cards, games, items)</h3>"
                 + "<br><div class='btnv6_lightblue_blue btn_medium'><span onclick='window.open(\"https://steamcommunity.com/tradeoffer/new/?partner=29920075&token=LDURJTLZ\")'>Click to open my 'Trade Offer' page</span></div>"
                 + "<br><br><h3>Wishing you all a Merry Christmas and a Happy New Year</h3></div>" ).insertAfter( ".discover_queue_empty_refresh_btn" );
            }
        }
        
    } catch(e) {
        console.log("Error: " + e);
    }
})();
