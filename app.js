const fs = require("fs"),
  file = "sounds.txt",
  path = require("path"),
  axios = require("axios");

if (fs.existsSync("Sound")) fs.rmSync("Sound", { recursive: true });
fs.readFile(file, "utf8", (err, data) => {
  if (err) return console.error(err);
  if (!data)
    return console.error(`File ${b}sounds.txt${r} is empty or doesn't exist!`);

  data = data.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  const sounds = data.split("\n");

  const sep = path.sep,
    b = "\x1b[1m",
    r = "\x1b[0m",
    time = Date.now(),
    promises = [];

  sounds.forEach((snd) => {
    if (!snd) return sounds.splice(sounds.indexOf(snd), 1);

    const url = `https://wow.tools/files/scripts/api.php?draw=38&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=25&search%5Bvalue%5D=${snd}%2Ctype%3Aogg&search%5Bregex%5D=false&_=1695962035525`;

    promises.push(
      axios
        .get(url)
        .then((res) => {
          let filePath = res.data["data"][0][1].replace(/\//g, sep);
          filePath = filePath.charAt(0).toUpperCase() + filePath.slice(1);
          const dirPath = path.dirname(filePath);

          if (!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath, { recursive: true });

          fs.writeFileSync(filePath, "");
          fs.writeFileSync(
            filePath.slice(0, -3) + "wav",
            'RIFF$   WAVEfmt      +  "V    data    '.replace(
              /(?<!fmt) /g,
              "\x00"
            )
          ); // empty .wav file
        })
        .catch((err) => {
          if (err.message.includes("Cannot read properties")) {
            console.error(`Sound ${b}${snd}${r} wasn't found! Skipping it..`);
            return sounds.splice(sounds.indexOf(snd), 1);
          }
        })
    );
  });

  Promise.all(promises)
    .then(() => {
      console.log(`Done in ${Date.now() - time}ms!`);

      console.log(`Sounds muted (${sounds.length}):`);
      console.log(sounds);

      console.log(`\nMove the generated ${b}Sound${r} folder to ${b}WoW_Client${sep}Data${sep}enUS${sep}${r}

${b}Note${r}: You might have a different language folder than ${b}enUS${r}
if so, just move the ${b}Sound${r} folder to your language folder.

${b}If you experience any issues, report them on the GitHub repository:
https://github.com/mattibalize-lab/MuteSounds${r}\n`);

      console.log(`Press ${b}Enter${r} to exit...`);
      process.stdin.on("data", () => {
        process.exit();
      });
    })
    .catch((err) => {
      return console.error(err);
    });
});
