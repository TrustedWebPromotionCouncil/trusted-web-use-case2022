import app from "../routes/app";

const port = 3000;
app.listen(port, () => {
  console.log(`DWN running on port: ${port}`);
});
