/**
 * Shared Footer Component
 * Injects the global footer into the page.
 */
(function() {
    const currentYear = new Date().getFullYear();

    // Generate brutalist repeating text for the ticker
    const tickerText = `${window.CLIENT_CONFIG.name} // AVAILABLE FOR BOOKING // `;
    const halfTrack = Array(6).fill(`<span>${tickerText}</span>`).join('');

    const footerHTML = `
    <div class="footer-ticker">
        <div class="ticker-track">
            ${halfTrack}${halfTrack}
        </div>
    </div>
    <footer>
        <div class="container">
            <div class="footer-column">
                <p class="footer-label">${window.CLIENT_CONFIG.name}</p>
                <p lang="en" style="opacity: 0.5; text-transform: none; letter-spacing: 0; line-height: 1.8; max-width: 280px;">[Short English footer description about the client goes here.]</p>
                <p lang="th" style="opacity: 0.5; text-transform: none; letter-spacing: 0; line-height: 1.8; max-width: 280px;">[Short Thai footer description about the client goes here.]</p>
            </div>
            <div class="footer-column">
                <p class="footer-label" lang="en">Inquiries</p>
                <p class="footer-label" lang="th">ติดต่อสอบถาม</p>
                <a href="mailto:${window.CLIENT_CONFIG.email}">${window.CLIENT_CONFIG.email}</a>
                <a href="booking.html">Booking & Availability</a>
            </div>
            <div class="footer-column">
                <p class="footer-label" lang="en">Follow</p>
                <p class="footer-label" lang="th">ติดตาม</p>
                <a href="${window.CLIENT_CONFIG.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div class="footer-bottom">
                <div>&copy; ${currentYear} ${window.CLIENT_CONFIG.name} Portfolio. All rights reserved.</div>
                <div class="attribution">Crafted by <a href="https://thefoliolab.vercel.app/" class="designer-link" target="_blank" rel="noopener noreferrer">The Folio Lab</a></div>
            </div>
        </div>
    </footer>`;

    document.currentScript.insertAdjacentHTML('beforebegin', footerHTML);
})();