// assets/js/site-loader.js

// --- 1. CONFIGURATION ---
// CORRECTED PATH: Points to the assets/data folder
BASE_DATA_PATH = './assets/data/';

// Stores all fetched data keyed by filename (e.g., 'personal_info' : {...})
let SITE_DATA = {};

const JSON_FILES = [
    'site.json',
    'personal_info.json',
    'key_metrics.json',
    'academic_information.json',
    'professional_experience.json',
    'expertise_achievements.json',
    'skills.json',
    'honors_awards.json',
    'courses_trainings_certificates.json',
    'projects.json',
    'memberships.json',
    'sessions_events.json',
    'languages.json',
    'portfolios.json',
    'volunteering_services.json',
    'publications.json',
    'contact_details.json',
    'ea_logo.json',
    'copyright.json',
    'diary.json',
    'gallery.json'
];




// --- 2. CORE FETCHING FUNCTION ---

/**
 * Fetches all JSON files and stores the data in the global SITE_DATA object.
 * @returns {Promise<void>} Resolves when all data is loaded.
 * Fetches all JSON files with a caching strategy defined in site.json (in seconds).
 */
async function loadAllData(base_data_path=`./assets/data/`) {
    const CACHE_KEY = 'site_data_cache';
    const TIMESTAMP_KEY = 'site_data_timestamp';

    // 1. Check if cache exists
    let cachedData = localStorage.getItem(CACHE_KEY);
    let lastFetch = localStorage.getItem(TIMESTAMP_KEY);
    let now = new Date().getTime();

    if (cachedData && lastFetch) {
        try {
            const tempSiteData = JSON.parse(cachedData);

            // 2. Extract expiration from site.json (default to 86400 if missing)
            const expirationSeconds = tempSiteData.site?.cache_settings?.expiration_seconds || 3600;
            const expirationMs = expirationSeconds * 1000;

            // 3. If within time limit, load from cache
            if (now - lastFetch < expirationMs) {
                console.log(`Loading data from ${expirationSeconds}s cache...`);
                SITE_DATA = tempSiteData;
                return;
            }
        } catch (e) {
            console.warn("Cache parsing failed, performing fresh fetch.");
        }
    }

    // 4. Perform fresh fetch if cache is expired or missing
    console.log('Cache expired or missing. Starting fresh data loading...');
    const fetchPromises = JSON_FILES.map(fileName =>
        fetch(base_data_path + fileName)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${fileName}`);
                return response.json();
            })
            .then(data => {
                const baseName = fileName.replace('.json', '');
                SITE_DATA[baseName] = data;
            })
    );

    await Promise.all(fetchPromises);

    // 5. Save fresh data to localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(SITE_DATA));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());
    console.log('All core data loaded and cached successfully.');
}





// --- 3. RENDERING FUNCTIONS ---

// MODIFIED: assets/js/site-loader.js (renderHeader function)


/**
 * Updates the document's metadata, such as the <title> tag.
 * @param {object} siteInfo
 */
function updateDocumentMetadata(siteInfo) {
    if (!siteInfo || !siteInfo.title) return;

    // Update the HTML <title> tag
    document.title = siteInfo.title;
}



/**
 * Renders the Header (Name, Profile Image, Social Links) in the Sidebar.
 * @param {object} personalInfo
 * @param {object} siteData
 */
function renderHeader(personalInfo, siteData) {
    if (!personalInfo || !siteData) return;

    // --- 1. Update Site Name in Header ---
    const siteNameElement = document.querySelector('#header .sitename');
    if (siteNameElement) {
        // Corrected path to access the name from the root of personal_info
        siteNameElement.textContent = personalInfo.name;
    }

    // --- 2. Update Profile Images (PP and Logo) ---
    const imageAssets = siteData.assets.images;
    const iconAssets = siteData.assets.icons;

    // Profile Image (Large circular photo)
    const profileImg = document.querySelector('#header .profile-img img');
    if (profileImg) {
        profileImg.src = imageAssets.profile_image_pp;
    }

    // Logo (Small circular photo next to site name)
    const logoImg = document.querySelector('#header .logo img');
    if (logoImg) {
        logoImg.src = iconAssets.logo_png; // Using iconAssets for logo_png
    }

    // --- 3. Update Social Links ---
    // Using siteData.social_links as it is a master list with icons
    const socialContainer = document.querySelector('#header .social-links');
    if (socialContainer && siteData.social_links) {
        socialContainer.innerHTML = siteData.social_links.main
            .filter(link => link.platform !== 'google-old' && link.platform !== 'researchgate-old' && link.platform !== 'researchgate-fab') // Optional: filter out older/unused links
            .map(link => `
            <a href="${link.url}" target="_blank" class="${link.platform}">
                <i class="${link.icon_class}"></i>
            </a>
        `).join('');
    }
}



/**
 * Renders the Navigation Menu (ID: #navmenu) from site.json.
 * @param {object} navigation - Now receives a wrapper object {main_menu: array}
 */
function renderNavigation(navigation) {
    // Check if the input object exists and if the main_menu property exists
    if (!navigation || !navigation.main_menu) return;

    const navContainer = document.getElementById('navmenu');
    if (!navContainer) return;

    // Get the actual menu array
    const menuArray = navigation.main_menu;

    let navHTML = '<ul>';

    // Loop through the selected menu array (either main_menu or details_menu)
    menuArray.forEach(item => {
        // ... (rest of the logic inside the loop uses 'item' as before) ...

        // Class for the link: 'active scrollto' ONLY for #hero, 'scrollto' for all others
        // Note: For details_menu, we often want the "Back" link to be handled differently,
        // but for now, we continue the logic established for the main menu:
        const linkClass = (item.url === '#hero' || item.url === './') ? 'active scrollto' : 'scrollto';
        const finalLinkClass = linkClass;

        if (item.is_dropdown && item.submenu && item.submenu.length > 0) {
            // ... (Dropdown rendering logic as before)
            navHTML += `
                <li class="dropdown">
                    <a href="${item.url}" class="${finalLinkClass}"><i class="${item.icon_class} navicon"></i> <span>${item.label}</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul class=""> 
                        ${item.submenu.map(subItem => `
                            <li>
                                <a href="${subItem.url}" class="scrollto"><i class="${subItem.icon_class} navicon"></i> <span>${subItem.label}</span></a>
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `;
        } else {
            // Standard Link Item
            navHTML += `
                <li><a href="${item.url}" class="${finalLinkClass}"><i class="${item.icon_class} navicon"></i> <span>${item.label}</span></a> </li>
            `;
        }
    });

    navHTML += '</ul>';
    navContainer.innerHTML = navHTML;
}



