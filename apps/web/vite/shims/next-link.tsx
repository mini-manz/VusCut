import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { go } from "../route";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
	href: string | { pathname?: string };
	prefetch?: boolean;
	scroll?: boolean;
	replace?: boolean;
};

// Internal links ("/something") switch pages inside the app without touching
// the browser URL. Anything else (https://...) behaves like a normal link.
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{ href, prefetch: _p, scroll: _s, replace = false, onClick, ...rest },
	ref,
) {
	const raw = typeof href === "string" ? href : (href.pathname ?? "/");

	if (!raw.startsWith("/")) {
		return <a ref={ref} href={raw} onClick={onClick} {...rest} />;
	}

	return (
		<a
			ref={ref}
			href="#"
			{...rest}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				event.preventDefault();
				go(raw, replace);
			}}
		/>
	);
});

export default Link;
