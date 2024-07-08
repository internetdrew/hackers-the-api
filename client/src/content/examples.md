```javascript
// Just add your auth token to your headers on requests

const res = await fetch(url, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await res.json();
```