/**
 * Initializes the dropdown behavior according to the required structure:
 * <li> fixed, <a> toggles 'active' on click, <ul> toggles 'dropdown-active'.
 */
function renderNavDropdowns() {
    // Select all the dropdown parent links (the <a> element)
    const navDropdownLinks = document.querySelectorAll('#navmenu .dropdown > a');

    navDropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // 1. Toggle the active class on the clicked <a> tag itself.
            this.classList.toggle('active');

            // 2. Identify the submenu <ul> (which is the next sibling element)
            const submenuUl = this.nextElementSibling;

            if (submenuUl && submenuUl.tagName === 'UL') {

                // 3. Toggle the 'dropdown-active' class on the submenu <ul>.
                submenuUl.classList.toggle('dropdown-active');

            }
        });
    });
}



// /**
//  * Renders the main Hero Section (ID: #hero)
//  * @param {object} personalInfo
//  */
// function renderHero(personalInfo) {
//     const hero = document.getElementById('hero');
//     if (!hero || !personalInfo || !personalInfo.hero) return;
//
//     hero.querySelector('h2').textContent = personalInfo.hero.title_main;
//
//     // Update Typed items
//     const typedElement = hero.querySelector('p:nth-of-type(1) .typed');
//     if (typedElement) {
//         // This dynamically sets the data for Typed.js
//         typedElement.setAttribute('data-typed-items', personalInfo.hero.typed_items);
//     }
//
//     // Update the researcher status and institutes
//     const paragraphs = hero.querySelectorAll('p');
//     if (paragraphs.length >= 2) {
//         paragraphs[1].textContent = personalInfo.hero.title_researcher;
//     }
//     if (paragraphs.length >= 3) {
//         paragraphs[2].innerHTML = `${personalInfo.hero.title_institute_primary} <br>${personalInfo.hero.title_institute_secondary} <br>${personalInfo.hero.tagline}`;
//     }
// }






