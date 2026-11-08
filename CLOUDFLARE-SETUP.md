# CocoX Obfuscater — Cloudflare Pages setup

## 1. Upload to GitHub
Upload this entire project to a new GitHub repository.

## 2. Create a Cloudflare Pages project
In Cloudflare Dashboard:
1. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select your repository.
3. Build command: `npm run build`
4. Build output directory: `public`
5. Deploy.

The `functions/api` folder contains the Cloudflare Pages API routes:
- `POST /api/validate`
- `POST /api/obfuscate`

## 3. Use your custom domain
Add `cocox.wtf` to the Pages project in **Custom domains**.
The site redirects the root domain to `/obfuscater/`, so the main URL is:

`https://cocox.wtf/obfuscater/`

## Important
This project uses the original open-source Luau parser/obfuscator. Test the deployed build with your own scripts before relying on it for production use.
