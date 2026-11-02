import type { CSSProperties, ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
	src: string | { src: string };
	fill?: boolean;
	priority?: boolean;
	unoptimized?: boolean;
	quality?: number;
	placeholder?: string;
	blurDataURL?: string;
};

export default function Image({
	src,
	fill,
	priority: _p,
	unoptimized: _u,
	quality: _q,
	placeholder: _ph,
	blurDataURL: _b,
	style,
	alt = "",
	...rest
}: ImageProps) {
	const url = typeof src === "string" ? src : src.src;
	const fillStyle: CSSProperties | undefined = fill
		? { position: "absolute", inset: 0, width: "100%", height: "100%" }
		: undefined;
	return <img src={url} alt={alt} style={{ ...fillStyle, ...style }} {...rest} />;
}
