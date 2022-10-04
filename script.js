
var tagAction = () => {
    var button = document.querySelector("#createHashTags .tags_button");
    // console.log(button);
    button.addEventListener('click', (event) => {
        event.preventDefault();
        
        var tagsArea = document.querySelector("#createHashTags #tags").value;
        var tagsResultArea = document.querySelector("#createHashTags #tags-result");
        
        // console.log(tagsArea, tagsResultArea);

        var myArray1 = tagsArea.split(/\r?\n/).map((currentValue) => {
            currentValue = currentValue.replace(/\s/g, '_').replace(/-/g, '_');
            // for (var i = 0; i < str.length; i++) {
            //     alert(str.charAt(i));
            // }

            return currentValue.charAt(0) != "#" ? "#" + currentValue: currentValue;
            
        }).filter((el) => {
            return el != "#";//пустой элемент
            // return true;
        });

        var myArray2 = tagsArea.split(/\r?\n/).map((currentValue) => {
            currentValue = currentValue.replace(/\s/g, '').replace(/-/g, '');
            // + '\n\n\n' + currentValue.replace(/\s/g, '');

            return currentValue.charAt(0) != "#" ? "#" + currentValue: currentValue;
            
        }).filter((el) => {
            return el != "#";//пустой элемент
            // return true;
        });



        var result = myArray1.join('\n') + '\n\n\n' + myArray2.join('\n');

        tagsResultArea.value = result;

        // console.log(result);

    });
}

tagAction();


//-----------------------------------------------------------
// Need to run node server C:\Users\Admin\OneDrive\Рабочий стол\кам\сервисы\script>node index.js
//-------------------------------------------------------------

var googleKeysAction = () => {
    var button = document.querySelector("#parseGoogleKeys .tags_button");
    // console.log(button);
    button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(button);
        //Get words to array
        var tagsArea = document.querySelector("#parseGoogleKeys #tags").value;
        var tagsResultArea = document.querySelector("#parseGoogleKeys #tags-result");
        tagsResultArea.value = "Загрузка...";
        // console.log(tagsArea, tagsResultArea);
        // const i = 1;
        var wordsArray = tagsArea.split(/\r?\n/).map((word, index) => {
            if(!word) return;
            word = word.replace(/\s/g, '+');
        
            fetch('http://localhost:2020/key/'+word,{headers: { 'Content-Type': 'text/plain; charset=utf-8' }})
            .then(response => response.json()
            //     {
            //     console.log(response.json());
            //     // let res = response.json();
            //     // let keys = res.keys;
            //     // let text = keys.join('\n');
            //     // tagsResultArea.value = text;
            // }
            )
            .then((res) => {
                if(tagsResultArea.value == "Загрузка...") tagsResultArea.value = "";
                let keys = res.result.keys;
                
                let text = keys.map((item) => {
                    return item.k;
                }).join('\n');
                console.log(text);
                tagsResultArea.value += text+'\n';
            })
            .catch(err => console.error(err));
            // i++;
            });


    });
}

googleKeysAction();