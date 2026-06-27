/**
 * CLIENT CONFIGURATION
 *
 * Fast client swap:
 * 1. Edit the blocks marked SWAP below.
 * 2. Replace files in /image with the same filenames when possible.
 * 3. Leave optional links or comp-card paths blank ("") to hide unavailable UI.
 * 4. Add image captions only for images that should show modal captions.
 *
 * The template reads window.CLIENT_CONFIG. Keep the exported keys at the bottom
 * unless you are also updating main.js/nav.js/footer.js.
 */
(() => {
    const isUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());
    const cleanHandle = (value) => String(value || "").trim().replace(/^@+/, "");
    const digitsOnly = (value) => String(value || "").replace(/[^\d+]/g, "");

    const instagramLink = (value) => {
        const handle = cleanHandle(value);
        if (!handle) return "";
        return isUrl(handle) ? handle : `https://instagram.com/${handle}`;
    };

    const lineLink = (value) => {
        const input = String(value || "").trim();
        if (!input) return "";
        return isUrl(input) ? input : `https://line.me/ti/p/${input.replace(/^@+/, "")}`;
    };

    const whatsappLink = (value) => {
        const input = String(value || "").trim();
        if (!input) return "";
        return isUrl(input) ? input : `https://wa.me/${digitsOnly(input)}`;
    };

    const path = {
        hero: "image/hero/hero.webp",
        about: "image/about/01.webp",
        compCardWeb: "image/Folio-Lab-Compcard Avant Garde.webp",
        compCardDownload: "image/Folio-Lab-Compcard Avant Garde.png",
        highlights: [
            "image/highlights/01.webp",
            "image/highlights/02.webp",
            "image/highlights/03.webp",
            "image/highlights/04.webp"
        ],
        portfolio: Array.from({ length: 20 }, (_, index) => {
            const number = String(index + 1).padStart(2, "0");
            return `image/portfolio/${number}.webp`;
        }),
        digitals: [
            "image/digitals/01.webp",
            "image/digitals/02.webp",
            "image/digitals/03.webp",
            "image/digitals/04.webp"
        ]
    };

    // SWAP: client identity, contact, and hero copy.
    const client = {
        name: "CLIENT NAME",
        email: "contact@client.com",
        instagram: "yourclient",
        line: "",
        whatsapp: "1234567890",
        taglineEn: "Model · Creative Director",
        taglineTh: "นางแบบ · ครีเอทีฟไดเรกเตอร์",
        splashCaption: "Model / Creative Direction",
        footerDescEn: "[Short English footer description about the client goes here.]",
        footerDescTh: "[Short Thai footer description about the client goes here.]"
    };

    // SWAP: About page copy for future dynamic upgrades. Current AvantGarde HTML keeps this copy inline.
    const about = {
        bioEn: [
            "Client bio opening. Replace this with a concise statement about presence, point of view, and creative direction.",
            "Use this second line for selected campaigns, experience, availability, or the kind of collaborations the client is seeking.",
            "Keep it short, specific, and editorial."
        ],
        bioTh: [
            "ย่อหน้าเปิดประวัติ แทนที่ด้วยคำแนะนำตัวที่กระชับเกี่ยวกับตัวตน มุมมอง และทิศทางสร้างสรรค์",
            "ใช้ย่อหน้าที่สองสำหรับแคมเปญ ประสบการณ์ ความพร้อมรับงาน หรือรูปแบบงานที่ต้องการร่วมงาน",
            "เขียนให้สั้น ชัดเจน และมีโทนแบบเอดิทอเรียล"
        ],
        manifestoEn: "Client manifesto placeholder. Replace with one sharp line that captures their creative presence.",
        manifestoTh: "ตัวอย่างแมนิเฟสโตของลูกค้า แทนที่ด้วยประโยคสั้นคมที่สะท้อนตัวตนและพลังสร้างสรรค์"
    };

    // SWAP: measurements shown on the homepage.
    const measurements = {
        height: "179",
        bust: "84",
        waist: "61",
        hips: "90",
        shoes: "40",
        hairEn: "Blonde",
        hairTh: "บลอนด์",
        eyesEn: "Blue",
        eyesTh: "สีฟ้า"
    };

    // SWAP: optional comp card.
    const compCard = {
        image: path.compCardWeb,
        download: path.compCardDownload
    };

    // SWAP: modal captions. Remove an entry or set showImageCaptions false to hide it.
    const captions = {
        showImageCaptions: true,
        items: {
            [path.highlights[0]]: { kicker: "Highlights / 01", en: "A sharp editorial opener with direct visual impact.", th: "[คำบรรยายภาษาไทย]" },
            [path.highlights[1]]: { kicker: "Highlights / 02", en: "Raw styling, strong gaze, and a graphic portfolio presence.", th: "[คำบรรยายภาษาไทย]" },
            [path.highlights[2]]: { kicker: "Highlights / 03", en: "A bold frame designed to feel immediate and memorable.", th: "[คำบรรยายภาษาไทย]" },
            [path.highlights[3]]: { kicker: "Highlights / 04", en: "High-contrast attitude shaped for an avant-garde impression.", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[0]]: { kicker: "Portfolio / 01", en: "Graphic composition with a raw editorial edge.", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[1]]: { kicker: "Portfolio / 02", en: "A confrontational frame built around presence and contrast.", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[2]]: { kicker: "Portfolio / 03", en: "Experimental styling gives the portrait a distinct signature.", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[3]]: { kicker: "Portfolio / 04", en: "A bold portfolio study with strong visual tension.", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[4]]: { kicker: "Portfolio / 05", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[5]]: { kicker: "Portfolio / 06", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[6]]: { kicker: "Portfolio / 07", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[7]]: { kicker: "Portfolio / 08", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[8]]: { kicker: "Portfolio / 09", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[9]]: { kicker: "Portfolio / 10", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[10]]: { kicker: "Portfolio / 11", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[11]]: { kicker: "Portfolio / 12", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[12]]: { kicker: "Portfolio / 13", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[13]]: { kicker: "Portfolio / 14", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[14]]: { kicker: "Portfolio / 15", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[15]]: { kicker: "Portfolio / 16", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[16]]: { kicker: "Portfolio / 17", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[17]]: { kicker: "Portfolio / 18", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[18]]: { kicker: "Portfolio / 19", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.portfolio[19]]: { kicker: "Portfolio / 20", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.digitals[0]]: { kicker: "Digitals / 01", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.digitals[1]]: { kicker: "Digitals / 02", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.digitals[2]]: { kicker: "Digitals / 03", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" },
            [path.digitals[3]]: { kicker: "Digitals / 04", en: "[English caption here]", th: "[คำบรรยายภาษาไทย]" }
        }
    };

    window.CLIENT_CONFIG = {
        name: client.name,
        email: client.email,
        taglineEn: client.taglineEn,
        taglineTh: client.taglineTh,
        splashCaption: client.splashCaption,
        footerBioEn: client.footerDescEn,
        footerBioTh: client.footerDescTh,
        footerDescEn: client.footerDescEn,
        footerDescTh: client.footerDescTh,
        aboutBioEn: about.bioEn,
        aboutBioTh: about.bioTh,
        manifestoEn: about.manifestoEn,
        manifestoTh: about.manifestoTh,
        measurements,
        compCardUrl: compCard.image,
        compCardDownloadUrl: compCard.download,
        showImageCaptions: captions.showImageCaptions,
        imageCaptions: captions.items,
        instagram: instagramLink(client.instagram),
        line: lineLink(client.line),
        whatsapp: whatsappLink(client.whatsapp),
        client,
        about,
        assets: path,
        compCard,
        captions
    };
})();