/**
 * Renders the Menu Footer (Sidebar Footer: ID: #menu_footer).
 * @param {object} footerMeta
 * @param {object} assetData
 */
function renderMenuFooter(footerMeta, assetData) {
    if (!footerMeta || !footerMeta.menu_footer) return;

    const menuFooter = footerMeta.menu_footer;
    const container = document.getElementById('menu_footer');
    if (!container) return;

    // --- CRITICAL FIX: Get the current year dynamically ---
    let copyrightYear= menuFooter.copyright_year || 'AUTO';
    if (copyrightYear && copyrightYear.toUpperCase() == 'AUTO') {
        // 1. If 'AUTO', use the current year
        copyrightYear = new Date().getFullYear();
        console.log("Getting current year", copyrightYear)
    }

    // Use the logo path from assets
    const logoPath = assetData.icons.logo_png;

    // 1. Render Copyright Block
    const copyrightHTML = `
        <div class="copyright">
          <p style="text-align: center;">
            © Copyright · ${copyrightYear} <strong><span> 
<!--            © Copyright · ${menuFooter.copyright_year} <strong><span> -->
            <a href="${menuFooter.copyright_logo_link}"> <img style="height: 20px;" src="${logoPath}" alt="Logo" class="img-fluid rounded-circle"> </a> 
            <a href="${menuFooter.copyright_text_link}"> ${menuFooter.copyright_owner} </a> 
            </span></strong>
          </p>
        </div>
    `;

    // 2. Render Credits/Links Block
    const linksHTML = menuFooter.links.map(link =>
        `<a href="${link.url}"> ${link.label} </a>`
    ).join(' | ');

    const creditsHTML = `
        <div class="credits">
            ${linksHTML}
        </div>
    `;

    // Replace the container content
    container.innerHTML = `
        <div class="container">
            ${copyrightHTML}
            ${creditsHTML}
        </div>
    `;
}


/**
 * Renders the Global Page Footer (ID: #footer).
 * @param {object} footerMeta
 */
function renderPageFooter(footerMeta)
{
    if (!footerMeta || !footerMeta.main_page_footer) return;

    const pageFooter = footerMeta.main_page_footer;
    const container = document.getElementById('footer');
    if (!container) return;

    // Ensure the container has the correct class and inner structure
    container.innerHTML = `
        <div class="container">
            <div class="copyright text-center ">
                <p>© <span>Copyright</span> <strong class="px-1 sitename">${pageFooter.sitename}</strong><span>All Rights Reserved</span></p>
            </div>
            <div class="credits">
                Designed by <a target="_blank" href="${pageFooter.design_link}">${pageFooter.design_credit}</a>
            </div>
        </div>
    `;
}




// --- 4. MAIN INITIALIZATION ---

/**
 * Main function to orchestrate data loading and rendering.
 */
