const express = require('express');
const whois = require('whois-json');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend communication
const PORT = 5000;

app.get('/check-domain', async (req, res) => {
  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const whoisData = await whois(domain);
    console.log("WHOIS Response:", whoisData); // Debugging

    let isAvailable = false;

    if (!whoisData || Object.keys(whoisData).length === 0) {
      isAvailable = true; // No WHOIS data means available
    } else if (whoisData.status && whoisData.status.toLowerCase().includes('available')) {
      isAvailable = true;
    } else if (whoisData.domainName === undefined) {
      isAvailable = true;
    }

    res.json({ domain, available: isAvailable });
  } catch (error) {
    console.error("Error fetching WHOIS data:", error);
    res.status(500).json({ error: 'Error checking domain' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
