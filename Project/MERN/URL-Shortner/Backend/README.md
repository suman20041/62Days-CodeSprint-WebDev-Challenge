# ⚙️ Trimly Backend

This is the backend service for **Trimly URL Shortener**.

It handles:

* URL shortening
* Database storage
* URL redirection

---

# 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Nanoid

---

# 📦 Installation

Install dependencies

```
npm install
```

Run server

```
npm run dev
```

---

# 🌐 API Routes

### Create Short URL

POST

```
/short
```

Body

```
{
  "originalUrl": "https://example.com"
}
```

Response

```
{
  "message": "Url shorten successfully",
  "shortenUrl": "xIJGGJT1"
}
```

---

### Redirect to Original URL

GET

```
/:shortId
```

Example

```
https://trimly-back.vercel.app/xIJGGJT1
```

The server finds the original URL in MongoDB and redirects the user.

---

# 🧠 Database Schema

```
{
  originalUrl: String,
  shortId: String
}
```

---

# 🚀 Deployment

Backend deployed on:

```
Vercel
```