async function initializeSite() {
    await loadAllData(BASE_DATA_PATH);

    if (Object.keys(SITE_DATA).length > 0) {
        console.log('Rendering site with loaded data...');

        const pathName = window.location.pathname;
        const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

        let menuToRender;
        const mainPages = ['index.html', '', 'printable_cv.html'];

        if (mainPages.includes(fileName)) {
            menuToRender = SITE_DATA.site.navigation.main_menu;
            // --- CRITICAL FIX: OVERRIDE HOME LINK FOR PRINTABLE CV PAGE ---
            if (fileName === 'printable_cv.html') {
                const homeItem = menuToRender.find(item => item.label.startsWith('Home'));
                if (homeItem) {
                    homeItem.url = './index.html#about';
                }
            }
        }
        else {
            menuToRender = SITE_DATA.site.navigation.details_menu;
        }

        // 1. RENDER CORE HEADER AND HERO SECTIONS
        updateDocumentMetadata(SITE_DATA.site.site_info);
        renderHeader(SITE_DATA.personal_info, SITE_DATA.site);
        renderMenuFooter(SITE_DATA.site.footer_meta, SITE_DATA.site.assets);
        renderPageFooter(SITE_DATA.site.footer_meta);
        renderNavigation({main_menu: menuToRender});
        renderNavDropdowns();

        // // 2. RENDER PAGE-SPECIFIC SECTIONS
        // if (fileName === 'printable_cv.html') {
        //     // --- CV PAGE RENDERING ---
        //
        //     // Render About section (CV has partial static content)
        //     renderAboutCV(SITE_DATA.personal_info);
        //
        //     // Key Metrics
        //     renderKeyMetricsCV(SITE_DATA.key_metrics);
        //
        //     // Education
        //     renderEducationsCV(SITE_DATA.education);
        //
        //     // Professional Experiences
        //     renderProfessionalExperiencesCV(SITE_DATA.professional_experience);
        //
        //     // --- EXPERTISE AND ACHIEVEMENTS BLOCK (ORDER MATTERS) ---
        //     renderExpertiseAndAchievementsCV(SITE_DATA.expertise_achievements);
        //
        //     // Skills and Tools
        //     renderSkillsToolsCV(SITE_DATA.skills);
        //
        //     // Honors and Awards
        //     renderHonorsAwardsCV(SITE_DATA.honors_awards);
        //
        //     // Courses, Trainings and Certificates
        //     renderCoursesTrainingsCertificatesCV(SITE_DATA.courses_trainings_certificates);
        //
        //     // --- ADD THE CV PROJECTS CALL HERE ---
        //     renderProjectsCV(SITE_DATA.projects);
        //
        //     // --- ADD THE CV MEMBERSHIPS CALL HERE ---
        //     renderMembershipsCV(SITE_DATA.memberships);
        //
        //     // --- ADD THE CV SESSIONS AND EVENTS CALL HERE ---
        //     renderSessionsEventsCV(SITE_DATA.sessions_events);
        //
        //     // --- ADD THE CV LANGUAGES CALL HERE ---
        //     renderLanguagesCV(SITE_DATA.languages);
        //
        //     // --- ADD THE CV PORTFOLIOS CALL HERE ---
        //     renderPortfoliosCV(SITE_DATA.portfolios);
        //
        //     // --- ADD THE CV VOLUNTEERINGS CALL HERE ---
        //     renderVolunteeringsCV(SITE_DATA.volunteerings);
        //
        //     // --- ADD THE CV PUBLICATIONS CALL HERE ---
        //     renderPublicationsCV(SITE_DATA.publications);
        //
        //     // --- ADD THE CV CONTACTS CALL HERE ---
        //     renderContactsCV(SITE_DATA.contacts);
        // }
        // else if (fileName === 'education-details.html') {
        //     renderEducationDetails(SITE_DATA.education);
        // }
        // else if (fileName === 'professionalExprience-details.html') {
        //     renderProfessionalExperiencesDetails(SITE_DATA.professional_experience);
        // }
        // else if (fileName === 'skillsAndTools-details.html') {
        //     renderSkillsToolsDetails(SITE_DATA.skills);
        // }
        // else if (fileName === 'honorsAndAwards-details.html') {
        //     renderHonorsAwardsDetails(SITE_DATA.honors_awards);
        // }
        // else if (fileName === 'coursesTrainingsAndCertificates-details.html') {
        //     renderCoursesTrainingsCertificatesDetails(SITE_DATA.courses_trainings_certificates);
        // }
        // else if (fileName === 'projects-details.html') {
        //     renderProjectsDetails(SITE_DATA.projects);
        // }
        // else if (fileName === 'memberships-details.html') {
        //     renderMembershipsDetails(SITE_DATA.memberships);
        // }
        // else if (fileName === 'sessionsAndEvents-details.html') {
        //     renderSessionsEventsDetails(SITE_DATA.sessions_events);
        // }
        // else if (fileName === 'languages-details.html') {
        //     renderLanguagesDetails(SITE_DATA.languages);
        // }
        // else if (fileName === 'portfolios-details.html') {
        //     renderPortfoliosDetails(SITE_DATA.portfolios);
        // }
        // else if (fileName === 'volunteerings-details.html') {
        //     renderVolunteeringsDetails(SITE_DATA.volunteerings);
        // }
        // else if (fileName === 'publications-details.html') {
        //     if (SITE_DATA.publications) renderPublicationsDetails(SITE_DATA.publications);
        // }
        // else if (fileName === 'ea-logo.html') {
        //     if (SITE_DATA.ea_logo) renderEALogos(SITE_DATA.ea_logo);
        // }
        // else if (fileName === 'copyright.html') {
        //     renderCopyright(SITE_DATA.copyright);
        // }
        // else if (fileName === 'diary.html') {
        //     renderDiary(SITE_DATA.diary);
        // }
        // else if (fileName === 'gallery.html') {
        //     renderGallery(SITE_DATA.gallery);
        // }
        // else {
        //     // --- INDEX PAGE RENDERING (Default Fallback) ---
        //
        //     // Hero Section (often static, but might use personal_info)
        //     renderHero(SITE_DATA.personal_info);
        //
        //     // About Section
        //     renderAbout(SITE_DATA.personal_info);
        //
        //     // Key Metrics
        //     renderKeyMetrics(SITE_DATA.key_metrics);
        //
        //     // Education
        //     renderEducations(SITE_DATA.education);
        //
        //     // Professional Experiences
        //     renderProfessionalExperiences(SITE_DATA.professional_experience);
        //
        //     // --- EXPERTISE AND ACHIEVEMENTS BLOCK (ORDER MATTERS) ---
        //     renderExpertiseAndAchievements(SITE_DATA.expertise_achievements);
        //
        //     // Skills and Tools
        //     renderSkillsTools(SITE_DATA.skills);
        //
        //     // Honors and Awards
        //     renderHonorsAwards(SITE_DATA.honors_awards);
        //
        //     // Courses, Trainings and Certificates
        //     renderCoursesTrainingsCertificates(SITE_DATA.courses_trainings_certificates);
        //
        //     // --- ADD THE INDEX PROJECTS CALL HERE ---
        //     renderProjects(SITE_DATA.projects);
        //
        //     // --- ADD THE INDEX MEMBERSHIPS CALL HERE ---
        //     renderMemberships(SITE_DATA.memberships);
        //
        //     // --- ADD THE INDEX SESSIONS AND EVENTS CALL HERE ---
        //     renderSessionsEvents(SITE_DATA.sessions_events);
        //
        //     // --- ADD THE INDEX LANGUAGES CALL HERE ---
        //     renderLanguages(SITE_DATA.languages);
        //
        //     // --- ADD THE INDEX PORTFOLIOS CALL HERE ---
        //     renderPortfolios(SITE_DATA.portfolios);
        //
        //     // --- ADD THE INDEX VOLUNTEERINGS CALL HERE ---
        //     renderVolunteerings(SITE_DATA.volunteerings);
        //
        //     // --- ADD THE INDEX PUBLICATIONS CALL HERE ---
        //     renderPublications(SITE_DATA.publications);
        //
        //     // --- ADD THE INDEX CONTACTS CALL HERE ---
        //     renderContacts(SITE_DATA.contacts);
        // }

        // 3. RE-INITIALIZE DYNAMIC LIBRARIES
        // This is the crucial step for Typed.js
        if (typeof initTypedAnimation === 'function') {
            console.log('initTypedAnimation found! Rendering dynamic items on the site with loaded data...');
            initTypedAnimation();
        } else {
            console.log('initTypedAnimation not found! ');
            console.warn('initTypedAnimation not found. Ensure main.js is loaded and includes this global function.');
        }

        // Other theme initializations
        if (typeof initAOS === 'function') initAOS();
        if (typeof initPureCounter === 'function') initPureCounter();

        console.log('Dynamic rendering complete.');
    }
}

// --- 5. EXECUTION ---
document.addEventListener('DOMContentLoaded', initializeSite);

