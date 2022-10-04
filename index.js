// const http = require('http');
 
// const requestListener = (req, res)=>{
//   console.log("Request is Incoming");
     
//   const responseData = {
//       message:"Hello, GFG Learner",
//     articleData:{
//         articleName: "How to send JSON response from NodeJS",
//         category:"NodeJS",
//         status: "published"
//     },
//     endingMessage:"Visit Geeksforgeeks.org for more"
//   }
   
//   const jsonContent = JSON.stringify(responseData);
//   res.end(jsonContent);
// };
 
// const server = http.createServer(requestListener);
 
// server.listen(3000,'localhost', function(){
//     console.log("Server is Listening at Port 3000!");
// });


//Run node index.js in terminal
//Url to api http://localhost:2020/
const express = require('express');
const cors = require('cors');
const cheerio = require("cheerio");
const axios = require("axios");
const pretty = require("pretty");

const app = express();

app.use(cors());

app.get('/key/:name', (req, res) => {
    //Get info to api endpoint
    let q = req.params.name;
    q = decodeURI(q);
    console.log(q);
    getKeysInfo(q).then(
        function (response) {
            res.json({
                result: response
            });
        }
        
    );
});

// app.get('/:name', (req, res) => {
//     let name = req.params.name;

//     res.json({
//         message: `Hello ${name}`
//     });

    
// });

app.listen(2020, () => {
    console.log('server is listening on port 2020');
});


// function getSearch(q = "elon musk") {
//     // const searchString = "elon musk";                   // what we want to search
//     const encodedString = encodeURI(q); 
//     getNewsInfo(encodedString).then(console.log('bfdbb'));
// }    


/////////////////////////////////////////////////////
//Get news
/////////////////////////////////////////////////////
function getNewsInfo(q) {
    const encodedString = encodeURI(q); 

    const AXIOS_OPTIONS = {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
        },                                                  // adding the User-Agent header as one way to prevent the request from being blocked
        params: {
            q: encodedString,                               // our encoded search string        
            // tbm: "nws",                                     // parameter defines the type of search you want to do ("nws" means news)
            // hl: 'en',                                       // Parameter defines the language to use for the Google search
            // gl: 'us'                                        // parameter defines the country to use for the Google search
        },
    };


    return axios
        .get(`http://google.com/search`, AXIOS_OPTIONS)
        .then(function ({ data }) {
            let $ = cheerio.load(data);

            const pattern = /s='(?<img>[^']+)';\w+\s\w+=\['(?<id>\w+_\d+)'];/gm;
            const images = [...data.matchAll(pattern)].map(({ groups }) => ({ id: groups.id, img: groups.img.replace('\\x3d', '') }))

            const allNewsInfo = Array.from($('.WlydOe')).map((el) => {
                return {
                    link: $(el).attr('href'),
                    source: $(el).find('.CEMjEf span').text().trim(),
                    title: $(el).find('.mCBkyc').text().trim().replace('\n', ''),
                    snippet: $(el).find('.GI74Re').text().trim().replace('\n', ''),
                    image: images.find(({ id, img }) => id === $(el).find('.uhHOwf img').attr('id'))?.img || "No image",
                    date: $(el).find('.ZE0LJd span').text().trim(),
                }
            });

            return allNewsInfo;
        });
    }
///////////////////////////////////////////////////

/////////////////////////////////////////////////////
//Get search related keywords
/////////////////////////////////////////////////////
function getKeysInfo(q) {
    // const encodedString = encodeURI(q); 
    const encodedString = q; 

    const AXIOS_OPTIONS = {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
        },                                                  // adding the User-Agent header as one way to prevent the request from being blocked
        params: {
            q: encodedString,                               // our encoded search string        
            oq: encodedString,
            // ie=UTF-8
            // tbm: "nws",                                     // parameter defines the type of search you want to do ("nws" means news)
            // hl: 'en',                                       // Parameter defines the language to use for the Google search
            //gl: 'us'                                        // parameter defines the country to use for the Google search
            
            
        },
    };


    return axios
        .get(`http://google.com/search`, AXIOS_OPTIONS)
        .then(function ({ data }) {
            let $ = cheerio.load(data);

            const keys = Array.from($('.AJLUJb')).map((el) => {

                const a = $(el).find('a');

                const k = Array.from(a).map((line) => {
                    return {k: $(line).text().trim()};
                });

                return k;
                
            });

            let column1 = keys[0];
            let column2 = keys[1];
            let joinColumn = column1.concat(column2);


            let result = {
                count: $('#result-stats').text().trim() + "for: " + q,
                // keys: keys.map((item) => {
                //     return item;
                // })
                keys: joinColumn
            }

            return result;
        });
    }