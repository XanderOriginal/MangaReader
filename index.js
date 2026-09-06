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
    const result = await axios.get(API_URL + "/manga?includes[]=cover_art&limit=10");
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
    const mangaRes = await axios.get(`${API_URL}/manga/${mangaId}?includes[]=cover_art`);
        
        
    const chaptersRes = await axios.get(`${API_URL}/manga/${mangaId}/feed`, {
            params: {
          "order[chapter]": "desc",
          "order[volume]": "desc",
          limit: 500
            }
        });
    res.render("manga.ejs", { mangaData: mangaRes.data, chaptersData: chaptersRes.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch manga data" });
  }
});

app.get("/read/:id", async (req, res) => {
  const chapterId = req.params.id;
  try {
   
    const pagesRes = await axios.get(`${API_URL}/at-home/server/${chapterId}`);
    
    
    const infoRes = await axios.get(`${API_URL}/chapter/${chapterId}?includes[]=manga`);
    const chapterInfo = infoRes.data.data;
    
    const chapterNum = chapterInfo.attributes.chapter ? `Ch. ${chapterInfo.attributes.chapter}` : "Oneshot";
    const chapterName = chapterInfo.attributes.title ? `- ${chapterInfo.attributes.title}` : "";
    const fullChapterTitle = `${chapterNum} ${chapterName}`;
    
    const mangaRel = chapterInfo.relationships.find(rel => rel.type === "manga");
    const mangaId = mangaRel ? mangaRel.id : "";
    
    let mangaTitle = "Manga Reader";
    if (mangaRel && mangaRel.attributes && mangaRel.attributes.title) {
        mangaTitle = mangaRel.attributes.title.en || Object.values(mangaRel.attributes.title)[0];
    }

  
    let prevChapterId = null;
    let nextChapterId = null;

    if (mangaId) {
        const feedRes = await axios.get(`${API_URL}/manga/${mangaId}/feed`, {
            params: {
                "translatedLanguage[]": "en",
                order: { chapter: "asc" }, 
                limit: 500
            }
        });

        const allChapters = feedRes.data.data;
     
        const currentIndex = allChapters.findIndex(ch => ch.id === chapterId);

       
        if (currentIndex > 0) {
            prevChapterId = allChapters[currentIndex - 1].id;
        }
        
        if (currentIndex < allChapters.length - 1) {
            nextChapterId = allChapters[currentIndex + 1].id;
        }
    }

    res.render("chapters.ejs", { 
      baseUrl: pagesRes.data.baseUrl,      
      hash: pagesRes.data.chapter.hash,    
      pages: pagesRes.data.chapter.data,
      chapter: { title: fullChapterTitle }, 
      manga: { id: mangaId, title: mangaTitle },
      prevChapter: prevChapterId,  
      nextChapter: nextChapterId   
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chapter pages" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});