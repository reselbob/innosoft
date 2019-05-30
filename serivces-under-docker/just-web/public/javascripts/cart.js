

function paintCart(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'cart', true);
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        paint(JSON.parse(xhr.responseText)[0]);
      }
    };
    xhr.send();

    paint = function(data){
        const div = document.createElement("div");
        div.setAttribute('class','outlined')
        div.appendChild(document.createTextNode( "Ajax cart " +data._id));
        const items = document.createElement("ol");
        data.items.forEach(x=> { 
            const li = document.createElement('li');
            li.appendChild(document.createElement('strong'))
                .appendChild(document.createTextNode(x));
            items.appendChild(li);
        })
        div.appendChild(items);
        document.getElementsByTagName('body')[0].appendChild(div);
    }
}
