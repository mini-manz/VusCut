export const SITE_URL = "https://localhost";

export const SITE_INFO = {
	title: "VusCut",
	description:
		"A simple but powerful video editor that gets the job done. In your browser.",
	url: SITE_URL,
	openGraphImage: "",
	twitterImage: "",
	favicon: "https://github.com/Cra-Z-Gaming/VUS/raw/refs/heads/main/logo",
};

// Favicon sources, tried in order. The last one is the built-in logo below.
export const FAVICON_URLS = [
	"https://github.com/Cra-Z-Gaming/VUS/raw/refs/heads/main/logo",
	"https://raw.githubusercontent.com/Cra-Z-Gaming/VUS/main/logo",
];

// VusCut logo, embedded directly so it never depends on a file path or URL.
// This is the white version. The editor flips it to black in light mode.
const LOGO_SVG_WHITE =
	'<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M400 117.163V282.838L282.838 400H117.163L0 282.838V117.163L117.163 0H282.838L400 117.163ZM100 100V300H300V100H100Z" fill="white"/></svg>';

export const DEFAULT_LOGO_URL = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG_WHITE)}`;
