"use strict";

import en from "./en";
import es from "./es"

"use strict";

export function i18n (lang) {
    const langs = { es, en };
    
    if (!lang) {
        lang = navigator.language.split('-')[0];
    }

    return langs[lang] || langs.en;
};