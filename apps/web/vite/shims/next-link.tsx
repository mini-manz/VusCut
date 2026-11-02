import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
	href: string | { pathname?: string };
	prefetch?: boolean;
	scroll?: boolean;
	replace?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{ href, prefetch: _p, scroll: _s, replace: _r, ...rest },
	ref,
) {
	const raw = typeof href === "string" ? href : (href.pathname ?? "/");
	const target = raw.startsWith("/") ? `#${raw}` : raw;
	return <a ref={ref} href={target} {...rest} />;
});

export default Link;
