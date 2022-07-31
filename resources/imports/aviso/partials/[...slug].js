import { promises as fs } from "fs";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import path from "path";
import axios from "axios";
import Script from "next/script";

import klawSync from "klaw-sync";

// import { getPageSlugs, getPageBySlug } from "../lib/pages";

export default function Eachpage({ pagectx, pghtml }) {
	const router = useRouter();
	const slug = router.query.slug || [];
	// if (!router.isFallback && !post?.slug) {
	// 	return <ErrorPage statusCode={404} />;
	// }
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href={`https://assets.uiaas.io/uikit/aviso/app.css`}
				/>
			</Head>
			<div
				className="pqc"
				dangerouslySetInnerHTML={{ __html: pghtml }}></div>
			<Script src={`https://assets.uiaas.io/uikit/aviso/app.js`} />
		</>
	);
}

export async function getStaticProps({ params }) {
	const contentDir = path.join(
		process.cwd(),
		"content",
		"collections",
		"blog"
	);

	const listDir = path.join(
		process.cwd(),
		"content",
		"landing",
		"index.json"
	);

	const authorsDir = path.join(
		process.cwd(),
		"content",
		"landing",
		"authors.json"
	);

	const blogList = await fs.readFile(listDir, "utf8");
	const list = await JSON.parse(blogList);
	const ctx = list.find((item) => item.slug === params.slug[0]);

	const authors = await fs.readFile(authorsDir, "utf8");
	const authorList = await JSON.parse(authors);

	const author = authorList.find((item) => item.title === ctx.author);
	console.log(author, "asdasd");
	const partialSlug = path.join(process.cwd(), "content", "partials");
	const hslug = path.join(partialSlug, `header.json`);
	const fslug = path.join(partialSlug, `footer.json`);

	// const filenames = klawSync(contentDir, { nodir: true });
	const fullslug = path.join(contentDir, `${params.slug.join("/")}.json`);
	const fileContents = await fs.readFile(fullslug, "utf8");
	const header = await fs.readFile(hslug, "utf8");
	const footer = await fs.readFile(fslug, "utf8");
	const blogContent = await JSON.parse(fileContents);
	const meta = await {
		apimode: "component",
		theme: "aviso",
		purge: false,
		upload: true,
		title: await ctx.title,
		description: await ctx.description,
	};
	const hSection = await JSON.parse(header);
	const fSection = await JSON.parse(footer);

	const pageJson = await {
		meta: {
			title: await ctx.title,
			description: await ctx.description,
			image: await ctx.image,
		},
		content: [
			{
				module: "image-block--hero-image-split",
				subtitle: new Date(ctx.pub_date).toDateString().toUpperCase(),
				title: await ctx.title,
				description: `<div class='uk-flex uk-flex-middle uk-margin-large-top'><div class='uk-margin-small-right uk-width-auto'><img class='uk-border-circle' src='${author.image.url}' width='80px' alt='${author.title}'></div><div class='uk-width-auto'><div class='uk-head-font label uk-margin-remove-bottom uk-h4'>by ${author.title}</div></div></div>`,
				image: {
					url: await ctx.image,
				},
				style: {
					background: `#f2f2f2`,
					align: "left",
					justify: "left",
					spacing: "md",
					container: "md",
					mediaWidth: "1/2",
				},
			},
			{
				module: "image-stack--blog-article",
				subtitle: "",
				title: "",
				description: await blogContent.content,
				items: [
					{
						subtitle: "ABOUT AUTHOR",
						title: await author.title,
						description: await author.description,
						image: {
							url: "",
							alt: "Image",
						},
						ctas: [
							{
								label: `Blogs by ${author.title}`,
								url: `/blog?author=${author.slug}`,
							},
						],
					},
				],
				style: {
					background: `#fff`,
					align: "left",
					justify: "left",
					columns: 1,
					itemAlign: "left",
					itemJustify: "left",
					itemBackground: `#f2f2f2`,
				},
			},
		],
	};
	await fs.writeFile(
		`./content/pages/blog/${ctx.slug}.json`,
		JSON.stringify(pageJson)
	);
	const content = [
		hSection,
		{
			module: "image-block--hero-image-split",
			subtitle: new Date(ctx.pub_date).toDateString().toUpperCase(),
			title: await ctx.title,
			description: `<div class='uk-flex uk-flex-middle uk-margin-large-top'><div class='uk-margin-small-right uk-width-auto'><img class='uk-border-circle' src='${author.image.url}' width='80px' alt='${author.title}'></div><div class='uk-width-auto'><div class='uk-head-font label uk-margin-remove-bottom uk-h4'>by ${author.title}</div></div></div>`,
			image: {
				url: await ctx.image,
			},
			style: {
				background: `#f2f2f2`,
				align: "left",
				justify: "left",
				spacing: "md",
				container: "md",
				mediaWidth: "1/2",
			},
		},
		{
			module: "image-stack--blog-article",
			subtitle: "",
			title: "",
			description: await blogContent.content,
			items: [
				{
					subtitle: "ABOUT AUTHOR",
					title: await author.title,
					description: await author.description,
					image: {
						url: "",
						alt: "Image",
					},
					ctas: [
						{
							label: `Blogs by ${author.title}`,
							url: `/blog?author=${author.slug}`,
						},
					],
				},
			],
			style: {
				background: `#fff`,
				align: "left",
				justify: "left",
				columns: 1,
				itemAlign: "left",
				itemJustify: "left",
				itemBackground: `#f2f2f2`,
			},
		},
		fSection,
	];
	const config = {
		headers: {
			Authorization: `Bearer ${process.env.PQKEY}`,
		},
	};
	const pghtml = await axios
		.post(`${process.env.API_URL}/gethtml`, { meta, content }, config)
		.then((response) => response.data)
		.then((data) => data.html);
	return {
		props: {
			pagectx: { meta, content },
			pghtml,
		},
	};
}

export async function getStaticPaths() {
	const contentDir = await path.join(
		process.cwd(),
		"content",
		"collections",
		"blog"
	);
	const filenames = await klawSync(contentDir, { nodir: true });

	const paths = await filenames.map((filename) => ({
		params: {
			slug: filename.path
				.toString()
				.split("blog")
				.pop()
				.slice(0, -4)
				.slice(1, -1)
				.split("/"),
		},
	}));
	return {
		paths,
		fallback: false,
	};
}
