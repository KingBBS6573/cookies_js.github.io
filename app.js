const today = new Date();
const next_week = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
console.log(today);
console.log(next_week);

const affichage = document.querySelector('.affichage');
const boutons = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
const info_txt = document.querySelector('.info_txt');
let dejaFait = false;       

let jour = ('0' + next_week).slice(9,11);
console.log(jour); 
let mois = ('0' + (today.getMonth()+1)).slice(-2);
let annee = today.getFullYear();
document.querySelector('input[type=date]').value = `${annee}-${mois}-${jour}`;

boutons.forEach(btn => {
    btn.addEventListener('click',btnAction);
})


function btnAction(e) {
    let new_objet = {};

    inputs.forEach(input=> {
        let input_name = input.getAttribute('name');
        let input_value = input_name !== "cookie_expire" ? input.value : input.valueAsDate;
        new_objet[input_name] = input_value;
        console.log(new_objet);
    })

    let description = e.target.getAttribute('data-cookie');

    if(description === 'creer') {
        creerCookie(new_objet.cookie_name, new_objet.cookie_value, new_objet.cookie_expire);
    }
    else if(description === 'afficher_cookies') {
        listCookies();
    }
}


function creerCookie(nom, valeur, date_expire) {

    info_txt.innerText = "";
    affichage.innerHTML = "";

    // Comparer les noms des cookies et eviter les redondances
    let cookies = document.cookie.split(';');
    cookies.forEach(cookies => {
        cookies = cookies.trim();

        let format_cookies = cookies.split('=');
        if(format_cookies[0] === encodeURIComponent(nom)) {
            dejaFait = true;
        }
    })
    console.log(cookies); 

    if(dejaFait){
        info_txt.innerText = `Un cookie possède déjà ce nom`;
        dejaFait = false;
        return;
    }

    // Verifier si le cookie possede un nom
    if(nom.length === 0) {
        info_txt.innerText = `Impossible de créer un cookie sans nom`;
        return;
    }
    
    document.cookie = `${encodeURIComponent(nom)}=${encodeURIComponent(valeur)}; expire=${date_expire.toUTCString()}`;

    let info = document.createElement('li');
    info.innerText = `Cookie ${nom} créé avec succès !!!`;
    affichage.appendChild(info);

    setTimeout(() => {
        info.remove();
    }, 1500)
}


function listCookies() {

    let cookies = document.cookie.split(';');

    if(cookies.join() === "") {
        info_txt.innerText = `Aucun cookie disponible`;
        return;
    }

    cookies.forEach(cookie => {

        cookie = cookie.trim();
        let format_cookies = cookie.split('=');

        console.log(format_cookies);

        let item = document.createElement('li');

        info_txt.innerText = `Cliquez sur un cookie pour le supprimer`;
        item.innerText = `Nom: ${decodeURIComponent(format_cookies[0])}, Valeur: ${decodeURIComponent(format_cookies[1])}`;
        affichage.appendChild(item);

        // Suppression des cookies

        item.addEventListener('click', () => {
            document.cookie = `${format_cookies[0]}=; expires=${new Date(0)}`;
            item.innerText = `Le cookie ${format_cookies[0]} supprimé avec succès`;
            setTimeout(() => {
                item.remove();
            }, 1500);
        })
    })
}