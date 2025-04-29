// ==UserScript==
// @name			cctubes caption requests
// @version			1.1
// @author			J
// @description 	modifies cctubes tool page
// @match 			https://cctubes.com/caption-requests/
// @require  		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant			GM_log
// @run-at      	document-idle
// ==/UserScript==

(() => {

    const app = {

        // plays notification sound
        notify() {
            const sound = new Audio("https://raw.githubusercontent.com/the-unheard/cctubes-userscript/main/audio/notification2.mp3");
            sound.play();
        },

        // correctly displays the number of claimable videos
        displayAvailable() {
            const count = this.getTarget('available', 'tbody tr').length;
            const container = this.getTarget('available', '.dash-number strong')[0];
            container.textContent = count;
            count && this.notify();
            document.title = `(${count}) Caption Requests`;
        },

        // displays the number of submitted and claimed videos
        changeClaimed() {
            const claimedVideos = this.getTarget('claimed', 'tbody tr').length;
            const submittedVideos = this.getTarget('claimed', '.cr-submitted').length;
            const countContainer = this.getTarget('claimed', '.dash-number strong')[0];
            const labelContainer = this.getTarget('claimed', '.dash-number span')[0];
            countContainer.textContent = `${submittedVideos} of ${claimedVideos}`;
            labelContainer.textContent = `VIDEOS`;
        },

        // change buttons to icons
        changeButtons() {
            const buttons = [
                { target: 'available', selector: '.btn-success', icon: 'plus' },
                { target: 'claimed', selector: '.btn-success', icon: 'pencil' },
                { target: 'claimed', selector: '.btn-danger', icon: 'ban' },
            ];

            buttons.forEach(({ target, selector, icon }) => {
                this.getTarget(target, selector).forEach(btn => {
                    btn.innerHTML = `<i class="fa fa-${icon}"></i>`;
                });
            });
        },

        // mark claimed videos that are submitted
        indicateSubmitted() {
            const submitted = [];

            this.getTarget('submitted', 'tbody tr td:nth-of-type(2)').forEach(td => {
                submitted.push(this.cleanupTitle(td.textContent));
            });

            this.getTarget('claimed', 'tbody tr td:nth-of-type(3)').forEach(td => {
                let title = this.cleanupTitle(td.textContent);
                let found = submitted.includes(title);
                if (found) td.closest('tr').classList.add('cr-submitted');
            });
        },

        // get the correct table and the target children
        getTarget(type, target) {
            const selectors = {
                available: () => document.querySelector('#tabledata'),
                claimed: () => document.querySelectorAll('#tabledata2')[0],
                submitted: () => document.querySelectorAll('#tabledata2')[1]
            };

            return selectors[type]().closest('.row').querySelectorAll(target);
        },

        // cleans up video titles
        cleanupTitle(text) {
            return text.replace(/[^\w\s]/gi, '');
        },

        start() {
            this.displayAvailable();
            this.changeButtons();
            this.indicateSubmitted();
            this.changeClaimed();
        }

    }

    app.start();

})();
