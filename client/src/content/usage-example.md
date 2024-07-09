```javascript
// Include your access token in authorization headers on requests.

const res = await fetch(url, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await res.json();
```