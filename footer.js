/**
 * Shared Footer Component
 * Injects the global footer into the page.
 */
(function() {
    const currentYear = new Date().getFullYear();
    const config = window.CLIENT_CONFIG || {};
    const escapeHTML = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
    const clientName = escapeHTML(config.name);
    const footerDescEn = escapeHTML(config.footerDescEn || config.footerBioEn);
    const footerDescTh = escapeHTML(config.footerDescTh || config.footerBioTh || config.footerDescEn || config.footerBioEn);
    const email = escapeHTML(config.email);
    const instagram = escapeHTML(config.instagram || '#');

    // Generate brutalist repeating text for the ticker
    const tickerText = `${clientName} // AVAILABLE FOR BOOKING // `;
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
                <p class="footer-label">${clientName}</p>
                <p lang="en" style="opacity: 0.5; text-transform: none; letter-spacing: 0; line-height: 1.8; max-width: 280px;">${footerDescEn}</p>
                <p lang="th" style="opacity: 0.5; text-transform: none; letter-spacing: 0; line-height: 1.8; max-width: 280px;">${footerDescTh}</p>
            </div>
            <div class="footer-column">
                <p class="footer-label" lang="en">Inquiries</p>
                <p class="footer-label" lang="th">ติดต่อสอบถาม</p>
                <a href="mailto:${email}">${email}</a>
                <a href="booking.html">Booking & Availability</a>
            </div>
            <div class="footer-column">
                <p class="footer-label" lang="en">Follow</p>
                <p class="footer-label" lang="th">ติดตาม</p>
                <a href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div class="footer-bottom">
                <div>&copy; ${currentYear} ${clientName} Portfolio. All rights reserved.</div>
                <div class="attribution">Crafted by <a href="https://thefoliolab.vercel.app/" class="designer-link" target="_blank" rel="noopener noreferrer">The Folio Lab</a></div>
            </div>
        </div>
    </footer>`;

    document.currentScript.insertAdjacentHTML('beforebegin', footerHTML);
})();
