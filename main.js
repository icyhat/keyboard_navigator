
// alpha record str
const keys_rec = "qwertyuiop, asdfghjkl, zxcvbnm";
const sites_init = "amazon.com, opera.com, zhihu.com, v2ex.com";

// keys: "abc#def" => [[a,b,c], [d,e,f]]
const keys_arr = (function() {
    let result = [];
    keys_rec.split(", ").forEach(e => {
        result.push(e.split(""));
    });
    return result;
})();
// init sites_map, check local 
const sites_map = (function(){
    const local_sites_map = JSON.parse(localStorage.getItem("local_sites_map")||null);
    if(local_sites_map) {
        return local_sites_map;
    } else {
        // "qq.com, ..." => {"q": "http://qq.com", ...}
        let result = {};
        // add sites to map
        sites_init.split(", ").forEach(site => {
            result[site.charAt(0)] = "https://" + site;
        });
        // add undefined key, e.g. a: undefined
        keys_arr.forEach(line => {
            line.forEach(key => {
                if(result[key]==undefined) {
                    result[key] = undefined;
                }
            })
        });
        return result;
    }
})();

// create div according to keys_arr
keys_arr.forEach(line => {
    const main_div = append_element("div", main);
    line.forEach(key => {
        const main_kbd = append_element("kbd", main_div);
        main_kbd.textContent = key.toUpperCase();
        const kbd_button = append_element("button", main_kbd);
        kbd_button.textContent = "✍";
        kbd_button.id = "button_" + key;
        const kbd_img = append_element("img", main_kbd);
        if (sites_map[key]!==undefined) {
            kbd_img.src = sites_map[key] + "/favicon.ico";
        } else {
            kbd_img.src = "./image/blank.png";
        }
        // events
        kbd_button.onclick = function (btn_event) {
            const new_site = prompt("input new sites!");
            if (new_site) {
                sites_map[key] = "https://" + new_site;
                kbd_img.src = sites_map[key] + "/favicon.ico";
                localStorage.setItem("local_sites_map", JSON.stringify(sites_map));
            }
        };
        kbd_img.onerror = function (e) {
            e.target.src = "./image/blank.png";
        };
    });
});

// add event to kbd
document.onkeypress = function (kb_event) {
    const key = kb_event["key"];
    const site = sites_map[key];
    if(sites_map[key]) {
        window.open(site, "_blank");
    } else {
        alert("no related site on the key..")
        document.getElementById("button_" + key).click();
    }
}

// create and append element
function append_element(e, main) {
    const foo = document.createElement(e);
    main.appendChild(foo);
    return foo;
}