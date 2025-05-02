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
            const label = this.getTarget('available', '.dash-number span')[0];
            container.textContent = count;
            label.textContent = count === 1 ? 'Request' : 'Requests';
            count && this.notify();
            document.title = `(${count}) Caption Requests`;
        },

        // displays the number of submitted and claimed videos
        changeClaimed() {
            const claimedVideos = this.getTarget('claimed', 'tbody tr').length;
            const submittedVideos = this.getTarget('claimed', '.cr-submitted').length;
            const countContainer = this.getTarget('claimed', '.dash-number strong')[0];
            const labelContainer = this.getTarget('claimed', '.dash-number span')[0];
            countContainer.textContent = `${claimedVideos}`;
            labelContainer.textContent = `Videos`;
        },

        // change buttons to icons
        changeButtons() {
            const buttons = [
                { target: 'available', selector: '.btn-success', icon: 'plus', text: 'Claim' },
                { target: 'claimed', selector: '.btn-success', icon: 'pencil', text: 'Caption' },
                { target: 'claimed', selector: '.btn-danger', icon: 'ban', text: 'Unclaim' },
            ];

            buttons.forEach(({ target, selector, icon, text }) => {
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

        // puts navbar next to logo
        repositionNav() {
            const logo = document.getElementById("logo");
            const navWrapper = document.getElementById("navigation-wrapper");
            logo.insertAdjacentElement("afterend", navWrapper);
        },

        repositionMinute() {
            this.getTarget('claimed', 'tbody tr').forEach(tr => {
                const time = tr.querySelectorAll('td')[3].textContent;
                const title = tr.querySelectorAll('td')[2];
                const p = document.createElement("p");
                p.textContent = `${time} mins`;
                title.appendChild(p);
            });

            this.getTarget('available', 'tbody tr').forEach(tr => {
                const time = tr.querySelectorAll('td')[3].textContent;
                const title = tr.querySelectorAll('td')[2];
                const p = document.createElement("p");
                p.textContent = `${time} mins`;
                title.appendChild(p);
            });
        },

        start() {
            this.displayAvailable();
            this.changeButtons();
            this.indicateSubmitted();
            this.changeClaimed();
            this.repositionNav();
            this.repositionMinute();
        }

    }

    app.start();

})();
