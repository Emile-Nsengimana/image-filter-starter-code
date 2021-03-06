import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import fs, { ReadStream } from "fs";
import axios from "axios";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req:express.Request, res:express.Response) => {
    try {
      const url:string = req.query.image_url;
      if (!url) return res.status(400).json({ error: "wrong or unsupported parameter" });
      axios.get(url).then(async (resp) => {
        if (resp.status === 200) {
          const imagePath:string = await filterImageFromURL(url);
          var readStream:ReadStream = fs.createReadStream(imagePath);
          
          readStream.pipe(res);
          deleteLocalFiles([imagePath]);
        }
      }).catch((error) => {
        if (error.request) res.status(404).json({ error: 'image not found' });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'server error' });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();