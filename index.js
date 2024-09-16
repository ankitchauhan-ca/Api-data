const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");

const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

app.get("/api/data/page/:pageNumber", (req, res) => {
  const page = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;
  const data = readData();

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = data.slice(startIndex, endIndex);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  if (page > totalPages) {
    return res.status(404).json({ error: "Page not found" });
  }

  res.json({
    items,
    total,
    totalPages,
    currentPage: page,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
