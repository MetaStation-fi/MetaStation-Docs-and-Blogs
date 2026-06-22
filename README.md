# MetaStation Docs

Documentation and blog site for MetaStation, built with Docusaurus 3.

## URLs

- Docs: `metastation.fi/docs/`
- Blog: `metastation.fi/blogs/`

## Development

```bash
npm install
npm start        # dev server at localhost:3000
npm run build    # build to /build
npm run serve    # preview the build
```

## Deploy (VPS)

```bash
npm run build
rsync -avz build/ user@yourserver:/var/www/metastation-docs/build/
```

## Nginx config

```nginx
location /docs {
    root /var/www/metastation-docs/build;
    try_files $uri $uri/ /docs/index.html;
}

location /blogs {
    root /var/www/metastation-docs/build;
    try_files $uri $uri/ /blogs/index.html;
}
```

## Adding blog posts

Create a file in `/blog/` with this format:

```
blog/2026-06-20-my-post.md
```

Frontmatter:

```yaml
---
slug: my-post
title: My Post Title
authors: [metastation]
tags: [announcement, guide]
---
```
