const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const client = require('./database');

app.use(express.json());

app.post('/api/check-code', async (req, res) => {
  const { code } = req.body;

  try {
    await client.connect();
    const collection = client.db('compete').collection('codes');

    const existingCode = await collection.findOne({ code });

    if (existingCode) {
      res.json({ valid: false });
    } else {
      res.json({ valid: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await client.close();
  }
});

app.post('/api/submit', async (req, res) => {
  const { code, fullName, email, address, bestPlayer } = req.body;

  try {
    await client.connect();
    const codeCollection = client.db('compete').collection('codes');
    const userDataCollection = client.db('compete').collection('user_data');

    const existingCode = await codeCollection.findOne({ code });

    if (existingCode) {
      res.status(400).json({ message: 'This code has already been used' });
      return;
    }

    await codeCollection.insertOne({ code });
    await userDataCollection.insertOne({ fullName, email, address, bestPlayer });

    const voucher = storeUserDataAndGenerateVoucher({ hexCode: code });
    res.json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await client.close();
  }
});


function storeUserDataAndGenerateVoucher ({ hexCode }) {
  const isFreeFootball = Math.random() < 0.01;
  if (isFreeFootball) {
    return { code: hexCode, discount: 'FREEFOOTBALL' };
  } else {
    return { code: hexCode, discount: '10PERCENTOFF' };
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
