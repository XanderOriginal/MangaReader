import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.mangadex.org";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    // Запитуємо конкретні ID + обкладинки
    const result = await axios.get(API_URL + "/manga?includes[]=cover_art&ids[]=02860cdf-1020-40f1-a23f-2025d80f6290&ids[]=418791c0-35cf-4f87-936b-acd9cddf0989");
    console.log(result.data.data[0].relationships);
    res.render("index.ejs", { mangaData: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch manga data" });
  }
});

app.get("/search", async (req, res) => {
  const searchQuery = req.query.query; // Для GET-запитів дані прилітають у req.query
  try {
    const result = await axios.get(API_URL + `/manga`, {
      params: {
        title: searchQuery,
        "includes[]": "cover_art"
      }
    });
    console.log(result.data.data);
    res.render("index.ejs", { mangaData: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch manga data" });
  }
});

app.get("/manga/:id", async (req, res) => {
  const mangaId = req.params.id;
  try {
    const result = await axios.get(API_URL + `/manga/${mangaId}?includes[]=cover_art`);
    res.render("manga.ejs", { mangaData: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch manga data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});